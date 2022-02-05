// Copyright 2022, University of Colorado Boulder

/**
 * "Mean & Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CASColors from '../common/CASColors.js';
import centerAndSpread from '../centerAndSpread.js';
import MeanAndMedianModel from './model/MeanAndMedianModel.js';
import CASScreen, { CASScreenOptions } from '../common/CASScreen.js';
import MeanAndMedianScreenView from './view/MeanAndMedianScreenView.js';
import centerAndSpreadStrings from '../centerAndSpreadStrings.js';

type MeanAndMedianScreenOptions = CASScreenOptions;

class MeanAndMedianScreen extends CASScreen {

  constructor( providedOptions: MeanAndMedianScreenOptions ) {

    const options = optionize<MeanAndMedianScreenOptions>( {
      name: centerAndSpreadStrings.screen.meanAndMedian,
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: CASColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new MeanAndMedianModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: MeanAndMedianModel ) => new MeanAndMedianScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndSpread.register( 'MeanAndMedianScreen', MeanAndMedianScreen );
export default MeanAndMedianScreen;