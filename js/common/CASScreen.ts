// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CASColors from '../common/CASColors.js';
import centerAndSpread from '../centerAndSpread.js';
import CASModel from './model/CASModel.js';
import CASScreenView from './view/CASScreenView.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';

// type CASScreenOptions = ScreenOptions; //TODO
export type CASScreenOptions = PhetioObjectOptions & Required<Pick<PhetioObjectOptions, 'tandem'>>;

// TODO: Can we delete this file or does it provide value???
class CASScreen extends Screen {

  constructor( createModel: () => CASModel, createView: ( m: CASModel ) => CASScreenView, providedOptions?: CASScreenOptions ) {

    const options = optionize<CASScreenOptions>( {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: CASColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      createModel,
      createView,
      options
    );
  }
}

centerAndSpread.register( 'CASScreen', CASScreen );
export default CASScreen;