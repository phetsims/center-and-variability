// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CASScreenView, { CASScreenViewOptions } from '../../common/view/CASScreenView.js';
import CASConstants from '../../common/CASConstants.js';

type MedianScreenViewOptions = CASScreenViewOptions;

class MeanAndMedianScreenView extends CASScreenView {

  constructor( model: MeanAndMedianModel, providedOptions: MedianScreenViewOptions ) {
    assert && assert( model instanceof MeanAndMedianModel, 'invalid model' );

    const options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - CASConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CASConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: providedOptions.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  reset() {
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ) {
  }
}

centerAndSpread.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );
export default MeanAndMedianScreenView;