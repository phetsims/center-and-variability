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
import SpreadModel from '../model/SpreadModel.js';
import CASScreenView, { CASScreenViewOptions } from '../../common/view/CASScreenView.js';

type SpreadScreenViewOptions = CASScreenViewOptions;

class SpreadScreenView extends CASScreenView {

  constructor( model: SpreadModel, providedOptions: SpreadScreenViewOptions ) {

    const options = optionize<SpreadScreenViewOptions>( {

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

centerAndSpread.register( 'SpreadScreenView', SpreadScreenView );
export default SpreadScreenView;