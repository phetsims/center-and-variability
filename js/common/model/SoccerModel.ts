// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the screens that use soccer.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel, { CASModelOptions } from '../../common/model/CASModel.js';
import CASObjectType from '../../common/model/CASObjectType.js';

type SoccerModelSelfOptions = {};
type SoccerModelOptions = SoccerModelSelfOptions & CASModelOptions;

class SoccerModel extends CASModel {

  constructor( options: SoccerModelOptions ) {

    options = optionize<SoccerModelOptions, SoccerModelSelfOptions, CASModelOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( CASObjectType.SOCCER_BALL, options );
  }
}

centerAndSpread.register( 'SoccerModel', SoccerModel );
export default SoccerModel;