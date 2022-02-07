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

type CASModelSelfOptions = {
  tandem: Tandem
};
export type CASModelOptions = CASModelSelfOptions & {};

class CASModel {
  readonly objectGroup: PhetioGroup<CASObject>;
  readonly objectType: CASObjectType;

  constructor( objectType: CASObjectType, providedOptions: CASModelOptions ) {

    const options = optionize<CASModelOptions, CASModelSelfOptions, {}>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    this.objectType = objectType;

    this.objectGroup = new PhetioGroup( ( tandem, objectType: CASObjectType, providedOptions ) => {

      // TODO: Optionize
      const options = merge( { tandem: tandem }, providedOptions );
      return new CASObject( objectType, options );
    }, [ objectType, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( CASObject.CASObjectIO ),
      tandem: options.tandem.createTandem( objectType === CASObjectType.SOCCER_BALL ? 'soccerBallGroup' : 'dataPointGroup' )
    } );
  }

  createBall() {

    // we know x0 and final x.  We know a = -g.  Solve for v and t.
    // solve for v and t
    // x1 = x0 + v_x*t
    // y1 = y0 + v_y*t + 1/2 a t^2

    // Different kickers should have different initial velocity.
    const a = -9.8; // meters / second squared
    const y0 = this.objectType.radius;
    const x0 = 0;

    // TODO: Follow a specified distribution
    const x1 = dotRandom.nextIntBetween( 1, 16 );
    const y1 = this.objectType.radius;// land on the ground TODO: account for ball radius
    const t = dotRandom.nextDoubleBetween( 1, 3 ); // TODO: this should be computed not assigned
    const vx = ( x1 - x0 ) / t;
    const vy = ( y1 - y0 - 1 / 2 * a * t * t ) / t;

    // const distance = 8;
    const position = new Vector2( 0, y0 );
    const velocity = new Vector2( vx, vy );

    this.objectGroup.createNextElement( this.objectType, {
      position: position,
      velocity: velocity,
      targetX: x1
    } );
  }

  /**
   * Resets the model.
   */
  reset() {
    this.objectGroup.clear();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  step( dt: number ) {
    this.objectGroup.forEach( casObject => casObject.step( dt ) );
  }
}

centerAndSpread.register( 'CASModel', CASModel );
export default CASModel;