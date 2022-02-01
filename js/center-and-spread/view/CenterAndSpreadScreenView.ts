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
import CenterAndSpreadModel from '../model/CenterAndSpreadModel.js';
import CASScreenView, { CASScreenViewOptions } from '../../common/view/CASScreenView.js';

type CenterAndSpreadScreenViewOptions = CASScreenViewOptions;

class CenterAndSpreadScreenView extends CASScreenView {

  constructor( model: CenterAndSpreadModel, providedOptions: CenterAndSpreadScreenViewOptions ) {

    const options = optionize<CenterAndSpreadScreenViewOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );
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

centerAndSpread.register( 'CenterAndSpreadScreenView', CenterAndSpreadScreenView );
export default CenterAndSpreadScreenView;