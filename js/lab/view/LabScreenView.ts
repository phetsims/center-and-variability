// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import LabModel from '../model/LabModel.js';
import CASScreenView, { CASScreenViewOptions } from '../../common/view/CASScreenView.js';
import CASConstants from '../../common/CASConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';

type LabScreenViewOptions = CASScreenViewOptions;

class LabScreenView extends CASScreenView {

  constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<LabScreenViewOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - CASConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CASConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
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

centerAndSpread.register( 'LabScreenView', LabScreenView );
export default LabScreenView;