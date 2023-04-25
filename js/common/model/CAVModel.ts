// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for the model in every screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVObject, { CAVObjectOptions } from './CAVObject.js';
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
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
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
  dataPointFill: string;
};
export type CAVModelOptions = SelfOptions;

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.5; // in seconds

export default class CAVModel implements TModel {
  public readonly objectGroup: PhetioGroup<CAVObject, [ CAVObjectType, StrictOmit<CAVObjectOptions, 'tandem'> ]>;
  public readonly objectType = CAVObjectType.SOCCER_BALL;

  public readonly isShowingTopMeanProperty: BooleanProperty;
  public readonly isShowingTopMedianProperty: BooleanProperty;
  public readonly isShowingPlayAreaMedianProperty: BooleanProperty;
  public readonly isShowingPlayAreaMeanProperty: BooleanProperty;
  public readonly isShowingPlayAreaVariabilityProperty: BooleanProperty; // TODO: only used in screen 3
  public readonly isShowingMeanPredictionProperty: BooleanProperty;
  public readonly isShowingMedianPredictionProperty: BooleanProperty;

  // This is used like a view attribute, but passing it through views led to too much complexity
  // TODO: Do we want to move this to the view?
  // TODO: Or at the instantiation site, could do `model instanceof VariabilityModel? gray : black`
  public readonly dataPointFill: string;

  protected readonly maxNumberOfObjects = CAVConstants.NUMBER_OF_OBJECTS;
  public readonly physicalRange = new Range( 1, 15 );

  // This is the number that we can still add to the PhetioGroup
  protected readonly numberOfRemainingObjectsProperty: TReadOnlyProperty<number>;
  public readonly medianValueProperty: Property<number | null>;
  public readonly meanValueProperty: Property<number | null>;

  // Indicates the max and min values in the data set, or null if there are no values in the data set
  public readonly dataRangeProperty: Property<Range | null>;
  public readonly maxValueProperty: TReadOnlyProperty<number | null>;
  public readonly minValueProperty: TReadOnlyProperty<number | null>;
  public readonly rangeValueProperty: TReadOnlyProperty<number | null>;

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

  public readonly soccerPlayerGroup: PhetioGroup<SoccerPlayer, [ number ]>;
  private readonly nextBallToKickProperty: Property<CAVObject | null>; // Null if there is no more ball to kick
  private readonly numberOfScheduledSoccerBallsToKickProperty: NumberProperty;
  public readonly numberOfRemainingKickableSoccerBallsProperty: TReadOnlyProperty<number>;
  public readonly hasKickableSoccerBallsProperty: TReadOnlyProperty<boolean>;

  private readonly timeWhenLastBallWasKickedProperty: NumberProperty;
  private readonly ballPlayerMap: Map<CAVObject, SoccerPlayer> = new Map<CAVObject, SoccerPlayer>(); // TODO: Add to PhET-iO State, see https://github.com/phetsims/center-and-variability/issues/128
  protected readonly distributionProperty: Property<ReadonlyArray<number>>;

