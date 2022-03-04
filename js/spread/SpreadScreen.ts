// Copyright 2022, University of Colorado Boulder

/**
 * Screen for the "Spread" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CASColors from '../common/CASColors.js';
import centerAndSpread from '../centerAndSpread.js';
import SpreadModel from './model/SpreadModel.js';
import CASScreen, { CASScreenOptions } from '../common/CASScreen.js';
import SpreadScreenView from './view/SpreadScreenView.js';
import centerAndSpreadStrings from '../centerAndSpreadStrings.js';

type SpreadScreenOptions = CASScreenOptions;

class SpreadScreen extends CASScreen<SpreadModel, SpreadScreenView> {

  constructor( providedOptions: SpreadScreenOptions ) {

    const options = optionize<SpreadScreenOptions, {}>( {
      name: centerAndSpreadStrings.screen.spread,
      backgroundColorProperty: CASColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new SpreadModel( {
        includeCards: false,
        tandem: options.tandem.createTandem( 'model' ),
        instrumentMeanPredictionProperty: true
      } ),
      ( model: SpreadModel ) => new SpreadScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndSpread.register( 'SpreadScreen', SpreadScreen );
export default SpreadScreen;