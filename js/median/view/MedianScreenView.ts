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
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions =
  SelfOptions
  & StrictOmit<MeanOrMedianScreenViewOptions, 'isMedianScreen' | 'questionBarOptions'>;

class MedianScreenView extends MeanOrMedianScreenView {

  public constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions, SelfOptions, MeanOrMedianScreenViewOptions>()( {
      // TODO-TS: Why are isMedianScreen and questionBarOptions optional here? see https://github.com/phetsims/center-and-variability/issues/142
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