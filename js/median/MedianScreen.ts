// Copyright 2022-2025, University of Colorado Boulder

/**
 * The MedianScreen represents the entire Median screen in the simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import medianScreenIcon_png from '../../images/medianScreenIcon_png.js';
import centerAndVariability from '../centerAndVariability.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import MedianModel from './model/MedianModel.js';
import MedianKeyboardHelpNode from './view/MedianKeyboardHelpNode.js';
import MedianScreenView from './view/MedianScreenView.js';
import CAVSoccerSceneModel from '../common/model/CAVSoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenOptions = SelfOptions & StrictOmit<CAVScreenOptions, 'name' | 'homeScreenIcon' | 'createKeyboardHelpNode'>;

export default class MedianScreen extends CAVScreen<CAVSoccerSceneModel, MedianModel, MedianScreenView> {

  public constructor( providedOptions: MedianScreenOptions ) {

    const options = optionize<MedianScreenOptions, SelfOptions, CAVScreenOptions>()( {
      name: CenterAndVariabilityStrings.screen.medianStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( medianScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      screenButtonsHelpText: CenterAndVariabilityStrings.a11y.medianScreenHelpTextStringProperty,
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