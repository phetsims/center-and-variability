// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CASColors from '../common/CASColors.js';
import centerAndSpread from '../centerAndSpread.js';
import MedianModel from './model/MedianModel.js';
import CASScreen, { CASScreenOptions } from '../common/CASScreen.js';
import MedianScreenView from './view/MedianScreenView.js';
import centerAndSpreadStrings from '../centerAndSpreadStrings.js';

type MedianScreenOptions = CASScreenOptions;

class MedianScreen extends CASScreen<MedianModel, MedianScreenView> {

  constructor( providedOptions: MedianScreenOptions ) {

    const options = optionize<MedianScreenOptions>( {
      name: centerAndSpreadStrings.screen.median,
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: CASColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new MedianModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: MedianModel ) => new MedianScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndSpread.register( 'MedianScreen', MedianScreen );
export default MedianScreen;