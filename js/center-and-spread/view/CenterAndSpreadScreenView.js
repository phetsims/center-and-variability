// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CenterAndSpreadConstants from '../../common/CenterAndSpreadConstants.js';
import centerAndSpread from '../../centerAndSpread.js';
import CenterAndSpreadModel from '../model/CenterAndSpreadModel.js';

class CenterAndSpreadScreenView extends ScreenView {

  /**
   * @param {CenterAndSpreadModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof CenterAndSpreadModel, 'invalid model' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - CenterAndSpreadConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CenterAndSpreadConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

centerAndSpread.register( 'CenterAndSpreadScreenView', CenterAndSpreadScreenView );
export default CenterAndSpreadScreenView;