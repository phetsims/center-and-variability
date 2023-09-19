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

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import centerAndVariability from '../../centerAndVariability.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class MedianKeyboardHelpPredictMedianSection extends KeyboardHelpSection {
  public constructor() {
    super( 'Predict Median', [
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.movePredictMedianStringProperty,
        KeyboardHelpIconFactory.iconOrIcon(
          KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
          KeyboardHelpIconFactory.upDownArrowKeysRowIcon()
        ) ), KeyboardHelpSectionRow.labelWithIcon(
        CenterAndVariabilityStrings.keyboardHelpDialog.moveInLargerStepsStringProperty,
        KeyboardHelpIconFactory.pageUpPageDownRowIcon()
      ), KeyboardHelpSectionRow.labelWithIcon(
        CenterAndVariabilityStrings.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        TextKeyNode.home(), { labelOptions: { lineWrap: 200 } }
      ), KeyboardHelpSectionRow.labelWithIcon(
        CenterAndVariabilityStrings.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty,
        TextKeyNode.end(), { labelOptions: { lineWrap: 200 } }
      ) ] );
  }
}

centerAndVariability.register( 'MedianKeyboardHelpPredictMedianSection', MedianKeyboardHelpPredictMedianSection );
