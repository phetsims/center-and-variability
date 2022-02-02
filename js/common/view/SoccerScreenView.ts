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
import CASModel from '../model/CASModel.js';
import CASScreenView, { CASScreenViewOptions } from './CASScreenView.js';
import StatusBar from '../../../../vegas/js/StatusBar.js';
import QuestionBar, { QuestionBarOptions } from './QuestionBar.js';

type SoccerScreenViewSelfOptions = {
  questionBarOptions: QuestionBarOptions
};
export type SoccerScreenViewOptions = SoccerScreenViewSelfOptions & CASScreenViewOptions;

class SoccerScreenView extends CASScreenView {
  questionBar: StatusBar;

  constructor( model: CASModel, options: SoccerScreenViewOptions ) {
    options = optionize<SoccerScreenViewOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED

    }, options );

    super( model, options );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, options.questionBarOptions );
    this.addChild( this.questionBar );
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

centerAndSpread.register( 'SoccerScreenView', SoccerScreenView );
export default SoccerScreenView;