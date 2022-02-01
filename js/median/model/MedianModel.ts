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

type MedianModelSelfOptions = {};
type MedianModelOptions = MedianModelSelfOptions & CASModelOptions;

class MedianModel extends CASModel {

  constructor( options: MedianModelOptions ) {

    options = optionize<MedianModelOptions, MedianModelSelfOptions, CASModelOptions>( {

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

centerAndSpread.register( 'MedianModel', MedianModel );
export default MedianModel;