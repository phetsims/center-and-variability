// Copyright 2022, University of Colorado Boulder

/**
 * Base class for all screens in the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CAVColors from '../common/CAVColors.js';
import centerAndVariability from '../centerAndVariability.js';
import CAVModel from './model/CAVModel.js';
import CAVScreenView from './view/CAVScreenView.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptyObjectType;
export type CAVScreenOptions = SelfOptions & ScreenOptions & PickRequired<ScreenOptions, 'tandem'>;

class CAVScreen<M extends CAVModel, V extends CAVScreenView> extends Screen<M, V> {

  constructor( createModel: () => M, createView: ( m: M ) => V, providedOptions?: CAVScreenOptions ) {

    const options = optionize<CAVScreenOptions, SelfOptions, ScreenOptions>()( {
      backgroundColorProperty: CAVColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( createModel, createView, options );
  }
}

centerAndVariability.register( 'CAVScreen', CAVScreen );
export default CAVScreen;