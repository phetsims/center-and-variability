// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

// import optionize from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
// import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';

type CASModelSelfOptions = {};
export type CASModelOptions = CASModelSelfOptions & PhetioObjectOptions & Required<Pick<PhetioObjectOptions, 'tandem'>>; // TODO: Do we like the inline exports?

class CASModel {

  constructor( providedOptions: CASModelOptions ) {

    // const options = optionize<CASModelOptions, CASModelSelfOptions, PhetioObjectOptions>( {
    //
    //   // phet-io options
    //   tandem: Tandem.REQUIRED
    // }, providedOptions );

  }

  /**
   * Resets the model.
   */
  reset() {
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  step( dt: number ) {
  }
}

centerAndSpread.register( 'CASModel', CASModel );
export default CASModel;