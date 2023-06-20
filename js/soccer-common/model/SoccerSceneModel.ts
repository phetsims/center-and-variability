// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for the scene model in a screen. The Median and Mean & Median screens only have one scene model.
 * The Variability screen has 4 scene models.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */


import soccerCommon from '../soccerCommon.js';
import SoccerBall from './SoccerBall.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TModel from '../../../../joist/js/TModel.js';
import SoccerPlayer from './SoccerPlayer.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import Pose from './Pose.js';
import { SoccerBallPhase } from './SoccerBallPhase.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { TKickDistanceStrategy } from './TKickDistanceStrategy.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import ObjectLiteralIO from '../../../../tandem/js/types/ObjectLiteralIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import basicKick_mp3 from '../../../sounds/basicKick_mp3.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import SoccerCommonConstants from '../SoccerCommonConstants.js';
import SoccerCommonQueryParameters from '../SoccerCommonQueryParameters.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const kickSound = new SoundClip( basicKick_mp3, { initialOutputLevel: 0.2 } );
soundManager.addSoundGenerator( kickSound );

type SelfOptions = EmptySelfOptions;
export type SoccerSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.5; // in seconds

export default class SoccerSceneModel<T extends SoccerBall = SoccerBall> extends PhetioObject implements TModel {
  public readonly soccerBalls: T[];

  // The number of stacked soccer balls
  public readonly stackedSoccerBallCountProperty: NumberProperty;

  // The max kickable (highest value in the combo box, if there is one)
  private readonly maxKicksLimit: number;

  public readonly meanValueProperty: Property<number | null>;

  public readonly isVisibleProperty: Property<boolean> = new BooleanProperty( true );

  // Signify whenever any object's value or position changes
  public readonly objectChangedEmitter = new Emitter();

  public readonly timeProperty: NumberProperty;

  public readonly objectValueBecameNonNullEmitter: TEmitter;
  public readonly resetEmitter: TEmitter = new Emitter();
  public readonly numberOfDataPointsProperty: NumberProperty;

  public readonly soccerPlayers: SoccerPlayer[];

  private readonly numberOfScheduledSoccerBallsToKickProperty: NumberProperty;
  public readonly numberOfUnkickedBallsProperty: TReadOnlyProperty<number>;
  public readonly hasKickableSoccerBallsProperty: TReadOnlyProperty<boolean>;

  // Takes the same values as hasKickableSoccerBallsProperty, but updated synchronously during step() so it never
  // goes through incorrect intermediate values. See https://github.com/phetsims/center-and-variability/issues/77
  public readonly hasKickableSoccerBallsStableProperty: BooleanProperty;

  private readonly timeWhenLastBallWasKickedProperty: NumberProperty;

  // Starting at 0, iterate through the index of the kickers. This updates the SoccerPlayer.isActiveProperty to show the current kicker
  private readonly activeKickerIndexProperty: NumberProperty;

  // Called when the location of a ball changed within a stack, so the pointer areas can be updated
  public readonly stackChangedEmitter = new Emitter<[ SoccerBall[] ]>( {

    // We don't really need a runtime type check because TypeScript checks at type checking time
    // But we need a way to describe this parameter
    parameters: [ { isValidValue: element => Array.isArray( element ) } ]
  } );

  // During a reset, do not update data measures for every soccer ball.
  // This is to avoid performance issues when the data is cleared.
  public isClearingData = false;

