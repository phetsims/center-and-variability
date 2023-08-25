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
import { SECTION_LABEL_OPTIONS } from '../../common/view/CAVKeyboardHelpNode.js';

export default class MeanAndMedianKeyboardHelpPredictSection extends KeyboardHelpSection {
  public constructor() {

    super( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.meanAndMedianScreen.predictMeanOrMedianStringProperty, [
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerStringProperty,
        KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerInLargerStepsStringProperty,
        KeyboardHelpIconFactory.pageUpPageDownRowIcon(), SECTION_LABEL_OPTIONS
      ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerInSmallerStepsStringProperty,
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ), SECTION_LABEL_OPTIONS
      ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        TextKeyNode.home(), SECTION_LABEL_OPTIONS
      ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty,
        TextKeyNode.end(), SECTION_LABEL_OPTIONS
      ) ] );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpPredictSection', MeanAndMedianKeyboardHelpPredictSection );
