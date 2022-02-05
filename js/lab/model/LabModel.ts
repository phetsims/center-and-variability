// Copyright 2022, University of Colorado Boulder

/**
 * Model for the "Lab" screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel, { CASModelOptions } from '../../common/model/CASModel.js';
import CASObjectType from '../../common/model/CASObjectType.js';

type LabModelSelfOptions = {};
type LabModelOptions = LabModelSelfOptions & CASModelOptions;

class LabModel extends CASModel {

  constructor( options: LabModelOptions ) {

    options = optionize<LabModelOptions, LabModelSelfOptions, CASModelOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( CASObjectType.DATA_POINT, options );
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

centerAndSpread.register( 'LabModel', LabModel );
export default LabModel;