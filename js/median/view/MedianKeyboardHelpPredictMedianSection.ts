// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog for moving the Predict Median.
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
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.medianScreen.movePredictMedianStringProperty,
        KeyboardHelpIconFactory.iconOrIcon(
          KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
          KeyboardHelpIconFactory.upDownArrowKeysRowIcon()
        ) ), KeyboardHelpSectionRow.labelWithIcon(
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.moveInLargerStepsStringProperty,
        KeyboardHelpIconFactory.pageUpPageDownRowIcon()
      ), KeyboardHelpSectionRow.labelWithIcon(
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        TextKeyNode.home(), { labelOptions: { lineWrap: 200 } }
      ), KeyboardHelpSectionRow.labelWithIcon(
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty,
        TextKeyNode.end(), { labelOptions: { lineWrap: 200 } }
      ) ] );
  }
}

centerAndVariability.register( 'MedianKeyboardHelpPredictMedianSection', MedianKeyboardHelpPredictMedianSection );
