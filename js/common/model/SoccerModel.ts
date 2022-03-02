// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the screens that use soccer.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel, { CASModelOptions } from '../../common/model/CASModel.js';
import CASObjectType from '../../common/model/CASObjectType.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CASConstants from '../CASConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import SoccerPlayer from './SoccerPlayer.js';
import CASObject from './CASObject.js';
import Property from '../../../../axon/js/Property.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Pose from './Pose.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SoccerModelSelfOptions = {};
type SoccerModelOptions = SoccerModelSelfOptions & CASModelOptions;

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.05; // in seconds

class SoccerModel extends CASModel {
  readonly soccerPlayerGroup: PhetioGroup<SoccerPlayer, [ number ]>;
  readonly nextBallToKickProperty: Property<CASObject | null>; // Null if there is no more ball to kick
  private readonly numberOfScheduledSoccerBallsToKickProperty: NumberProperty;
  readonly numberOfRemainingKickableSoccerBallsProperty: IReadOnlyProperty<number>;
  readonly hasKickableSoccerBallsProperty: IReadOnlyProperty<boolean>;

  private readonly timeWhenLastBallWasKickedProperty: NumberProperty;
  private readonly ballPlayerMap: Map<CASObject, SoccerPlayer>; // TODO: Add to PhET-iO State

  constructor( maxNumberOfBalls: number, options: SoccerModelOptions ) {

    options = optionize<SoccerModelOptions, SoccerModelSelfOptions, CASModelOptions>( {
      tandem: Tandem.REQUIRED
    }, options );

    super( CASObjectType.SOCCER_BALL, maxNumberOfBalls, options );

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
    this.nextBallToKickProperty = new Property<CASObject | null>( this.createBall() );

    this.ballPlayerMap = new Map();

    this.numberOfRemainingKickableSoccerBallsProperty = new DerivedProperty<number, [ number, number, CASObject | null ]>( [
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
  }

  /**
   * Creates a ball at the starting kick position.
   */
  private createBall(): CASObject {

    const y0 = this.objectType.radius;
    const position = new Vector2( 0, y0 );

    const casObject = this.createObject( {
      position: position,

      // TODO: should be a default if it isnt already
      velocity: Vector2.ZERO
    } );

    casObject.valueProperty.link( ( value, oldValue ) => {
      if ( value !== null && oldValue === null ) {
        this.soccerBallLandedListener( casObject, value );
      }
    } );

    return casObject;
  }

  /**
   * When a ball lands on the ground, animate all other balls that were at this location above the landed ball.
   */
  soccerBallLandedListener( casObject: CASObject, value: number ) {
    const otherObjectsInStack = this.objectGroup.filter( x => x.valueProperty.value === value && x !== casObject );
    const sortedOthers = _.sortBy( otherObjectsInStack, object => object.positionProperty.value.y );

    sortedOthers.forEach( ( casObject, index ) => {

      const diameter = casObject.objectType.radius * 2;
      const targetPositionY = ( index + 1 ) * diameter + casObject.objectType.radius;
      const positionYProperty = new NumberProperty( casObject.positionProperty.value.y );

      // TODO: Use casObject.positionProperty in the Animation
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
  private kickBall( soccerPlayer: SoccerPlayer, casObject: CASObject ) {
    soccerPlayer.poseProperty.value = Pose.KICKING;

    this.ballPlayerMap.set( casObject, soccerPlayer );

    // TODO: Cleanup and choose distribution, see https://github.com/phetsims/center-and-spread/issues/11
    // const weights = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
    // const weights = [ 100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    const weights = [
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1
    ];

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

    assert && assert( weights.length === this.range.getLength() + 1, 'weight array should match the model range' );
    const x1 = dotRandom.sampleProbabilities( weights ) + 1;

    // Range equation is R=v0^2 sin(2 theta0) / g, see https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion
    // Equation 4.26
    const degreesToRadians = ( degrees: number ) => degrees * Math.PI * 2 / 360;
    const angle = dotRandom.nextDoubleBetween( degreesToRadians( 25 ), degreesToRadians( 70 ) );
    const v0 = Math.sqrt( Math.abs( x1 * Math.abs( CASConstants.GRAVITY ) / Math.sin( 2 * angle ) ) );

    const velocity = Vector2.createPolar( v0, angle );
    casObject.velocityProperty.value = velocity;

    casObject.targetX = x1;

    casObject.animationModeProperty.value = 'flying';
    this.timeWhenLastBallWasKickedProperty.value = this.timeProperty.value;

    // New ball will be created later in step
    this.nextBallToKickProperty.value = null;
  }

  step( dt: number ): void {
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

        // TODO: Why is this called here? https://github.com/phetsims/center-and-spread/issues/59
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

          const casObject = this.nextBallToKickProperty.value!; // TODO: Probably? See https://github.com/phetsims/center-and-spread/issues/59
          this.kickBall( frontPlayer, casObject );
          this.numberOfScheduledSoccerBallsToKickProperty.value--;
        }
      }
    }
  }

  protected objectValueBecameNonNull( casObject: CASObject ): void {
    super.objectValueBecameNonNull( casObject );

    // If the soccer player that kicked that ball was still in line when the ball lands, they can leave the line now.
    if ( this.soccerPlayerGroup.includes( this.ballPlayerMap.get( casObject )! ) ) {
      this.advanceLine();
    }

    if ( this.numberOfRemainingObjectsProperty.value > 0 && this.nextBallToKickProperty.value === null ) {
      this.nextBallToKickProperty.value = this.createBall();
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

  clearData(): void {
    this.numberOfScheduledSoccerBallsToKickProperty.reset();
    this.timeProperty.reset();
    this.timeWhenLastBallWasKickedProperty.reset();
    this.ballPlayerMap.clear();
    this.soccerPlayerGroup.clear();
    super.clearData(); // TODO: SR: super.clearData() is called multiple times from reset.

    this.populateSoccerPlayerGroup();
    this.nextBallToKickProperty.value = this.createBall();
  }

  reset(): void {
    super.reset();
    this.clearData();
  }

  private populateSoccerPlayerGroup(): void {
    _.times( this.maxNumberOfObjects, index => this.soccerPlayerGroup.createNextElement( index ) );
  }
}

centerAndSpread.register( 'SoccerModel', SoccerModel );
export default SoccerModel;