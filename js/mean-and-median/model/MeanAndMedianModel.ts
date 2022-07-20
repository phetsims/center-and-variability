// Copyright 2022, University of Colorado Boulder

/**
 * Model for the "Mean & Median" screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import { CAVModelOptions } from '../../common/model/CAVModel.js';
import SoccerModel from '../../common/model/SoccerModel.js';
import CAVConstants from '../../common/CAVConstants.js';

type SelfOptions = EmptySelfOptions;
type MedianModelOptions = SelfOptions & CAVModelOptions;

class MeanAndMedianModel extends SoccerModel {

  public constructor( options: MedianModelOptions ) {

    options = optionize<MedianModelOptions, SelfOptions, CAVModelOptions>()( {
      tandem: Tandem.REQUIRED
    }, options );

    super( CAVConstants.NUMBER_OF_OBJECTS_SMALL, options );
  }
}

centerAndVariability.register( 'MeanAndMedianModel', MeanAndMedianModel );
export default MeanAndMedianModel;