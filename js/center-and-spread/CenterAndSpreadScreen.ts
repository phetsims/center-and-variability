// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CASColors from '../common/CASColors.js';
import centerAndSpread from '../centerAndSpread.js';
import CenterAndSpreadModel from './model/CenterAndSpreadModel.js';
import CASScreen, { CASScreenOptions } from '../common/CASScreen.js';
import CenterAndSpreadScreenView from './view/CenterAndSpreadScreenView.js';
import centerAndSpreadStrings from '../centerAndSpreadStrings.js';

type CenterAndSpreadScreenOptions = CASScreenOptions;

class CenterAndSpreadScreen extends CASScreen {

  constructor( providedOptions: CenterAndSpreadScreenOptions ) {

    const options = optionize<CenterAndSpreadScreenOptions>( {
      name: centerAndSpreadStrings.screen.centerAndSpread,
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: CASColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new CenterAndSpreadModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: CenterAndSpreadModel ) => new CenterAndSpreadScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndSpread.register( 'CenterAndSpreadScreen', CenterAndSpreadScreen );
export default CenterAndSpreadScreen;