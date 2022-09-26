// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianModel from '../model/MedianModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MeanOrMedianScreenView, { MeanOrMedianScreenViewOptions } from '../../common/view/MeanOrMedianScreenView.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions = SelfOptions & MeanOrMedianScreenViewOptions;

class MedianScreenView extends MeanOrMedianScreenView {

  private constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions, SelfOptions, MeanOrMedianScreenViewOptions>()( {

      // TODO: TypeScript is okay with not including isMedianScreen, why? Severe problem!
      isMedianScreen: true,
      questionBarOptions: {
        barFill: CAVColors.medianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.medianQuestion
      },
      topCheckboxGroupOptions: {
        includeSortData: true,
        includeMean: false,
        medianBarIconOptions: {
          notchDirection: 'up',
          barStyle: 'continuous'
        },
        showMedianCheckboxIcon: false
      },
      bottomCheckboxGroupOptions: {
        includeMean: false,
        includePredictMean: false
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );
  }
}

centerAndVariability.register( 'MedianScreenView', MedianScreenView );
export default MedianScreenView;