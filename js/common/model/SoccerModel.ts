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

type SoccerModelSelfOptions = {};
type SoccerModelOptions = SoccerModelSelfOptions & CASModelOptions;

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.1; // in seconds

class SoccerModel extends CASModel {
  private remainingNumberOfBallsToMultiKick: number;
  private timeWhenLastBallWasKicked: number;
  private time: number;

  constructor( options: SoccerModelOptions ) {

    options = optionize<SoccerModelOptions, SoccerModelSelfOptions, CASModelOptions>( {
      tandem: Tandem.REQUIRED
    }, options );

    super( CASObjectType.SOCCER_BALL, options );

    // TODO: support state with these! Likely as instrumented NumberProperties
    // TODO: handle reset case
    this.remainingNumberOfBallsToMultiKick = 0;
    this.time = 0;
    this.timeWhenLastBallWasKicked = 0;
  }

  /**
   * Creates a ball at the starting kick position and kicks off an animation to its target location.
   */
  private createBall(): void {

    const y0 = this.objectType.radius;
    const x1 = dotRandom.nextIntBetween( this.rangeProperty.value.min, this.rangeProperty.value.max );

    // Range equation is R=v0^2 sin(2 theta0) / g, see https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion
    // Equation 4.26
    const degreesToRadians = ( degrees: number ) => degrees * Math.PI * 2 / 360;
    const angle = dotRandom.nextDoubleBetween( degreesToRadians( 25 ), degreesToRadians( 70 ) );
    const v0 = Math.sqrt( Math.abs( x1 * Math.abs( CASConstants.GRAVITY ) / Math.sin( 2 * angle ) ) );

    const velocity = Vector2.createPolar( v0, angle );
    const position = new Vector2( 0, y0 );

    const casObject = this.createObject( {
      position: position,
      velocity: velocity,
      targetX: x1
    } );
    casObject.isAnimatingProperty.value = true;
    this.timeWhenLastBallWasKicked = this.time;
    this.remainingNumberOfBallsToMultiKick--;

    // TODO: Listen for when the valueProperty becomes non-null
    const isAnimatingListener = ( isAnimating: boolean ) => {
      if ( !isAnimating ) {
        this.moveToTop( casObject );
      }
    };
    casObject.isAnimatingProperty.lazyLink( isAnimatingListener );

    // this is an n^2 operation, but that is okay because n small.
    this.objectGroup.elementDisposedEmitter.addListener( o => {
      if ( o === casObject ) {
        o.isAnimatingProperty.unlink( isAnimatingListener );
      }
    } );
  }

  /**
   * Adds the provided number of balls to the scheduled balls to kick
   */
  kick( numberOfBallsToKick: number ): void {
    this.remainingNumberOfBallsToMultiKick += numberOfBallsToKick;
    this.createBall();
  }

  step( dt: number ): void {
    super.step( dt );

    this.time += dt;

    if ( this.remainingNumberOfBallsToMultiKick > 0 && this.time >= this.timeWhenLastBallWasKicked + TIME_BETWEEN_RAPID_KICKS ) {
      this.createBall();
    }
  }
}

centerAndSpread.register( 'SoccerModel', SoccerModel );
export default SoccerModel;