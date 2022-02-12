// Copyright 2022, University of Colorado Boulder

/**
 * Model for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import { CASModelOptions } from '../../common/model/CASModel.js';
import SoccerModel from '../../common/model/SoccerModel.js';

type MedianModelSelfOptions = {};
type MedianModelOptions = MedianModelSelfOptions & CASModelOptions;

class MedianModel extends SoccerModel {

  constructor( options: MedianModelOptions ) {

    options = optionize<MedianModelOptions, MedianModelSelfOptions, CASModelOptions>( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );
  }
}

centerAndSpread.register( 'MedianModel', MedianModel );
export default MedianModel;