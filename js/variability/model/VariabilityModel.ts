// Copyright 2022, University of Colorado Boulder

/**
 * Model for the "Variability" class.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import { CAVModelOptions } from '../../common/model/CAVModel.js';
import SoccerModel from '../../common/model/SoccerModel.js';
import CAVConstants from '../../common/CAVConstants.js';

type SelfOptions = EmptySelfOptions;
type VariabilityModelOptions = SelfOptions & CAVModelOptions;

class VariabilityModel extends SoccerModel {

  public constructor( options: VariabilityModelOptions ) {

    options = optionize<VariabilityModelOptions, SelfOptions, CAVModelOptions>()( {}, options );

    super( CAVConstants.NUMBER_OF_OBJECTS_LARGE, options );
  }
}

centerAndVariability.register( 'VariabilityModel', VariabilityModel );
export default VariabilityModel;