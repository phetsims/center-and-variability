// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen for the "Variability" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import CAVColors from '../common/CAVColors.js';
import centerAndVariability from '../centerAndVariability.js';
import VariabilityModel from './model/VariabilityModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import VariabilityScreenView from './view/VariabilityScreenView.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';

type VariabilityScreenOptions = CAVScreenOptions;

class VariabilityScreen extends CAVScreen<VariabilityModel, VariabilityScreenView> {

  private constructor( providedOptions: VariabilityScreenOptions ) {

    const options = optionize<VariabilityScreenOptions, EmptySelfOptions>()( {

      // @ts-expect-error TODO SR can you help with "name" here? https://github.com/phetsims/chipper/issues/1360
      name: CenterAndVariabilityStrings.screen.variabilityStringProperty,
      backgroundColorProperty: CAVColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new VariabilityModel( {
        includeCards: false,
        tandem: options.tandem.createTandem( 'model' ),
        instrumentMeanPredictionProperty: true
      } ),
      ( model: VariabilityModel ) => new VariabilityScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndVariability.register( 'VariabilityScreen', VariabilityScreen );
export default VariabilityScreen;