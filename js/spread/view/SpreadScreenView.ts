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
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import CASColors from '../../common/CASColors.js';

type SpreadScreenViewOptions = SoccerScreenViewOptions;

class SpreadScreenView extends SoccerScreenView {

  constructor( model: SpreadModel, providedOptions: SpreadScreenViewOptions ) {

    const options = optionize<SpreadScreenViewOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED,

      questionBarOptions: {
        barFill: CASColors.spreadQuestionBarFillColorProperty
      }
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