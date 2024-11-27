// Copyright 2023-2024, University of Colorado Boulder

/**
 * MeanAndMedianKeyboardHelpPredictSection provides detailed keyboard guidance for
 * predicting the median in the Mean and Median screen. It offers visual aids and
 * descriptions for various key commands, such as navigating or adjusting the prediction pointer.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class MeanAndMedianKeyboardHelpPredictSection extends SliderControlsKeyboardHelpSection {
  public constructor() {

    super( {
      headingStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictMeanOrMedianStringProperty,
      adjustSliderStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerStringProperty,
      adjustInSmallerStepsStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictMeanInSmallerStepsStringProperty,
      adjustInLargerStepsStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.moveInLargerStepsStringProperty,
      maximumStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.endOfNumberLineStringProperty,
      minimumStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.startOfNumberLineStringProperty
    } );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpPredictSection', MeanAndMedianKeyboardHelpPredictSection );