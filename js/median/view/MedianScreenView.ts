// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import MedianModel from '../model/MedianModel.js';
import CASColors from '../../common/CASColors.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import MeanOrMedianScreenView, { MeanOrMedianScreenViewOptions } from '../../common/view/MeanOrMedianScreenView.js';

type MedianScreenViewOptions = MeanOrMedianScreenViewOptions;

class MedianScreenView extends MeanOrMedianScreenView {

  constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions>( {
      // TODO: TypeScript is okay with not including isMedianScreen, why?
      isMedianScreen: true,
      questionBarOptions: {
        barFill: CASColors.medianQuestionBarFillColorProperty,
        labelText: centerAndSpreadStrings.medianQuestion
      },
      topCheckboxPanelOptions: {
        includeSortData: true,
        includeShowMean: false
      },
      bottomCheckboxPanelOptions: {
        includeMean: false,
        includePredictMean: false
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );
  }
}

centerAndSpread.register( 'MedianScreenView', MedianScreenView );
export default MedianScreenView;