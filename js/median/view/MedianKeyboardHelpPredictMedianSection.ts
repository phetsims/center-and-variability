// Copyright 2023, University of Colorado Boulder

/**
 * The MedianKeyboardHelpPredictMedianSection outlines keyboard instructions specifically for the "Predict Median" function within the KeyboardHelpDialog.
 * This section provides guidance on:
 * - Moving the Predict Median using arrow keys.
 * - Making larger stepwise movements.
 * - Jumping to the start or end of the number line.
 * Icons associated with specific key commands are presented alongside these instructions for clear visual representation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';

export default class MedianKeyboardHelpPredictMedianSection extends SliderControlsKeyboardHelpSection {
  public constructor() {

    super( {
      headingStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.movePredictMedianStringProperty,
      verbStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.moveStringProperty,
      sliderStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.predictMedianStringProperty,
      maximumStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.endOfNumberLineStringProperty,
      minimumStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.startOfNumberLineStringProperty,
      includeSmallerStepsRow: false
    } );
  }
}

centerAndVariability.register( 'MedianKeyboardHelpPredictMedianSection', MedianKeyboardHelpPredictMedianSection );