  public constructor( providedOptions: CAVModelOptions ) {

    const options = optionize<CAVModelOptions, SelfOptions>()( {}, providedOptions );

    this.dataPointFill = options.dataPointFill;

    this.objectGroup = new PhetioGroup( ( tandem, objectType: CAVObjectType, providedOptions: StrictOmit<CAVObjectOptions, 'tandem'> ) => {

      const options = optionize<StrictOmit<CAVObjectOptions, 'tandem'>, EmptySelfOptions, CAVObjectOptions>()( {
        // If it's the first element in the group, mark as isFirstObject. For creating archetype, the objectGroup does
        // not yet exist, so just mark it as first
        isFirstObject: this.objectGroup ? this.objectGroup.count === 0 : true,
        tandem: tandem
      }, providedOptions );

      const casObject = new CAVObject( objectType, options );

      // TODO: Should some or all of this move into CAVObject or CAVObjectNode?
      const dragPositionListener = ( dragPosition: Vector2 ) => {
        casObject.valueProperty.value = Utils.roundSymmetric( this.physicalRange.constrainValue( dragPosition.x ) );

        this.moveToTop( casObject );
      };
      casObject.dragPositionProperty.lazyLink( dragPositionListener );
      casObject.disposedEmitter.addListener( () => casObject.dragPositionProperty.unlink( dragPositionListener ) );

      return casObject;
    }, [ this.objectType, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( CAVObject.CAVObjectIO ),
      tandem: options.tandem.createTandem( this.objectType === CAVObjectType.SOCCER_BALL ? 'soccerBallGroup' : 'dataPointGroup' )
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
    this.isShowingPlayAreaVariabilityProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPlayAreaVariabilityProperty' )
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

    // TODO: phet-io instrumentation for all screens? probably
    this.maxValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.max;
    } );
    this.minValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.min;
    } );
    this.rangeValueProperty = new DerivedProperty( [ this.maxValueProperty, this.minValueProperty ], ( max, min ) => {
      if ( max === null || min === null ) {
        return null;
      }
      else {
        return max - min;
      }
    } );
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

    const updateDataMeasures = () => this.updateDataMeasures();
    this.isShowingPlayAreaMedianProperty.link( updateDataMeasures );

    // Trigger CardModel creation when a ball lands.
    const objectCreatedListener = ( casObject: CAVObject ) => {
      const listener = ( value: number | null ) => {
        if ( value !== null ) {
          if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
            this.objectCreated( casObject );
            this.objectValueBecameNonNullEmitter.emit( casObject );
          }
          casObject.valueProperty.unlink( listener ); // Only create the card once, then no need to listen further
        }
      };
      casObject.valueProperty.link( listener );
      casObject.valueProperty.link( updateDataMeasures );
      casObject.positionProperty.link( updateDataMeasures );

      // Signal to listeners that a value changed
      // TODO: Maybe should combine with temporary listener for one permanent one
      casObject.valueProperty.link( () => this.objectChangedEmitter.emit( casObject ) );
      casObject.positionProperty.link( () => this.objectChangedEmitter.emit( casObject ) );
    };
    this.objectGroup.forEach( objectCreatedListener );
    this.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    this.numberOfRemainingObjectsProperty = new DerivedProperty( [ this.objectGroup.countProperty ], count => {
      return this.maxNumberOfObjects - count;
    } );

    this.objectValueBecameNonNullEmitter = new Emitter<[ CAVObject ]>( {
      parameters: [ { valueType: CAVObject } ]
    } );


    this.numberOfScheduledSoccerBallsToKickProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'numberOfScheduledSoccerBallsToKickProperty' )
    } );
    this.timeWhenLastBallWasKickedProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeWhenLastBallWasKickedProperty' )
    } );

    this.soccerPlayerGroup = new PhetioGroup( ( tandem: Tandem, placeInLine: number ) => {
      return new SoccerPlayer( placeInLine, {
        tandem: tandem
      } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( SoccerPlayer.SoccerPlayerIO ),
      tandem: options.tandem.createTandem( 'soccerPlayerGroup' )
    } );

    this.populateSoccerPlayerGroup();

    // Create an initial ball to show on startup
    this.nextBallToKickProperty = new Property<CAVObject | null>( this.createBall(), {
      tandem: options.tandem.createTandem( 'nextBallToKickProperty' ),
      phetioValueType: NullableIO( ReferenceIO( CAVObject.CAVObjectIO ) )
    } );

    this.numberOfRemainingKickableSoccerBallsProperty = new DerivedProperty( [
      this.numberOfRemainingObjectsProperty,
      this.numberOfScheduledSoccerBallsToKickProperty,
      this.nextBallToKickProperty ], ( numberOfRemainingObjects,
                                       numberOfScheduledBallsToKick,
                                       nextBallToKick ) => {

      const numberOfCreatedButKickableBalls = nextBallToKick === null ? 0 : 1;
      return numberOfRemainingObjects - numberOfScheduledBallsToKick + numberOfCreatedButKickableBalls;
    } );

    this.hasKickableSoccerBallsProperty = new DerivedProperty( [ this.numberOfRemainingKickableSoccerBallsProperty ],
      numberOfRemainingKickableObjects => numberOfRemainingKickableObjects > 0 );

    this.distributionProperty = new Property( CAVModel.chooseDistribution(), {
      tandem: options.tandem.createTandem( 'distributionProperty' ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioDocumentation: 'The distribution of probabilities of where the balls will land is represented as an un-normalized array of non-negative, floating-point numbers, one value for each location in the physical range',
      isValidValue: ( array: readonly number[] ) => array.length === this.physicalRange.getLength() + 1 && // inclusive of endpoints
                                                    _.every( array, element => element >= 0 )
    } );

    this.objectValueBecameNonNullEmitter.addListener( casObject => {

      // If the soccer player that kicked that ball was still in line when the ball lands, they can leave the line now.
      if ( this.soccerPlayerGroup.includes( this.ballPlayerMap.get( casObject )! ) ) {
        this.advanceLine();
      }

      if ( this.numberOfRemainingObjectsProperty.value > 0 && this.nextBallToKickProperty.value === null ) {
        this.nextBallToKickProperty.value = this.createBall();
      }
    } );

    this.objectGroup.elementCreatedEmitter.addListener( casObject => {
      casObject.valueProperty.link( ( value, oldValue ) => {
        if ( value !== null && oldValue === null ) {
          if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
            this.soccerBallLandedListener( casObject, value );
          }
        }
      } );
    } );
  }

  protected objectCreated( cavObject: CAVObject ): void {

    // Override in subclasses
  }

  protected updateDataMeasures(): void {

    const sortedObjects = this.getSortedLandedObjects();
    const medianObjects: CAVObject[] = [];

    // Odd number of values, take the central value
    if ( sortedObjects.length % 2 === 1 ) {
      const midIndex = ( sortedObjects.length - 1 ) / 2;
      this.medianValueProperty.value = sortedObjects[ midIndex ].valueProperty.value!;
      medianObjects.push( sortedObjects[ midIndex ] );

      assert && assert( !isNaN( this.medianValueProperty.value ) );
    }
    else if ( sortedObjects.length % 2 === 0 && sortedObjects.length >= 2 ) {

      // Even number of values, average the two middle-most values
      const mid1Index = ( sortedObjects.length - 2 ) / 2;
      const mid2Index = ( sortedObjects.length - 0 ) / 2;
      const mid1Value = sortedObjects[ mid1Index ].valueProperty.value!;
      const mid2Value = sortedObjects[ mid2Index ].valueProperty.value!;
      this.medianValueProperty.value = ( mid1Value + mid2Value ) / 2;

      medianObjects.push( sortedObjects[ mid1Index ] );
      medianObjects.push( sortedObjects[ mid2Index ] );

      assert && assert( !isNaN( this.medianValueProperty.value ) );
    }
    else {

      // Not enough values for the median to be defined
      this.medianValueProperty.value = null;
    }

    this.objectGroup.forEach( object => {
      object.isMedianObjectProperty.value = medianObjects.includes( object );
    } );

    if ( sortedObjects.length > 0 ) {
      this.meanValueProperty.value = _.mean( sortedObjects.map( casObject => casObject.valueProperty.value ) );

      const min = sortedObjects[ 0 ].valueProperty.value!;
      const max = sortedObjects[ sortedObjects.length - 1 ].valueProperty.value!;
      this.dataRangeProperty.value = new Range( min, max );
    }
    else {
      this.meanValueProperty.value = null;
      this.dataRangeProperty.value = null;
    }

    this.numberOfDataPointsProperty.value = sortedObjects.length;
  }

  /**
   * Returns all other objects at the target position of the provided object.
   */
  public getOtherObjectsAtTarget( casObject: CAVObject ): CAVObject[] {
    return this.objectGroup.filter( ( o: CAVObject ) => {
      return o.valueProperty.value === casObject.valueProperty.value && casObject !== o;
    } );
  }

  /**
   * Set the position of the parameter object to be on top of the other objects at that target position.
   */
  protected moveToTop( casObject: CAVObject ): void {

    const objectsAtTarget = this.getOtherObjectsAtTarget( casObject );

    // Sort from bottom to top, so they can be re-stacked. The specified object will appear at the top.
    const sortedOthers = _.sortBy( objectsAtTarget, object => object.positionProperty.value.y );
    const sorted = [ ...sortedOthers, casObject ];

    // collapse the rest of the stack. NOTE: This assumes the radii are the same.
    let position = casObject.objectType.radius;
    sorted.forEach( object => {
      object.positionProperty.value = new Vector2( casObject.valueProperty.value!, position );
      position += object.objectType.radius * 2;
    } );
  }

  /**
   * Clears out the data and the cards
   */
  public clearData(): void {
    this.objectGroup.clear();

    this.numberOfScheduledSoccerBallsToKickProperty.reset();
    this.timeProperty.reset();
    this.timeWhenLastBallWasKickedProperty.reset();
    this.ballPlayerMap.clear();
    this.soccerPlayerGroup.clear();
    this.populateSoccerPlayerGroup();
    this.nextBallToKickProperty.value = this.createBall();
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
    this.timeProperty.reset();
    this.clearData();
    this.distributionProperty.value = CAVModel.chooseDistribution();
    this.resetEmitter.emit();
  }

  public getSortedLandedObjects(): CAVObject[] {
    return _.sortBy( this.objectGroup.filter( casObject => casObject.valueProperty.value !== null ),

      // The numerical value takes predence for sorting
      casObject => casObject.valueProperty.value,

      // Then consider the height within the stack
      casObject => casObject.positionProperty.value.y
    );
  }

  /**
   * Steps the model.
   *
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.timeProperty.value += dt;
    this.objectGroup.forEach( cavObject => cavObject.step( dt ) );


    const frontPlayerList = this.soccerPlayerGroup.filter( soccerPlayer => soccerPlayer.placeInLineProperty.value === 0 );

    if ( frontPlayerList.length > 0 ) {

      assert && assert( frontPlayerList.length === 1, 'incorrect number of front soccer players: ' + frontPlayerList.length );
      const frontPlayer = frontPlayerList[ 0 ];

      // TODO: number of balls that exist but haven't been kicked???  See KickButtonGroup.
      const numberBallsThatExistButHaventBeenKicked = this.nextBallToKickProperty.value === null ? 0 : 1;
      if ( this.numberOfScheduledSoccerBallsToKickProperty.value > 0 &&
           this.numberOfRemainingObjectsProperty.value + numberBallsThatExistButHaventBeenKicked > 0 &&
           this.timeProperty.value >= this.timeWhenLastBallWasKickedProperty.value + TIME_BETWEEN_RAPID_KICKS ) {

        if ( this.nextBallToKickProperty.value === null ) {

          // Create the next ball.

          // TODO-UX-HIGH: A ball is being created too soon, when using the multikick button
          this.nextBallToKickProperty.value = this.createBall();
        }

        // TODO: Why is this called here? https://github.com/phetsims/center-and-variability/issues/59
        this.advanceLine();

        assert && assert( this.nextBallToKickProperty.value !== null, 'there was no ball to kick' );

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

          const casObject = this.nextBallToKickProperty.value!; // TODO: Probably? See https://github.com/phetsims/center-and-variability/issues/59
          this.kickBall( frontPlayer, casObject );
          this.numberOfScheduledSoccerBallsToKickProperty.value--;
        }
      }
    }
  }

  // When a ball lands, or when the next player is supposed to kick (before the ball lands), move the line forward
  private advanceLine(): void {

    // if the previous ball was still in the air, we need to move the line forward so the next player can kick
    const kickingPlayers = this.soccerPlayerGroup.filter( soccerPlayer => soccerPlayer.poseProperty.value === Pose.KICKING );
    assert && assert( kickingPlayers.length === 0 || kickingPlayers.length === 1, 'Too many kickers' );
    if ( kickingPlayers.length === 1 ) {

      const soccerPlayersToDispose: SoccerPlayer[] = [];

      this.soccerPlayerGroup.forEach( soccerPlayer => {
        if ( soccerPlayer.placeInLineProperty.value === 0 ) {
          soccerPlayersToDispose.push( soccerPlayer );
        }
        else {
          soccerPlayer.placeInLineProperty.value--;
        }
      } );

      assert && assert( soccerPlayersToDispose.length === 1, 'should always dispose the front soccer player only' );
      soccerPlayersToDispose.forEach( soccerPlayer => this.soccerPlayerGroup.disposeElement( soccerPlayer ) );
    }
  }

  private static chooseDistribution(): ReadonlyArray<number> {
    return dotRandom.nextBoolean() ? CAVConstants.LEFT_SKEWED_DATA : CAVConstants.RIGHT_SKEWED_DATA;
  }

  /**
   * Creates a ball at the starting kick position.
   */
  private createBall(): CAVObject {

    const y0 = this.objectType.radius;
    const position = new Vector2( 0, y0 );

    return this.objectGroup.createNextElement( this.objectType, {
      position: position
    } );
  }

  /**
   * When a ball lands on the ground, animate all other balls that were at this location above the landed ball.
   */
  private soccerBallLandedListener( casObject: CAVObject, value: number ): void {
    const otherObjectsInStack = this.objectGroup.filter( x => x.valueProperty.value === value && x !== casObject );
    const sortedOthers = _.sortBy( otherObjectsInStack, object => object.positionProperty.value.y );

    sortedOthers.forEach( ( casObject, index ) => {

      const diameter = casObject.objectType.radius * 2;
      const targetPositionY = ( index + 1 ) * diameter + casObject.objectType.radius;
      const positionYProperty = new NumberProperty( casObject.positionProperty.value.y );

      // TODO: Use casObject.positionProperty in the Animation?
      positionYProperty.link( positionY => {
        casObject.positionProperty.value = new Vector2( casObject.positionProperty.value.x, positionY );
      } );

      if ( casObject.animation ) {
        casObject.animation.stop();
      }
      casObject.animation = new Animation( {
        duration: 0.15,
        targets: [ {
          property: positionYProperty,
          to: targetPositionY,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      casObject.animation.endedEmitter.addListener( () => {
        casObject.animation = null;
      } );
      casObject.animation.start();
    } );
  }

  /**
   * Adds the provided number of balls to the scheduled balls to kick
   */
  public scheduleKicks( numberOfBallsToKick: number ): void {
    this.numberOfScheduledSoccerBallsToKickProperty.value +=
      Math.min( numberOfBallsToKick, this.numberOfRemainingKickableSoccerBallsProperty.value );
  }

  /**
   * Select a target location for the nextBallToKick, set its velocity and mark it for animation.
   */
  private kickBall( soccerPlayer: SoccerPlayer, casObject: CAVObject ): void {
    soccerPlayer.poseProperty.value = Pose.KICKING;

    this.ballPlayerMap.set( casObject, soccerPlayer );

    // Test that the sampling engine is working properly
    // TODO: Move to unit tests in dot?
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
    casObject.velocityProperty.value = velocity;

    casObject.targetX = x1;

    casObject.animationModeProperty.value = AnimationMode.FLYING;
    this.timeWhenLastBallWasKickedProperty.value = this.timeProperty.value;

    // New ball will be created later in step
    this.nextBallToKickProperty.value = null;
  }

  private populateSoccerPlayerGroup(): void {
    _.times( this.maxNumberOfObjects, index => this.soccerPlayerGroup.createNextElement( index ) );
  }
}

centerAndVariability.register( 'CAVModel', CAVModel );