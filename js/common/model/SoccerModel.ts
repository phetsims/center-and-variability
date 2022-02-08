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

    // we know x0 and final x.  We know a = -g.  Solve for v and t.
    // solve for v and t
    // x1 = x0 + vx*t             // Unknown: t, vx
    // y1 = y0 + vy*t + 1/2 a t^2 // Unknown: t, vy

    // Add a constraint, like vx^2 + vy^2=v^2

    // Different kickers should have different initial velocity.
    const y0 = this.objectType.radius;
    // const x0 = 0;

    // TODO: Follow a specified distribution
    const x1 = dotRandom.nextIntBetween( this.rangeProperty.value.min, this.rangeProperty.value.max );
    // const y1 = this.objectType.radius;// land on the ground

    // Range equation is R=v0^2 sin(2 theta0) / g, see https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion
    // Equation 4.26

    // TODO: non-uniform distribution over angles, or distribution over initial velocity, and backcompute the angle?
    const angle = dotRandom.nextDoubleBetween( Math.PI / 4, Math.PI / 2 * 5 / 6 );
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

    const isAnimatingListener = ( isAnimating: boolean ) => {
      if ( !isAnimating ) {
        assert && assert( casObject.positionProperty.value.x === casObject.targetX,
          `object that finished animating is not at its targetX, positionX: ${casObject.positionProperty.value.x},
            targetX: ${casObject.targetX}` );

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
    this.remainingNumberOfBallsToMultiKick += numberOfBallsToKick; // TODO: consider how many balls are available based on max
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