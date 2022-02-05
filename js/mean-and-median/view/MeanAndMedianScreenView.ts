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
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import CASColors from '../../common/CASColors.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';

type MeanAndMedianScreenViewOptions = SoccerScreenViewOptions;

class MeanAndMedianScreenView extends SoccerScreenView {

  constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions>( {
      questionBarOptions: {
        barFill: CASColors.meanAndMedianQuestionBarFillColorProperty,
        labelText: centerAndSpreadStrings.meanAndMedianQuestion
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );
  }
}

centerAndSpread.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );
export default MeanAndMedianScreenView;