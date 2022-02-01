// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import centerAndSpreadColors from '../common/CenterAndSpreadColors.js';
import centerAndSpread from '../centerAndSpread.js';
import CenterAndSpreadModel from './model/CenterAndSpreadModel.js';
import CenterAndSpreadScreenView from './view/CenterAndSpreadScreenView.js';

class CenterAndSpreadScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: centerAndSpreadColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new CenterAndSpreadModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new CenterAndSpreadScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndSpread.register( 'CenterAndSpreadScreen', CenterAndSpreadScreen );
export default CenterAndSpreadScreen;