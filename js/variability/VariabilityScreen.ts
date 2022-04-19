// Copyright 2022, University of Colorado Boulder

/**
 * Screen for the "Variability" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CAVColors from '../common/CAVColors.js';
import centerAndVariability from '../centerAndVariability.js';
import VariabilityModel from './model/VariabilityModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import VariabilityScreenView from './view/VariabilityScreenView.js';
import centerAndVariabilityStrings from '../centerAndVariabilityStrings.js';

type VariabilityScreenOptions = CAVScreenOptions;

class VariabilityScreen extends CAVScreen<VariabilityModel, VariabilityScreenView> {

  constructor( providedOptions: VariabilityScreenOptions ) {

    const options = optionize<VariabilityScreenOptions, {}>()( {
      name: centerAndVariabilityStrings.screen.variability,
      backgroundColorProperty: CAVColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
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