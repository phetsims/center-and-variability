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
import { SoccerBallPhase } from './SoccerBallPhase.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { TKickDistanceStrategy } from './TKickDistanceStrategy.js';
import IOType from '../../../../tandem/js/types/IOType.js';
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
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import KickDistanceStrategy from './KickDistanceStrategy.js';
import { SoccerPlayerPhase } from './SoccerPlayerPhase.js';
import Multilink from '../../../../axon/js/Multilink.js';

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

  // Signify whenever any object's value changes
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

  // Starting at 0, iterate through the index of the kickers. This updates the SoccerPlayer.soccerPlayerPhaseProperty to show the current kicker
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

  private readonly kickDistanceStrategy: KickDistanceStrategy;

  public constructor(
    public readonly maxKicksProperty: TReadOnlyProperty<number>,
    maxKicksChoices: number[],
    initialKickDistanceStrategy: TKickDistanceStrategy,
    showPlayersWhenDoneKicking: boolean,
    public readonly physicalRange: Range,
    kickDistanceStrategyFromStateObject: ( string: string ) => TKickDistanceStrategy,
    createSoccerBall: ( isFirstSoccerBall: boolean, options: { tandem: Tandem } ) => T,
    providedOptions: SoccerSceneModelOptions
  ) {

    const options = optionize<SoccerSceneModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false,
      phetioType: SoccerSceneModelIO,
      phetioDocumentation: 'The model for the CAV scene, which includes the soccer balls and the soccer players.'
    }, providedOptions );

    super( options );

    this.kickDistanceStrategy = new KickDistanceStrategy( initialKickDistanceStrategy, kickDistanceStrategyFromStateObject, {
      tandem: options.tandem.createTandem( 'kickDistanceStrategy' )
    } );

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

        // If activeKickerIndex is greater than the number of kickers, but we want to show the last kicker, show the last available player
        const showAsLastKicker = showPlayersWhenDoneKicking && ( activeKickerIndex === this.maxKicksLimit && index === activeKickerIndex - 1 );
        soccerPlayer.soccerPlayerPhaseProperty.value = ( ( index === activeKickerIndex && ( index < maxKicks || showPlayersWhenDoneKicking ) ) || showAsLastKicker ) ? SoccerPlayerPhase.READY : SoccerPlayerPhase.INACTIVE;
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

        if ( frontPlayer.soccerPlayerPhaseProperty.value === SoccerPlayerPhase.READY ) {
          frontPlayer.soccerPlayerPhaseProperty.value = SoccerPlayerPhase.POISED;
          frontPlayer.timestampWhenPoisedBeganProperty.value = this.timeProperty.value;
        }
      }

      // How long has the front player been poised?
      if ( frontPlayer.soccerPlayerPhaseProperty.value === SoccerPlayerPhase.POISED ) {
        assert && assert( typeof frontPlayer.timestampWhenPoisedBeganProperty.value === 'number', 'timestampWhenPoisedBegan should be a number' );
        const elapsedTime = this.timeProperty.value - frontPlayer.timestampWhenPoisedBeganProperty.value!;
        if ( elapsedTime > 0.075 ) {

          const soccerBall = this.soccerBalls.find( soccerBall =>
            soccerBall.valueProperty.value === null &&
            soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.READY
          );

          // In fuzzing, sometimes there are no soccer balls available
          if ( soccerBall ) {
            this.kickBall( frontPlayer, soccerBall, true );
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
    const kickers = this.soccerPlayers.filter( soccerPlayer => soccerPlayer.soccerPlayerPhaseProperty.value === SoccerPlayerPhase.KICKING );
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
  private kickBall( soccerPlayer: SoccerPlayer, soccerBall: T, playAudio: boolean ): void {
    soccerPlayer.soccerPlayerPhaseProperty.value = SoccerPlayerPhase.KICKING;

    const x1 = SoccerCommonQueryParameters.sameSpot ? 7 :
               this.kickDistanceStrategy.currentStrategy.getNextKickDistance( this.soccerBalls.indexOf( soccerBall ) );

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

    playAudio && kickSound.play();
  }

  /**
   * For PhET-iO, support setting a static set of data points.
   */
  public setDataPoints( dataPoints: number[] ): void {

    // Ignore any data points beyond the max supported by MAX_KICKS_PROPERTY. Note this means a PhET-iO client needs
    // to specify the MAX_KICKS_PROPERTY value before calling this method.
    if ( dataPoints.length > this.maxKicksProperty.value ) {
      dataPoints.length = this.maxKicksProperty.value;
    }

    // Clear pre-existing data
    this.clearData();

    // Iterate through data points and create the soccer balls
    for ( let i = 0; i < dataPoints.length; i++ ) {
      this.kickBall( this.soccerPlayers[ i ], this.soccerBalls[ i ], false );
      this.soccerBalls[ i ].valueProperty.value = dataPoints[ i ];
      this.soccerBalls[ i ].soccerBallPhaseProperty.value = SoccerBallPhase.STACKED;

      // Leave the sim in a usable state for the next kicks (even after the data has been set)
      this.advanceLine();
    }

    // Reorganize the stacks
    _.uniq( dataPoints ).forEach( value => this.reorganizeStack( this.getStackAtLocation( value ) ) );

    this.updateDataMeasures();

    // This emitter was suppressed during isClearingData, so we must synchronize listeners now
    this.objectChangedEmitter.emit();
  }
}

const SoccerSceneModelIO = new IOType( 'SoccerSceneModelIO', {
  valueType: SoccerSceneModel,
  methods: {
    setDataPoints: {
      returnType: VoidIO,
      parameterTypes: [ ArrayIO( NumberIO ) ],
      implementation: function( this: SoccerSceneModel, dataPoints: number[] ) {
        this.setDataPoints( dataPoints );
      },
      documentation: 'Sets the data points for the scene model. Array lengths that exceed maxKicks will ignore excess values.'
    },

    getDataPoints: {
      returnType: ArrayIO( NumberIO ),
      parameterTypes: [],
      implementation: function( this: SoccerSceneModel ) {
        return this.getSortedStackedObjects().map( soccerBall => soccerBall.valueProperty.value );
      },
      documentation: 'Gets the data points for the scene model.'
    }
  }
} );

soccerCommon.register( 'SoccerSceneModel', SoccerSceneModel );