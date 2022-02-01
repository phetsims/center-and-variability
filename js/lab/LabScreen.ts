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
import LabModel from './model/LabModel.js';
import CASScreen, { CASScreenOptions } from '../common/CASScreen.js';
import LabScreenView from './view/LabScreenView.js';
import centerAndSpreadStrings from '../centerAndSpreadStrings.js';

type CenterAndSpreadScreenOptions = CASScreenOptions;

class LabScreen extends CASScreen {

  constructor( providedOptions: CenterAndSpreadScreenOptions ) {

    const options = optionize<CenterAndSpreadScreenOptions>( {
      name: centerAndSpreadStrings.screen.lab,
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: CASColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new LabModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: LabModel ) => new LabScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndSpread.register( 'LabScreen', LabScreen );
export default LabScreen;