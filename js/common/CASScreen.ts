// Copyright 2022, University of Colorado Boulder

/**
 * Base class for all screens in the sim.
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
import CASScreenView, { CASScreenViewOptions } from './view/CASScreenView.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';

type CASScreenSelfOptions = {};
export type CASScreenOptions = CASScreenViewOptions & PhetioObjectOptions & Required<Pick<PhetioObjectOptions, 'tandem'>>;

// TODO: Can we delete this file or does it provide value?  SR: In my opinion, it provides background color and types,
// and provides enough value to stick around.
class CASScreen extends Screen {

  constructor( createModel: () => CASModel, createView: ( m: CASModel ) => CASScreenView, providedOptions?: CASScreenOptions ) {

    const options = optionize<CASScreenOptions, CASScreenSelfOptions, PhetioObjectOptions>( {

      // @ts-ignore TODO: convert Screen to TypeScript
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