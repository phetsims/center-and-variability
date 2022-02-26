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

type SoccerModelSelfOptions = {};
type SoccerModelOptions = SoccerModelSelfOptions & CASModelOptions;

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.1; // in seconds

class SoccerModel extends CASModel {
  readonly soccerPlayerGroup: PhetioGroup<SoccerPlayer, [ number ]>;
  readonly nextBallToKickProperty: Property<CASObject | null>; // Null if there is no more ball to kick
  readonly remainingNumberOfBallsToMultiKickProperty: NumberProperty;

  private readonly timeWhenLastBallWasKickedProperty: NumberProperty;
  private readonly ballPlayerMap: Map<CASObject, SoccerPlayer>; // TODO: Add to PhET-iO State

  constructor( maxNumberOfBalls: number, options: SoccerModelOptions ) {

    options = optionize<SoccerModelOptions, SoccerModelSelfOptions, CASModelOptions>( {
      tandem: Tandem.REQUIRED
    }, options );

    super( CASObjectType.SOCCER_BALL, maxNumberOfBalls, options );

    this.remainingNumberOfBallsToMultiKickProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'remainingNumberOfBallsToMultiKickProperty' )
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

    const valueListener = ( value: number | null ) => {
      if ( value !== null ) {
        this.moveToTop( casObject );
      }
    };
    casObject.valueProperty.link( valueListener );

    // this is an n^2 operation, but that is okay because n small.
    this.objectGroup.elementDisposedEmitter.addListener( o => {
      if ( o === casObject ) {
        o.valueProperty.unlink( valueListener );
      }
    } );

    return casObject;
  }

  /**
   * Adds the provided number of balls to the scheduled balls to kick
   */
  kick( numberOfBallsToKick: number ): void {
    this.remainingNumberOfBallsToMultiKickProperty.value += numberOfBallsToKick;
    this.advanceLine();
    if ( this.nextBallToKickProperty.value === null ) {
      this.nextBallToKickProperty.value = this.createBall();
    }
    this.kickBall();
  }

  /**
   * Select a target location for the nextBallToKick, set its velocity and mark it for animation.
   */
  kickBall(): void {

    assert && assert( this.nextBallToKickProperty.value !== null, 'there was no ball to kick' );

    const casObject = this.nextBallToKickProperty.value!;

    const frontPlayer = this.soccerPlayerGroup.filter( soccerPlayer => soccerPlayer.placeInLineProperty.value === 0 );
    assert && assert( frontPlayer.length === 1, 'incorrect number of front soccer players: ' + frontPlayer.length );
    const soccerPlayer = frontPlayer[ 0 ];
    soccerPlayer.isKickingProperty.value = true;

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

    casObject.isAnimatingProperty.value = true;
    this.timeWhenLastBallWasKickedProperty.value = this.timeProperty.value;
    this.remainingNumberOfBallsToMultiKickProperty.value--;

    // New ball will be created later in step
    this.nextBallToKickProperty.value = null;
  }

  step( dt: number ): void {
    super.step( dt );

    // Scheduled kicks from the "Kick 5" button
    if ( this.remainingNumberOfBallsToMultiKickProperty.value > 0 && this.numberOfRemainingObjectsProperty.value > 0 &&
         this.timeProperty.value >= this.timeWhenLastBallWasKickedProperty.value + TIME_BETWEEN_RAPID_KICKS ) {

      if ( this.nextBallToKickProperty.value === null ) {

        // Create the next ball.
        this.nextBallToKickProperty.value = this.createBall();
      }

      this.advanceLine();
      this.kickBall();
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

  private advanceLine(): void {

    // if the previous ball was still in the air, we need to move the line forward so the next player can kick
    const kickingPlayers = this.soccerPlayerGroup.filter( soccerPlayer => soccerPlayer.isKickingProperty.value );
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
    this.remainingNumberOfBallsToMultiKickProperty.reset();
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