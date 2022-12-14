// Copyright 2022, University of Colorado Boulder

/**
 * The "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image } from '../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CAVColors from '../common/CAVColors.js';
import centerAndVariability from '../centerAndVariability.js';
import MedianModel from './model/MedianModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import MedianScreenView from './view/MedianScreenView.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import medianScreenIcon_png from '../../images/medianScreenIcon_png.js';

type MedianScreenOptions = CAVScreenOptions;

class MedianScreen extends CAVScreen<MedianModel, MedianScreenView> {

  public constructor( providedOptions: MedianScreenOptions ) {

    const options = optionize<MedianScreenOptions, EmptySelfOptions>()( {
      name: CenterAndVariabilityStrings.screen.medianStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( medianScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      backgroundColorProperty: CAVColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new MedianModel( {
        includeCards: true,
        tandem: options.tandem.createTandem( 'model' ),
        instrumentMeanPredictionProperty: false
      } ),
      ( model: MedianModel ) => new MedianScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndVariability.register( 'MedianScreen', MedianScreen );
export default MedianScreen;