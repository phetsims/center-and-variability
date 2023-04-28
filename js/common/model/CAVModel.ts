// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for the model in every screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVObject from './CAVObject.js';
import CAVObjectType from './CAVObjectType.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TModel from '../../../../joist/js/TModel.js';
import SoccerPlayer from './SoccerPlayer.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVConstants from '../CAVConstants.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import Pose from './Pose.js';
import { AnimationMode } from './AnimationMode.js';

type SelfOptions = {
  tandem: Tandem;
  instrumentMeanPredictionProperty: boolean;
};
export type CAVModelOptions = SelfOptions;

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.5; // in seconds

export default class CAVModel implements TModel {
  public readonly soccerBallGroup: CAVObject[];
  public readonly soccerBallGroupCountProperty: NumberProperty;

  public readonly isShowingTopMeanProperty: BooleanProperty;
  public readonly isShowingTopMedianProperty: BooleanProperty;
  public readonly isShowingPlayAreaMedianProperty: BooleanProperty;
  public readonly isShowingPlayAreaMeanProperty: BooleanProperty;
  public readonly isShowingMeanPredictionProperty: BooleanProperty;
  public readonly isShowingMedianPredictionProperty: BooleanProperty;

  protected readonly maxNumberOfObjects = CAVConstants.NUMBER_OF_OBJECTS;
  public readonly physicalRange = new Range( 1, 15 );

  public readonly medianValueProperty: Property<number | null>;
  public readonly meanValueProperty: Property<number | null>;

  // Indicates the max and min values in the data set, or null if there are no values in the data set
  public readonly dataRangeProperty: Property<Range | null>;

  // Signify whenever any object's value or position changes
  public readonly objectChangedEmitter: TEmitter<[ CAVObject ]> = new Emitter<[ CAVObject ]>( {
    parameters: [ { valueType: CAVObject } ]
  } );

  // Null until the user has made a prediction.
  public readonly medianPredictionProperty: NumberProperty;
  public readonly meanPredictionProperty: NumberProperty;

  protected readonly timeProperty: NumberProperty;

  protected readonly objectValueBecameNonNullEmitter: TEmitter<[ CAVObject ]>;
  public readonly resetEmitter: TEmitter = new Emitter();
  public readonly numberOfDataPointsProperty: NumberProperty;

  public readonly soccerPlayers: SoccerPlayer[];

  private readonly numberOfScheduledSoccerBallsToKickProperty: NumberProperty;
  public readonly numberOfUnkickedBallsProperty: TReadOnlyProperty<number>;
  public readonly hasKickableSoccerBallsProperty: TReadOnlyProperty<boolean>;
  private readonly timeWhenLastBallWasKickedProperty: NumberProperty;
  protected readonly distributionProperty: Property<ReadonlyArray<number>>;

  // Starting at 0, iterate through the index of the kickers. This updates the SoccerPlayer.isActiveProperty to show the current kicker
  private readonly activeKickerIndexProperty: NumberProperty;

