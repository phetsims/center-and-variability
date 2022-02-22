// Copyright 2022, University of Colorado Boulder

/**
 * ScreenView for the "Lab" screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import LabModel from '../model/LabModel.js';
import CASScreenView, { CASScreenViewOptions } from '../../common/view/CASScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type LabScreenViewOptions = CASScreenViewOptions;

class LabScreenView extends CASScreenView {

  constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<LabScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, ModelViewTransform2.createIdentity(), options );
  }

  /**
   * Resets the view.
   */
  reset(): void {
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
  }
}

centerAndSpread.register( 'LabScreenView', LabScreenView );
export default LabScreenView;