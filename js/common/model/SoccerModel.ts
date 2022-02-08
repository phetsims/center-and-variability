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
import Range from '../../../../dot/js/Range.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CASConstants from '../CASConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';

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
    // x1 = x0 + v_x*t
    // y1 = y0 + v_y*t + 1/2 a t^2

    // Different kickers should have different initial velocity.
    const y0 = this.objectType.radius;
    const x0 = 0;

    const xRange = new Range( 1, 16 );

    // TODO: Follow a specified distribution
    const x1 = dotRandom.nextIntBetween( xRange.min, xRange.max );
    // const x1 = dotRandom.nextIntBetween( 5, 8 ); // TODO: for testing
    // const x1 = 8; TODO: for testing
    const y1 = this.objectType.radius;// land on the ground TODO: account for ball radius
    const t = dotRandom.nextDoubleBetween( 1, 3 ); // TODO: this should be computed not assigned
    // const t = 0.2; // TODO: for testing
    const vx = ( x1 - x0 ) / t;
    const vy = ( y1 - y0 - 1 / 2 * CASConstants.GRAVITY * t * t ) / t;

    // const distance = 8;
    const position = new Vector2( 0, y0 );
    const velocity = new Vector2( vx, vy );

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

    // TODO: when the positionProperty changes from animation, sync the dragPositionProperty to it
    const dragPositionListener = ( dragPosition: Vector2 ) => {
      casObject.targetX = Utils.roundSymmetric( xRange.constrainValue( dragPosition.x ) );

      this.moveToTop( casObject );
    };
    casObject.dragPositionProperty.lazyLink( dragPositionListener );

    // this is an n^2 operation, but that is okay because n small.
    this.objectGroup.elementDisposedEmitter.addListener( o => {
      if ( o === casObject ) {
        o.isAnimatingProperty.unlink( isAnimatingListener );
        o.dragPositionProperty.unlink( dragPositionListener );
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

  step( dt: number ) {
    super.step( dt );

    this.time += dt;

    if ( this.remainingNumberOfBallsToMultiKick > 0 && this.time >= this.timeWhenLastBallWasKicked + TIME_BETWEEN_RAPID_KICKS ) {
      this.createBall();
    }
  }
}

centerAndSpread.register( 'SoccerModel', SoccerModel );
export default SoccerModel;