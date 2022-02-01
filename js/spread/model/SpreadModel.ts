// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel, { CASModelOptions } from '../../common/model/CASModel.js';

type SpreadModelSelfOptions = {};
type SpreadModelOptions = SpreadModelSelfOptions & CASModelOptions;

class SpreadModel extends CASModel {

  constructor( options: SpreadModelOptions ) {

    options = optionize<SpreadModelOptions, SpreadModelSelfOptions, CASModelOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );
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

centerAndSpread.register( 'SpreadModel', SpreadModel );
export default SpreadModel;