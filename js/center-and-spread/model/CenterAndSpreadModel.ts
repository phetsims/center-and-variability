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

type CenterAndSpreadModelSelfOptions = {};
type CenterAndSpreadModelOptions = CenterAndSpreadModelSelfOptions & CASModelOptions;

class CenterAndSpreadModel extends CASModel {

  constructor( options: CenterAndSpreadModelOptions ) {

    options = optionize<CenterAndSpreadModelOptions, CenterAndSpreadModelSelfOptions, CASModelOptions>( {

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

centerAndSpread.register( 'CenterAndSpreadModel', CenterAndSpreadModel );
export default CenterAndSpreadModel;