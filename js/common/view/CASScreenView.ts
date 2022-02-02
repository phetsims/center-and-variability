// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel from '../model/CASModel.js';

export type CASScreenViewOptions = ScreenViewOptions;

class CASScreenView extends ScreenView {

  constructor( model: CASModel, options: CASScreenViewOptions ) {
    options = optionize<CASScreenViewOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );
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

centerAndSpread.register( 'CASScreenView', CASScreenView );
export default CASScreenView;