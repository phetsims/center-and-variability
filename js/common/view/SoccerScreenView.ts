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
import QuestionBar, { QuestionBarOptions } from './QuestionBar.js';
import KickButtonGroup from './KickButtonGroup.js';
import BackgroundNode from './BackgroundNode.js';

type SoccerScreenViewSelfOptions = {
  questionBarOptions: QuestionBarOptions
};
export type SoccerScreenViewOptions = SoccerScreenViewSelfOptions & CASScreenViewOptions;

class SoccerScreenView extends CASScreenView {
  constructor( model: CASModel, providedOptions: SoccerScreenViewOptions ) {
    const options = optionize<SoccerScreenViewOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED

    }, providedOptions );

    super( model, options );

    this.addChild( new BackgroundNode( 490, this.visibleBoundsProperty ) );

    this.addChild( new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, options.questionBarOptions ) );
    this.addChild( new KickButtonGroup( {
      left: 25,
      bottom: this.layoutBounds.bottom - 8,
      tandem: options.tandem.createTandem( 'kickButtonGroup' )
    } ) );

    this.addChild( this.resetAllButton );
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