  public constructor( options: CAVModelOptions ) {

    const updateDataMeasures = () => this.updateDataMeasures();

    // TODO: Rename to soccerBalls
    this.soccerBallGroupCountProperty = new NumberProperty( 0, {
      range: new Range( 0, this.maxNumberOfObjects )
    } );

    this.soccerBallGroup = _.range( 0, this.maxNumberOfObjects ).map( index => {

      const y0 = CAVObjectType.SOCCER_BALL.radius;
      const position = new Vector2( 0, y0 );

      const soccerBall = new CAVObject( CAVObjectType.SOCCER_BALL, {
        isFirstObject: index === 0,
        tandem: options.tandem.createTandem( `soccerBall${index}` ),
        position: position
      } );

      // TODO: Should some or all of this move into CAVObject or CAVObjectNode?
      const dragPositionListener = ( dragPosition: Vector2 ) => {
        soccerBall.valueProperty.value = Utils.roundSymmetric( this.physicalRange.constrainValue( dragPosition.x ) );

        this.moveToTop( soccerBall );
      };
      soccerBall.dragPositionProperty.lazyLink( dragPositionListener );

      soccerBall.valueProperty.link( ( value, oldValue ) => {
        if ( value !== null && oldValue === null ) {
          if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
            this.soccerBallLandedListener( soccerBall, value );
          }
        }
      } );

      const listener = ( value: number | null ) => {
        if ( value !== null ) {
          if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
            this.objectCreated( soccerBall );
            this.objectValueBecameNonNullEmitter.emit( soccerBall );
          }
        }
      };
      soccerBall.valueProperty.link( listener );

      // Signal to listeners that a value changed
      // TODO: Maybe should combine with temporary listener for one permanent one
      soccerBall.valueProperty.link( () => this.objectChangedEmitter.emit( soccerBall ) );
      soccerBall.positionProperty.link( () => this.objectChangedEmitter.emit( soccerBall ) );

      return soccerBall;
    } );

    this.soccerBallGroup.forEach( soccerBall => {
      soccerBall.isActiveProperty.link( isActive => {
        this.soccerBallGroupCountProperty.value = this.getActiveSoccerBalls().length;
      } );
    } );

    this.isShowingTopMeanProperty = new BooleanProperty( false, {
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'isShowingTopMeanProperty' ) : Tandem.OPT_OUT
    } );
    this.isShowingTopMedianProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingTopMedianProperty' )
    } );
    this.isShowingPlayAreaMeanProperty = new BooleanProperty( false, {
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'isShowingPlayAreaMeanProperty' ) : Tandem.OPT_OUT
    } );
    this.isShowingPlayAreaMedianProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPlayAreaMedianProperty' )
    } );
    this.isShowingMeanPredictionProperty = new BooleanProperty( false, {
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'isShowingMeanPredictionProperty' ) : Tandem.OPT_OUT
    } );
    this.isShowingMedianPredictionProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMedianPredictionProperty' )
    } );

    this.medianValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'medianValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );
    this.meanValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'meanValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );
    this.dataRangeProperty = new Property<Range | null>( null );

    this.numberOfDataPointsProperty = new NumberProperty( 0 );

    this.medianPredictionProperty = new NumberProperty( 1, {
      range: this.physicalRange,
      tandem: options.tandem.createTandem( 'medianPredictionProperty' )
    } );
    this.meanPredictionProperty = new NumberProperty( 1.5, {
      range: this.physicalRange,
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'meanPredictionProperty' ) : Tandem.OPT_OUT
    } );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' )
    } );

    this.isShowingPlayAreaMedianProperty.link( updateDataMeasures );

    this.objectValueBecameNonNullEmitter = new Emitter<[ CAVObject ]>( {
      parameters: [ { valueType: CAVObject } ]
    } );

    this.numberOfScheduledSoccerBallsToKickProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'numberOfScheduledSoccerBallsToKickProperty' )
    } );
    this.timeWhenLastBallWasKickedProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeWhenLastBallWasKickedProperty' )
    } );

    this.soccerPlayers = _.range( 0, this.maxNumberOfObjects ).map( placeInLine => new SoccerPlayer( placeInLine ) );

    // Create an initial ball to show on startup
    this.getNextBallFromPool();

    this.numberOfUnkickedBallsProperty = DerivedProperty.deriveAny( [
      this.numberOfScheduledSoccerBallsToKickProperty,
      ...this.soccerBallGroup.map( soccerBall => soccerBall.valueProperty ),
      ...this.soccerBallGroup.map( soccerBall => soccerBall.animationModeProperty ) ], () => {

      const kickedSoccerBalls = this.getActiveSoccerBalls().filter(
        soccerBall => soccerBall.valueProperty.value !== null ||
                      soccerBall.animationModeProperty.value === AnimationMode.FLYING ||
                      soccerBall.animationModeProperty.value === AnimationMode.STACKING
      );
      const value = this.maxNumberOfObjects - kickedSoccerBalls.length - this.numberOfScheduledSoccerBallsToKickProperty.value;

      return value;
    } );

    this.hasKickableSoccerBallsProperty = new DerivedProperty( [ this.numberOfUnkickedBallsProperty ],
      numberOfUnkickedBalls => numberOfUnkickedBalls > 0 );

    this.distributionProperty = new Property( CAVModel.chooseDistribution(), {
      tandem: options.tandem.createTandem( 'distributionProperty' ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioDocumentation: 'The distribution of probabilities of where the balls will land is represented as an un-normalized array of non-negative, floating-point numbers, one value for each location in the physical range',
      isValidValue: ( array: readonly number[] ) => array.length === this.physicalRange.getLength() + 1 && // inclusive of endpoints
                                                    _.every( array, element => element >= 0 )
    } );

    // TODO: Why have this callback and soccerBallLanded callback?
    this.objectValueBecameNonNullEmitter.addListener( soccerBall => {

      // If the soccer player that kicked that ball was still in line when the ball lands, they can leave the line now.
      if ( soccerBall.soccerPlayer === this.getFrontSoccerPlayer() ) {
        this.advanceLine();
      }
    } );

    this.activeKickerIndexProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'activeKickerIndexProperty' )
    } );

    this.activeKickerIndexProperty.link( activeKickerIndex => {
      this.soccerPlayers.forEach( ( soccerPlayer, index ) => {
        soccerPlayer.isActiveProperty.value = index === activeKickerIndex;
      } );
    } );

    this.soccerBallGroup.forEach( soccerBall => {
      soccerBall.valueProperty.link( updateDataMeasures );
      soccerBall.positionProperty.link( updateDataMeasures );
    } );
  }

  protected objectCreated( soccerBall: CAVObject ): void {

    // Override in subclasses
  }

  protected updateDataMeasures(): void {
    const sortedObjects = this.getSortedLandedObjects();
    const medianObjects = CAVModel.getMedianObjectsFromSortedArray( sortedObjects );

    this.soccerBallGroup.forEach( object => {
      object.isMedianObjectProperty.value = medianObjects.includes( object );
    } );

    if ( sortedObjects.length > 0 ) {

      // take the average to account for cases where there is more than one object contributing to the median
      this.medianValueProperty.value = _.mean( medianObjects.map( cavObject => cavObject.valueProperty.value ) );

      this.meanValueProperty.value = _.mean( sortedObjects.map( cavObject => cavObject.valueProperty.value ) );

      const min = sortedObjects[ 0 ].valueProperty.value!;
      const max = sortedObjects[ sortedObjects.length - 1 ].valueProperty.value!;
      this.dataRangeProperty.value = new Range( min, max );

      assert && assert( !isNaN( this.medianValueProperty.value ) );
    }
    else {
      this.medianValueProperty.value = null;
      this.meanValueProperty.value = null;
      this.dataRangeProperty.value = null;
    }

    this.numberOfDataPointsProperty.value = sortedObjects.length;
  }

  /**
   * Returns all other objects at the target position of the provided object.
   */
  public getOtherObjectsAtTarget( cavObject: CAVObject ): CAVObject[] {
    return this.soccerBallGroup.filter( ( o: CAVObject ) => {
      return o.valueProperty.value === cavObject.valueProperty.value && cavObject !== o;
    } );
  }

  /**
   * Set the position of the parameter object to be on top of the other objects at that target position.
   */
  protected moveToTop( cavObject: CAVObject ): void {

    const objectsAtTarget = this.getOtherObjectsAtTarget( cavObject );

    // Sort from bottom to top, so they can be re-stacked. The specified object will appear at the top.
    const sortedOthers = _.sortBy( objectsAtTarget, object => object.positionProperty.value.y );
    const sorted = [ ...sortedOthers, cavObject ];

    // collapse the rest of the stack. NOTE: This assumes the radii are the same.
    let position = cavObject.objectType.radius;
    sorted.forEach( object => {
      object.positionProperty.value = new Vector2( cavObject.valueProperty.value!, position );
      position += object.objectType.radius * 2;
    } );
  }

  /**
   * Clears out the data and the cards
   */
  public clearData(): void {
    this.numberOfScheduledSoccerBallsToKickProperty.reset();
    this.timeProperty.reset();
    this.timeWhenLastBallWasKickedProperty.reset();

    this.soccerPlayers.forEach( soccerPlayer => soccerPlayer.reset() );
    this.soccerBallGroup.forEach( soccerBall => soccerBall.reset() );
    this.getNextBallFromPool();

    this.activeKickerIndexProperty.reset();
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.medianPredictionProperty.reset();
    this.meanPredictionProperty.reset();
    this.isShowingTopMeanProperty.reset();
    this.isShowingTopMedianProperty.reset();
    this.isShowingPlayAreaMeanProperty.reset();
    this.isShowingPlayAreaMedianProperty.reset();
    this.isShowingMeanPredictionProperty.reset();
    this.isShowingMedianPredictionProperty.reset();
    this.distributionProperty.value = CAVModel.chooseDistribution();

    this.clearData();

    this.resetEmitter.emit();
  }

  public getSortedLandedObjects(): CAVObject[] {
    return _.sortBy( this.getActiveSoccerBalls().filter( cavObject => cavObject.valueProperty.value !== null ),

      // The numerical value takes predence for sorting
      cavObject => cavObject.valueProperty.value,

      // Then consider the height within the stack
      cavObject => cavObject.positionProperty.value.y
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
          frontPlayer.timestampWhenPoisedBegan = this.timeProperty.value;
        }
      }

      // How long has the front player been poised?
      if ( frontPlayer.poseProperty.value === Pose.POISED_TO_KICK ) {
        assert && assert( typeof frontPlayer.timestampWhenPoisedBegan === 'number', 'timestampWhenPoisedBegan should be a number' );
        const elapsedTime = this.timeProperty.value - frontPlayer.timestampWhenPoisedBegan!;
        if ( elapsedTime > 0.075 ) {

          const soccerBall = this.soccerBallGroup.find( soccerBall =>
            soccerBall.valueProperty.value === null &&
            soccerBall.isActiveProperty.value &&
            soccerBall.animationModeProperty.value === AnimationMode.NONE
          )!;
          // const soccerBall = this.nextBallToKickProperty.value!; // TODO: Probably? See https://github.com/phetsims/center-and-variability/issues/59
          this.kickBall( frontPlayer, soccerBall );
          this.numberOfScheduledSoccerBallsToKickProperty.value--;
        }
      }
    }
  }

  // Returns a list of the median objects within a sorted array, based on the objects' 'value' property
  protected static getMedianObjectsFromSortedArray( sortedObjects: CAVObject[] ): CAVObject[] {

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

  // TODO: Only advance the line if the CURRENT active player's ball has landed, or the timer after the kick has fired
  // TODO: We observed that if Player A's ball is still in flight after Player B kicks, then the landing of Player A's ball will trigger advanceLine for Player B

  // When a ball lands, or when the next player is supposed to kick (before the ball lands), move the line forward
  // and queue up the next ball as well
  private advanceLine(): void {

    // Allow kicking another ball while one is already in the air.
    // if the previous ball was still in the air, we need to move the line forward so the next player can kick
    const kickers = this.soccerPlayers.filter( soccerPlayer => soccerPlayer.isActiveProperty.value &&
                                                               soccerPlayer.poseProperty.value === Pose.KICKING );
    if ( kickers.length > 0 ) {
      let nextIndex = this.activeKickerIndexProperty.value + 1;
      if ( nextIndex > this.maxNumberOfObjects ) {
        nextIndex = 0;
      }
      this.activeKickerIndexProperty.value = nextIndex;
      this.getNextBallFromPool();
    }
  }

  private static chooseDistribution(): ReadonlyArray<number> {
    return dotRandom.nextBoolean() ? CAVConstants.LEFT_SKEWED_DATA : CAVConstants.RIGHT_SKEWED_DATA;
  }

  public getActiveSoccerBalls(): CAVObject[] {
    return this.soccerBallGroup.filter( soccerBall => soccerBall.isActiveProperty.value );
  }

  /**
   * When a ball lands on the ground, animate all other balls that were at this location above the landed ball.
   */
  private soccerBallLandedListener( soccerBall: CAVObject, value: number ): void {
    const otherObjectsInStack = this.getActiveSoccerBalls().filter( x => x.valueProperty.value === value && x !== soccerBall );
    const sortedOthers = _.sortBy( otherObjectsInStack, object => object.positionProperty.value.y );

    sortedOthers.forEach( ( cavObject, index ) => {

      const diameter = cavObject.objectType.radius * 2;
      const targetPositionY = ( index + 1 ) * diameter + cavObject.objectType.radius;
      const positionYProperty = new NumberProperty( cavObject.positionProperty.value.y );

      // TODO: Use cavObject.positionProperty in the Animation?
      positionYProperty.link( positionY => {
        cavObject.positionProperty.value = new Vector2( cavObject.positionProperty.value.x, positionY );
      } );

      if ( cavObject.animation ) {
        cavObject.animation.stop();
      }
      cavObject.animation = new Animation( {
        duration: 0.15,
        targets: [ {
          property: positionYProperty,
          to: targetPositionY,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      cavObject.animation.endedEmitter.addListener( () => {
        cavObject.animation = null;
      } );
      cavObject.animation.start();
    } );
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
  private kickBall( soccerPlayer: SoccerPlayer, soccerBall: CAVObject ): void {
    soccerPlayer.poseProperty.value = Pose.KICKING;

    // Test that the sampling engine is working properly
    // TODO: Where should these tests live? Should it be in the unit tests? Or in dot?
    // const array = new Array( weights.length );
    // _.fill( array, 0, 0, array.length );
    // for ( let i = 0; i < 1000000; i++ ) {
    //   const index = dotRandom.sampleProbabilities( weights );
    //   array[ index ]++;
    // }
    //

    // const inputNormalized = weights.map( element => ( element / _.sum( weights ) ) );
    // const resultNormalized = array.map( element => ( element / _.sum( array ) ) );
    // console.log( '....' );
    // console.log( inputNormalized );
    // console.log( resultNormalized );

    const weights = this.distributionProperty.value;

    assert && assert( weights.length === this.physicalRange.getLength() + 1, 'weight array should match the model range' );
    const x1 = dotRandom.sampleProbabilities( weights ) + 1;

    // Range equation is R=v0^2 sin(2 theta0) / g, see https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion
    // Equation 4.26
    const degreesToRadians = ( degrees: number ) => degrees * Math.PI * 2 / 360;
    const angle = dotRandom.nextDoubleBetween( degreesToRadians( 25 ), degreesToRadians( 70 ) );
    const v0 = Math.sqrt( Math.abs( x1 * Math.abs( CAVConstants.GRAVITY ) / Math.sin( 2 * angle ) ) );

    const velocity = Vector2.createPolar( v0, angle );
    soccerBall.velocityProperty.value = velocity;

    soccerBall.targetXProperty.value = x1;

    soccerBall.animationModeProperty.value = AnimationMode.FLYING;
    this.timeWhenLastBallWasKickedProperty.value = this.timeProperty.value;

    soccerBall.soccerPlayer = soccerPlayer;
  }

  private getNextBallFromPool(): CAVObject | null {
    const nextBallFromPool = this.soccerBallGroup.find( ball => !ball.isActiveProperty.value ) || null;
    if ( nextBallFromPool ) {
      nextBallFromPool.isActiveProperty.value = true;
    }
    return nextBallFromPool;
  }
}

centerAndVariability.register( 'CAVModel', CAVModel );