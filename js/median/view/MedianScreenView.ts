// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen View for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianModel from '../model/MedianModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MeanOrMedianScreenView, { MeanOrMedianScreenViewOptions } from '../../common/view/MeanOrMedianScreenView.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions =
  SelfOptions
  & StrictOmit<MeanOrMedianScreenViewOptions, 'isMedianScreen' | 'isVariabilityScreen' | 'questionBarOptions'>;

export default class MedianScreenView extends MeanOrMedianScreenView {

  public constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions, SelfOptions, MeanOrMedianScreenViewOptions>()( {
      isMedianScreen: true,
      isVariabilityScreen: false,
      questionBarOptions: {
        barFill: CAVColors.medianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.medianQuestionStringProperty
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
      }
    }, providedOptions );

    super( model, options );
  }
}

centerAndVariability.register( 'MedianScreenView', MedianScreenView );