  public constructor(
    public readonly maxKicksProperty: TReadOnlyProperty<number>,
    maxKicksChoices: number[],
    public kickDistanceStrategy: TKickDistanceStrategy,
    public readonly physicalRange: Range,
    public readonly kickDistanceStrategyFromStateObject: ( string: string ) => TKickDistanceStrategy,
    createSoccerBall: ( isFirstSoccerBall: boolean, options: { tandem: Tandem } ) => T,
    providedOptions: SoccerSceneModelOptions
  ) {

    // TODO: should we move styles like this into studio? See https://github.com/phetsims/center-and-variability/issues/117
    const pre = '<pre style="display: block; padding: 10px; border: 1px solid #ccc; border-radius: 3px; overflow: auto;">';
    const code = '<code style="background-color: #f9f9f9; font-family: \'Courier New\', Courier, monospace;">';

    const options = optionize<SoccerSceneModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: true,
      phetioType: CAVSceneModelIO,
      phetioDocumentation: 'The model for the CAV scene, which includes the soccer balls and the soccer players. The ' +
                           'values for the kicks can be specified using the state object. <br><ul>' +
                           `<li>Random Skew: randomly chooses a left or right skewed distribution each time the sim is reset. (Recall that a right-skewed data set means most of the values fall to the left.) ${pre}${code}{ "distributionType": "randomSkew[currentlyRightSkewed]" }</code></pre></li>` +
                           `<li>Probability Distribution by Distance: The distribution of probabilities of where the balls will land is represented as an un-normalized array of non-negative, floating-point numbers, one value for each location in the physical range e.g., ${pre}${code}{ "distributionType": "probabilityDistributionByDistance[0,0,1,3,5,7,3,3,1,1,0,0,0,0,1]" }</code></pre></li>` +
                           `<li>Exact Location each ball will land (in order). Indicates the exact distance each ball will be kicked in order. Keep in mind the maximum number of kicks may be as high as 30, depending on the selection in the preferences dialog. e.g., ${pre}${code}{ "distributionType": "exactDistanceByIndex[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,2]" }</code></pre></li>`
    }, providedOptions );

    super( options );

    const updateDataMeasures = () => this.updateDataMeasures();

    this.maxKicksLimit = Math.max( ...maxKicksChoices );

    this.stackedSoccerBallCountProperty = new NumberProperty( 0, {
      range: new Range( 0, this.maxKicksLimit ),
      tandem: options.tandem.createTandem( 'stackedSoccerBallCountProperty' )
    } );
    this.soccerBalls = _.range( 0, this.maxKicksLimit ).map( index => {

      const soccerBall = createSoccerBall( index === 0, {
        tandem: options.tandem.createTandem( 'soccerBalls' ).createTandem1Indexed( 'soccerBall', index )
      } );

      // When the soccer ball drag position changes, constrain it to the physical range and move it to the top, if necessary
      soccerBall.dragPositionProperty.lazyLink( ( dragPosition: Vector2 ) => {
        soccerBall.valueProperty.value = Utils.roundSymmetric( this.physicalRange.constrainValue( dragPosition.x ) );
      } );

      soccerBall.soccerBallLandedEmitter.addListener( soccerBall => {
        this.animateSoccerBallToTopOfStack( soccerBall, soccerBall.valueProperty.value! );

        // If the soccer player that kicked that ball was still in line when the ball lands, they can leave the line now.
        if ( soccerBall.soccerPlayer === this.getFrontSoccerPlayer() ) {
          this.advanceLine();
        }

        this.objectValueBecameNonNullEmitter.emit();
      } );

      // We only want this to fire if the valueProperty of a ball is changed after it has landed.
      // If oldValue is null, it means that the ball is going from FLYING to STACKING,
      // in which case we want it to animate to the top of the stack.
      soccerBall.valueProperty.lazyLink( ( value, oldValue ) => {
        if ( value !== null && !isSettingPhetioStateProperty.value && oldValue !== null ) {
          const oldStack = this.getStackAtLocation( oldValue );
          if ( oldStack.length > 0 ) {
            this.reorganizeStack( oldStack );
            this.clearAnimationsInStack( oldStack );
          }

          const objectsAtTarget = this.soccerBalls.filter( otherSoccerBall => {
            return otherSoccerBall.valueProperty.value === soccerBall.valueProperty.value && soccerBall !== otherSoccerBall;
          } );

          // Sort from bottom to top, so they can be re-stacked. The specified object will appear at the top.
          const sortedOthers = _.sortBy( objectsAtTarget, object => object.positionProperty.value.y );
          const newStack = [ ...sortedOthers, soccerBall ];
          this.reorganizeStack( newStack );
          this.clearAnimationsInStack( newStack );
        }
      } );

      soccerBall.dragStartedEmitter.addListener( () => {
        const stack = this.getStackAtLocation( soccerBall.valueProperty.value! );
        this.reorganizeStack( stack );
        this.clearAnimationsInStack( stack );
      } );

      // Signal to listeners that a value changed, but batch notifications during reset
      const guardedEmit = () => {
        if ( !this.isClearingData ) {
          this.objectChangedEmitter.emit();
        }
      };
      soccerBall.valueProperty.link( guardedEmit );
      soccerBall.positionProperty.link( guardedEmit );

      return soccerBall;
    } );

    this.soccerBalls.forEach( soccerBall => {
      soccerBall.soccerBallPhaseProperty.link( soccerBallPhase => {
        if ( soccerBallPhase === SoccerBallPhase.STACKED ) {
          this.stackedSoccerBallCountProperty.value =
            this.getActiveSoccerBalls().filter( soccerBall =>
              soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED ).length;
        }
      } );
    } );


    this.meanValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'meanValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );

    this.numberOfDataPointsProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'numberOfDataPointsProperty' )
    } );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' )
    } );

    this.objectValueBecameNonNullEmitter = new Emitter();

    this.numberOfScheduledSoccerBallsToKickProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'numberOfScheduledSoccerBallsToKickProperty' )
    } );
    this.timeWhenLastBallWasKickedProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeWhenLastBallWasKickedProperty' )
    } );

    this.soccerPlayers = _.range( 0, this.maxKicksLimit ).map( placeInLine => new SoccerPlayer( placeInLine,
      options.tandem.createTandem( 'soccerPlayers' ).createTandem1Indexed( 'soccerPlayer', placeInLine )
    ) );

    this.numberOfUnkickedBallsProperty = DerivedProperty.deriveAny( [
      this.maxKicksProperty,
      this.numberOfScheduledSoccerBallsToKickProperty,
      ...this.soccerBalls.map( soccerBall => soccerBall.soccerBallPhaseProperty ) ], () => {

      const kickedSoccerBalls = this.getActiveSoccerBalls().filter(
        soccerBall => soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.FLYING ||
                      soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKING ||
                      soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED
      );
      const value = this.maxKicksProperty.value - kickedSoccerBalls.length - this.numberOfScheduledSoccerBallsToKickProperty.value;

      return value;
    } );

    this.hasKickableSoccerBallsProperty = new DerivedProperty( [ this.numberOfUnkickedBallsProperty ],
      numberOfUnkickedBalls => numberOfUnkickedBalls > 0 );

    this.hasKickableSoccerBallsStableProperty = new BooleanProperty( this.hasKickableSoccerBallsProperty.value );

    this.activeKickerIndexProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'activeKickerIndexProperty' )
    } );

    Multilink.multilink( [ this.activeKickerIndexProperty, this.maxKicksProperty ], ( activeKickerIndex, maxKicks ) => {
      this.soccerPlayers.forEach( ( soccerPlayer, index ) => {
        soccerPlayer.isActiveProperty.value = index === activeKickerIndex && index < maxKicks;
      } );
    } );

    this.soccerBalls.forEach( soccerBall => {
      soccerBall.valueProperty.link( ( newValue, oldValue ) => {

        // update data measures if the ball is being dragged/moved to a new position after landing/stacking
        if ( oldValue !== null && newValue !== null ) {
          updateDataMeasures();
        }
      } );
      soccerBall.soccerBallPhaseProperty.link( ( newPhase, oldPhase ) => {

        // update data measures when the ball finished its stacking animation
        if ( newPhase === SoccerBallPhase.STACKED ) {
          updateDataMeasures();
        }
      } );
    } );

    maxKicksProperty.lazyLink( maxKicks => this.clearData() );
  }

  // Cancel out all animations in the soccer ball stack.
  private clearAnimationsInStack( stack: SoccerBall[] ): void {
    stack.forEach( soccerBall => soccerBall.clearAnimation() );
  }

  public getDataValues(): number[] {
    const sortedObjects = this.getSortedStackedObjects();

    assert && assert( sortedObjects.length > 0, 'There are no data points to return values for.' );
    return sortedObjects.map( soccerBall => soccerBall.valueProperty.value! );
  }

  protected updateDataMeasures(): void {
    if ( this.isClearingData ) {
      return;
    }

    const sortedObjects = this.getSortedStackedObjects();
    if ( sortedObjects.length > 0 ) {
      this.meanValueProperty.value = _.mean( this.getDataValues() );
    }
    else {
      this.meanValueProperty.value = null;
    }

    this.numberOfDataPointsProperty.value = sortedObjects.length;
  }

  /**
   * Returns all objects at the target location, matching the filter if provided. Note that some logic such as
   * determining where a ball will animate to within a stack depends on the number of balls in the stack (whether STACKING or STACKED)
   * but other logic such as where to draw the median arrow depends on the number of balls in the stack (whether STACKED only).
   */
  public getStackAtLocation( location: number, filter?: ( soccerBall: SoccerBall ) => boolean ): SoccerBall[] {
    const activeSoccerBallsAtLocation = this.getActiveSoccerBalls().filter( soccerBall => {
      return soccerBall.valueProperty.value === location && ( filter ? filter( soccerBall ) : true );
    } );
    return _.sortBy( activeSoccerBallsAtLocation, soccerBall => soccerBall.positionProperty.value.y );
  }

  public getTallestStack( filter?: ( soccerBall: SoccerBall ) => boolean ): SoccerBall[] {
    return _.maxBy( this.getStacks( filter ), stack => stack.length )!;
  }

  /**
   * Returns all the stacks in the scene that have at least one object in them, sorted from low value to high value.
   */
  public getStacks( filter?: ( soccerBall: SoccerBall ) => boolean ): SoccerBall[][] {
    return _.range( this.physicalRange.min, this.physicalRange.max + 1 )
      .filter( location => this.getStackAtLocation( location, filter ).length > 0 )
      .map( location => this.getStackAtLocation( location, filter ) );
  }

  /**
   * Returns the top soccer ball in each stack.
   */
  public getTopSoccerBalls(): SoccerBall[] {
    const stacks = this.getStacks();
    return stacks.map( stack => stack[ stack.length - 1 ] );
  }

  /**
   * Set the position of the parameter object to be on top of the other objects at that target position.
   * Cease all animations in the stack and reorganize the stack.
   */
  protected reorganizeStack( soccerBallStack: SoccerBall[] ): void {

    // collapse the rest of the stack. NOTE: This assumes the radii are the same.
    let position = SoccerCommonConstants.SOCCER_BALL_RADIUS;
    soccerBallStack.forEach( soccerBall => {
      soccerBall.positionProperty.value = new Vector2( soccerBall.valueProperty.value!, position );
      position += SoccerCommonConstants.SOCCER_BALL_RADIUS * 2 * ( 1 - SoccerCommonConstants.SOCCER_BALL_OVERLAP );
    } );

    this.stackChangedEmitter.emit( soccerBallStack );
  }

  /**
   * Clears out the data
   */
  public clearData(): void {
    this.isClearingData = true;
    this.numberOfScheduledSoccerBallsToKickProperty.reset();
    this.timeProperty.reset();
    this.timeWhenLastBallWasKickedProperty.reset();

    this.soccerPlayers.forEach( soccerPlayer => soccerPlayer.reset() );
    this.soccerBalls.forEach( soccerBall => soccerBall.reset() );

    this.activeKickerIndexProperty.reset();

    this.isClearingData = false;
    this.updateDataMeasures();

    // This emitter was suppressed during isClearingData, so we must synchronize listeners now
    this.objectChangedEmitter.emit();
  }

  /**
   * Resets the model.
   */
  public reset(): void {

    this.kickDistanceStrategy.reset();

    this.clearData();

    this.resetEmitter.emit();
  }

  public getSortedLandedObjects(): SoccerBall[] {
    return _.sortBy( this.getActiveSoccerBalls().filter( soccerBall => soccerBall.valueProperty.value !== null ),
      object => object.valueProperty.value );
  }

  public getSortedStackedObjects(): T[] {
    return _.sortBy( this.getActiveSoccerBalls().filter( soccerBall =>
        soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED ),

      // The numerical value takes precedence for sorting
      soccerBall => soccerBall.valueProperty.value,

      // Then consider the height within the stack
      soccerBall => soccerBall.positionProperty.value.y
    );
  }

  public getFrontSoccerPlayer(): SoccerPlayer | null {
    return this.soccerPlayers[ this.activeKickerIndexProperty.value ];
  }

  /**
   * Steps the model.
   *
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.timeProperty.value += dt;
    this.getActiveSoccerBalls().forEach( soccerBall => soccerBall.step( dt ) );

    const frontPlayer = this.getFrontSoccerPlayer();

    if ( frontPlayer ) {

      if ( this.numberOfScheduledSoccerBallsToKickProperty.value > 0 &&
           this.timeProperty.value >= this.timeWhenLastBallWasKickedProperty.value + TIME_BETWEEN_RAPID_KICKS ) {

        this.advanceLine();

        if ( frontPlayer.poseProperty.value === Pose.STANDING ) {
          frontPlayer.poseProperty.value = Pose.POISED_TO_KICK;
          frontPlayer.timestampWhenPoisedBeganProperty.value = this.timeProperty.value;
        }
      }

      // How long has the front player been poised?
      if ( frontPlayer.poseProperty.value === Pose.POISED_TO_KICK ) {
        assert && assert( typeof frontPlayer.timestampWhenPoisedBeganProperty.value === 'number', 'timestampWhenPoisedBegan should be a number' );
        const elapsedTime = this.timeProperty.value - frontPlayer.timestampWhenPoisedBeganProperty.value!;
        if ( elapsedTime > 0.075 ) {

          const soccerBall = this.soccerBalls.find( soccerBall =>
            soccerBall.valueProperty.value === null &&
            soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.READY
          );

          // In fuzzing, sometimes there are no soccer balls available
          if ( soccerBall ) {
            this.kickBall( frontPlayer, soccerBall );
            this.numberOfScheduledSoccerBallsToKickProperty.value--;
          }
        }
      }
    }

    this.hasKickableSoccerBallsStableProperty.value = this.hasKickableSoccerBallsProperty.value;
  }

  // Returns a list of the median objects within a sorted array, based on the objects' 'value' property
  protected static getMedianObjectsFromSortedArray<T extends SoccerBall>( sortedObjects: T[] ): T[] {

    // Odd number of values, take the central value
    if ( sortedObjects.length % 2 === 1 ) {
      const midIndex = ( sortedObjects.length - 1 ) / 2;
      return [ sortedObjects[ midIndex ] ];
    }
    else if ( sortedObjects.length % 2 === 0 && sortedObjects.length >= 2 ) {

      // Even number of values, average the two middle-most values
      const mid1Index = ( sortedObjects.length - 2 ) / 2;
      const mid2Index = ( sortedObjects.length - 0 ) / 2;
      return [ sortedObjects[ mid1Index ], sortedObjects[ mid2Index ] ];
    }
    else {
      return [];
    }
  }

  // When a ball lands, or when the next player is supposed to kick (before the ball lands), move the line forward
  // and queue up the next ball as well
  private advanceLine(): void {

    // Allow kicking another ball while one is already in the air.
    // if the previous ball was still in the air, we need to move the line forward so the next player can kick
    const kickers = this.soccerPlayers.filter( soccerPlayer => soccerPlayer.isActiveProperty.value &&
                                                               soccerPlayer.poseProperty.value === Pose.KICKING );
    if ( kickers.length > 0 ) {
      let nextIndex = this.activeKickerIndexProperty.value + 1;
      if ( nextIndex > this.maxKicksProperty.value ) {
        nextIndex = 0;
      }
      this.activeKickerIndexProperty.value = nextIndex;
      const nextBallFromPool = this.soccerBalls.find( ball => ball.soccerBallPhaseProperty.value === SoccerBallPhase.INACTIVE ) || null;
      if ( nextBallFromPool && this.soccerBalls.indexOf( nextBallFromPool ) < this.maxKicksProperty.value ) {
        nextBallFromPool.soccerBallPhaseProperty.value = SoccerBallPhase.READY;
      }
    }
  }

  public getActiveSoccerBalls(): T[] {
    return this.soccerBalls.filter( soccerBall => soccerBall.soccerBallPhaseProperty.value !== SoccerBallPhase.INACTIVE );
  }

  /**
   * When a ball lands on the ground, animate the ball to the top of the stack.
   */
  private animateSoccerBallToTopOfStack( soccerBall: SoccerBall, value: number ): void {
    const otherObjectsInStack = this.getActiveSoccerBalls().filter( x =>
      x.valueProperty.value === value && x !== soccerBall
    );

    const targetIndex = otherObjectsInStack.length;

    const diameter = SoccerCommonConstants.SOCCER_BALL_RADIUS * 2;
    const targetPositionY = targetIndex * diameter * ( 1 - SoccerCommonConstants.SOCCER_BALL_OVERLAP ) + SoccerCommonConstants.SOCCER_BALL_RADIUS;

    const animationSlowdownFactor = SoccerCommonQueryParameters.slowAnimation ? 20 : 1;
    const animationTime = animationSlowdownFactor * 0.06 * ( this.getStackAtLocation( value ).length - 1 );

    soccerBall.clearAnimation();

    if ( otherObjectsInStack.length === 0 ) {
      soccerBall.soccerBallPhaseProperty.value = SoccerBallPhase.STACKED;
      this.stackChangedEmitter.emit( [ soccerBall ] );
      this.objectChangedEmitter.emit();
    }
    else {
      soccerBall.soccerBallPhaseProperty.value = SoccerBallPhase.STACKING;
      soccerBall.animation = new Animation( {
        duration: animationTime,
        targets: [ {
          property: soccerBall.positionProperty,
          to: new Vector2( Utils.roundSymmetric( soccerBall.positionProperty.value.x ), targetPositionY ),
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      soccerBall.animation.endedEmitter.addListener( () => {
        soccerBall.animation = null;
        soccerBall.soccerBallPhaseProperty.value = SoccerBallPhase.STACKED;

        this.objectChangedEmitter.emit();

        // During the state wrapper, sometimes the soccerBall.valueProperty.value was null, so it wasn't really supposed to be in the stack any longer
        if ( soccerBall.valueProperty.value === value ) {

          // Identify the soccer balls in the stack at the time the animation ended
          this.stackChangedEmitter.emit( this.getActiveSoccerBalls().filter( x =>
            x.valueProperty.value === value && x.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED ) );
        }
      } );
      soccerBall.animation.start();
    }
  }

  /**
   * Adds the provided number of balls to the scheduled balls to kick
   */
  public scheduleKicks( numberOfBallsToKick: number ): void {
    this.numberOfScheduledSoccerBallsToKickProperty.value += Math.min( numberOfBallsToKick, this.numberOfUnkickedBallsProperty.value );
  }

  /**
   * Select a target location for the nextBallToKick, set its velocity and mark it for animation.
   */
  private kickBall( soccerPlayer: SoccerPlayer, soccerBall: T ): void {
    soccerPlayer.poseProperty.value = Pose.KICKING;

    const x1 = SoccerCommonQueryParameters.sameSpot ? 7 :
               this.kickDistanceStrategy.getNextKickDistance( this.soccerBalls.indexOf( soccerBall ) );

    // Range equation is R=v0^2 sin(2 theta0) / g, see https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion
    // Equation 4.26
    const degreesToRadians = ( degrees: number ) => degrees * Math.PI * 2 / 360;
    const angle = dotRandom.nextDoubleBetween( degreesToRadians( 25 ), degreesToRadians( 70 ) );
    const v0 = Math.sqrt( Math.abs( x1 * Math.abs( SoccerCommonConstants.GRAVITY ) / Math.sin( 2 * angle ) ) );

    soccerBall.velocityProperty.value = Vector2.createPolar( v0, angle );

    soccerBall.targetXProperty.value = x1;

    soccerBall.soccerBallPhaseProperty.value = SoccerBallPhase.FLYING;
    this.timeWhenLastBallWasKickedProperty.value = this.timeProperty.value;

    soccerBall.soccerPlayer = soccerPlayer;

    kickSound.play();
  }

  /**
   * Gets the state object for this scene model. Includes the strategy for how kick distances are generated.
   */
  public toStateObject(): CAVSceneModelState {
    return {
      distributionType: this.kickDistanceStrategy.toStateObject()
    };
  }

  public applyState( stateObject: CAVSceneModelState ): void {
    this.kickDistanceStrategy = this.kickDistanceStrategyFromStateObject( stateObject.distributionType );
  }
}

type CAVSceneModelState = { distributionType: string };

// TODO: This adds a new IOType stub into PhetioElementView. Is that how we want to continue doing this? See https://github.com/phetsims/center-and-variability/issues/117 But maybe the long term solution for that problem is https://github.com/phetsims/studio/issues/292
// TODO: Review overlap between getValue/getValue and setState/getState.  Make sure both work correctly and in concert. See https://github.com/phetsims/center-and-variability/issues/117
const CAVSceneModelIO = new IOType( 'CAVSceneModelIO', {
  valueType: SoccerSceneModel,
  stateSchema: {
    distributionType: StringIO
  },
  toStateObject: ( cavSceneModel: SoccerSceneModel ) => {
    return cavSceneModel.toStateObject();
  },
  applyState: ( cavSceneModel: SoccerSceneModel, stateObject: CAVSceneModelState ) => {
    cavSceneModel.applyState( stateObject );
  },
  methods: {
    getValue: {
      returnType: ObjectLiteralIO,
      parameterTypes: [],
      implementation: function( this: SoccerSceneModel ) {
        return this.toStateObject();
      },
      documentation: 'Gets the current value of the CAVSceneModel'
    },
    getValidationError: {
      returnType: NullableIO( StringIO ),
      parameterTypes: [ ObjectLiteralIO ],
      implementation: function( this: SoccerSceneModel, value: CAVSceneModelState ) {

        // TODO: check validation, see https://github.com/phetsims/center-and-variability/issues/117
        return null;
      },
      documentation: 'Checks to see if a proposed value is valid. Returns the first validation error, or null if the value is valid.'
    },

    setValue: {
      returnType: VoidIO,
      parameterTypes: [ ObjectLiteralIO ],
      documentation: 'Sets the value for the scene model, including the kick distance strategy.',
      implementation: function( this: SoccerSceneModel, state: CAVSceneModelState ) {
        this.applyState( state );
      }
    }
  }
} );

soccerCommon.register( 'SoccerSceneModel', SoccerSceneModel );