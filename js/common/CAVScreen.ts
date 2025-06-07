// Copyright 2022-2025, University of Colorado Boulder

/**
 * Base class for all screens in the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import centerAndVariability from '../centerAndVariability.js';
import CAVColors from '../common/CAVColors.js';
import CAVModel from './model/CAVModel.js';
import CAVScreenView from './view/CAVScreenView.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import CAVSoccerSceneModel from './model/CAVSoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;
export type CAVScreenOptions = SelfOptions & WithRequired<ScreenOptions, 'tandem' | 'name' | 'homeScreenIcon' | 'createKeyboardHelpNode'>;

export default class CAVScreen<T extends CAVSoccerSceneModel, M extends CAVModel<T>, V extends CAVScreenView<T>> extends Screen<M, V> {

  public constructor( createModel: () => M, createView: ( m: M ) => V, providedOptions?: CAVScreenOptions ) {

    const options = optionize<CAVScreenOptions, SelfOptions, ScreenOptions>()( {
      backgroundColorProperty: CAVColors.screenBackgroundColorProperty,
      isDisposable: false
    }, providedOptions );

    super( createModel, createView, options );
  }
}

centerAndVariability.register( 'CAVScreen', CAVScreen );