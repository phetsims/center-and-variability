// Copyright 2022, University of Colorado Boulder

/**
 * VariabilityScreenView is the ScreenView for the 'Variability' screen, which has four different scenes with four different
 * distributions.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import CAVColors from '../../common/CAVColors.js';
import centerAndVariabilityStrings from '../../centerAndVariabilityStrings.js';

type VariabilityScreenViewOptions = StrictOmit<SoccerScreenViewOptions, 'questionBarOptions'>;

class VariabilityScreenView extends SoccerScreenView {

  constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const options = optionize<VariabilityScreenViewOptions, EmptyObjectType, SoccerScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        labelText: centerAndVariabilityStrings.variabilityQuestion
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options as SoccerScreenViewOptions );
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );
export default VariabilityScreenView;