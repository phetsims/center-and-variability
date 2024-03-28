// Copyright 2022-2024, University of Colorado Boulder

/**
 * The MedianScreen represents the entire Median screen in the simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image } from '../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import centerAndVariability from '../centerAndVariability.js';
import MedianModel from './model/MedianModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import MedianScreenView from './view/MedianScreenView.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import medianScreenIcon_png from '../../images/medianScreenIcon_png.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import MedianKeyboardHelpNode from './view/MedianKeyboardHelpNode.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenOptions = SelfOptions & StrictOmit<CAVScreenOptions, 'name' | 'homeScreenIcon' | 'createKeyboardHelpNode'>;

export default class MedianScreen extends CAVScreen<MedianModel, MedianScreenView> {

  public constructor( providedOptions: MedianScreenOptions ) {

    const options = optionize<MedianScreenOptions, SelfOptions, CAVScreenOptions>()( {
      name: CenterAndVariabilityStrings.screen.medianStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( medianScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      createKeyboardHelpNode: () => new MedianKeyboardHelpNode()
    }, providedOptions );

    super(
      () => new MedianModel( {
        tandem: options.tandem.createTandem( 'model' )
      } ),
      ( model: MedianModel ) => new MedianScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndVariability.register( 'MedianScreen', MedianScreen );