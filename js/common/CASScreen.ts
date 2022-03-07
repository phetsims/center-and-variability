// Copyright 2022, University of Colorado Boulder

/**
 * Base class for all screens in the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CASColors from '../common/CASColors.js';
import centerAndSpread from '../centerAndSpread.js';
import CASModel from './model/CASModel.js';
import CASScreenView from './view/CASScreenView.js';
import { PickRequired } from '../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {};
export type CASScreenOptions = SelfOptions & ScreenOptions & PickRequired<ScreenOptions, 'tandem'>;

class CASScreen<M extends CASModel, V extends CASScreenView> extends Screen<M, V> {

  constructor( createModel: () => M, createView: ( m: M ) => V, providedOptions?: CASScreenOptions ) {

    const options = optionize<CASScreenOptions, SelfOptions, ScreenOptions>( {
      backgroundColorProperty: CASColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( createModel, createView, options );
  }
}

centerAndSpread.register( 'CASScreen', CASScreen );
export default CASScreen;