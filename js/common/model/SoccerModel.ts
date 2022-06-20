// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the screens that use soccer.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import CAVObjectType from '../../common/model/CAVObjectType.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVConstants from '../CAVConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import SoccerPlayer from './SoccerPlayer.js';
import CAVObject from './CAVObject.js';
import Property from '../../../../axon/js/Property.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Pose from './Pose.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { AnimationMode } from './AnimationMode.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = EmptyObjectType;
type SoccerModelOptions = SelfOptions & CAVModelOptions;

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.5; // in seconds

class SoccerModel extends CAVModel {
  readonly soccerPlayerGroup: PhetioGroup<SoccerPlayer, [ number ]>;
  readonly nextBallToKickProperty: Property<CAVObject | null>; // Null if there is no more ball to kick
  private readonly numberOfScheduledSoccerBallsToKickProperty: NumberProperty;
  readonly numberOfRemainingKickableSoccerBallsProperty: IReadOnlyProperty<number>;
  readonly hasKickableSoccerBallsProperty: IReadOnlyProperty<boolean>;

  private readonly timeWhenLastBallWasKickedProperty: NumberProperty;
  private readonly ballPlayerMap: Map<CAVObject, SoccerPlayer>; // TODO: Add to PhET-iO State
  private readonly distributionProperty: Property<ReadonlyArray<number>>;

  constructor( maxNumberOfBalls: number, options: SoccerModelOptions ) {

    options = optionize<SoccerModelOptions, SelfOptions, CAVModelOptions>()( {
      tandem: Tandem.REQUIRED
    }, options );

    super( CAVObjectType.SOCCER_BALL, maxNumberOfBalls, options );

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
      phetioType: Property.PropertyIO( NullableIO( ReferenceIO( CAVObject.CAVObjectIO ) ) )
    } );

    this.ballPlayerMap = new Map();

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

    this.distributionProperty = new Property( SoccerModel.chooseDistribution(), {
      tandem: options.tandem.createTandem( 'distributionProperty' ),
      phetioType: Property.PropertyIO( ArrayIO( NumberIO ) ),
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

  static chooseDistribution(): ReadonlyArray<number> {
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
  soccerBallLandedListener( casObject: CAVObject, value: number ): void {
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
  scheduleKicks( numberOfBallsToKick: number ): void {
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

  override step( dt: number ): void {
    super.step( dt );

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
        const elapsedTime = this.timeProperty.value - frontPlayer.timestampWhenPoisedBegan;
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

  override clearData(): void {
    this.numberOfScheduledSoccerBallsToKickProperty.reset();
    this.timeProperty.reset();
    this.timeWhenLastBallWasKickedProperty.reset();
    this.ballPlayerMap.clear();
    this.soccerPlayerGroup.clear();

    // TODO: SR: super.clearData() is called multiple times from reset.
    // SR: This could be split up, but in my opinion it is clear and safe.  Maybe best to call it twice
    super.clearData();

    this.populateSoccerPlayerGroup();
    this.nextBallToKickProperty.value = this.createBall();
  }

  override reset(): void {
    super.reset();
    this.clearData();
    this.distributionProperty.value = SoccerModel.chooseDistribution();
  }

  private populateSoccerPlayerGroup(): void {
    _.times( this.maxNumberOfObjects, index => this.soccerPlayerGroup.createNextElement( index ) );
  }
}

centerAndVariability.register( 'SoccerModel', SoccerModel );
export default SoccerModel;