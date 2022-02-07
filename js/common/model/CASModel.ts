// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the model in every screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASObject from './CASObject.js';
import CASObjectType from './CASObjectType.js';
import merge from '../../../../phet-core/js/merge.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CASConstants from '../CASConstants.js';

type CASModelSelfOptions = {
  tandem: Tandem
};
export type CASModelOptions = CASModelSelfOptions & {};

// constants
const TIME_BETWEEN_RAPID_KICKS = 0.1; // in seconds

class CASModel {
  readonly objectGroup: PhetioGroup<CASObject>;
  readonly objectType: CASObjectType;
  private remainingNumberOfBallsToMultiKick: number;
  private timeWhenLastBallWasKicked: number;
  private time: number;

  // TODO: Move soccer related things to SoccerModel
  constructor( objectType: CASObjectType, providedOptions: CASModelOptions ) {

    const options = optionize<CASModelOptions, CASModelSelfOptions, {}>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    this.objectType = objectType;

    // TODO: support state with these! Likely as instrumented NumberProperties
    // TODO: handle reset case
    this.remainingNumberOfBallsToMultiKick = 0;
    this.time = 0;
    this.timeWhenLastBallWasKicked = 0;

    this.objectGroup = new PhetioGroup( ( tandem, objectType: CASObjectType, providedOptions ) => {

      // TODO: Optionize
      const options = merge( { tandem: tandem }, providedOptions );
      return new CASObject( objectType, options );
    }, [ objectType, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( CASObject.CASObjectIO ),
      tandem: options.tandem.createTandem( objectType === CASObjectType.SOCCER_BALL ? 'soccerBallGroup' : 'dataPointGroup' )
    } );
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

    // TODO: Follow a specified distribution
    const x1 = dotRandom.nextIntBetween( 1, 16 );
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

    const casObject = this.objectGroup.createNextElement( this.objectType, {
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

        // find other balls in the stack
        const ballsInStack = this.getOtherBallsAtTarget( casObject );

        if ( ballsInStack.length > 0 ) {
          const topBall = _.maxBy( ballsInStack, ball => ball.positionProperty.value.y )!;
          const targetY = topBall.positionProperty.value.y + topBall.objectType.radius + casObject.objectType.radius;
          casObject.positionProperty.value = new Vector2( casObject.targetX, targetY );
        }
      }
    };
    casObject.isAnimatingProperty.lazyLink( isAnimatingListener );

    const dragPositionListener = ( dragPosition: Vector2 ) => {

      // find other balls in the stack
      const ballsInStack = this.getOtherBallsAtTarget( casObject );

      if ( ballsInStack.length > 0 ) {
        const topBall = _.maxBy( ballsInStack, ball => ball.positionProperty.value.y )!;
        const targetY = topBall.positionProperty.value.y + topBall.objectType.radius + casObject.objectType.radius;
        casObject.positionProperty.value = new Vector2( casObject.targetX, targetY );
      }
      else {
        casObject.positionProperty.value = new Vector2( casObject.targetX, casObject.objectType.radius );
      }
    };
    casObject.dragPositionProperty.lazyLink( dragPositionListener ); // TODO: Dispose

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

  /**
   * Returns all other objects at the target position of the provided object.
   */
  getOtherBallsAtTarget( casObject: CASObject ): CASObject[] {
    return this.objectGroup.filter( ( o: CASObject ) => {
      return !o.isAnimatingProperty.value && o.targetX === casObject.targetX && casObject !== o;
    } );
  }

  /**
   * Resets the model.
   */
  reset(): void {
    this.objectGroup.clear();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void { // TODO: Specify return values everywhere
    this.time += dt;

    if ( this.remainingNumberOfBallsToMultiKick > 0 && this.time >= this.timeWhenLastBallWasKicked + TIME_BETWEEN_RAPID_KICKS ) {
      this.createBall();
    }

    this.objectGroup.forEach( casObject => casObject.step( dt ) );
  }
}

centerAndSpread.register( 'CASModel', CASModel );
export default CASModel;