// Copyright 2023, University of Colorado Boulder

/**
 * MeanAndMedianKeyboardHelpPredictSection provides detailed keyboard guidance for
 * predicting the median in the Mean and Median screen. It offers visual aids and
 * descriptions for various key commands, such as navigating or adjusting the prediction pointer.
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

    super( CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.predictMeanOrMedianStringProperty, [
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerStringProperty,
        KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerInLargerStepsStringProperty,
        KeyboardHelpIconFactory.pageUpPageDownRowIcon(), SECTION_LABEL_OPTIONS
      ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerInSmallerStepsStringProperty,
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ), SECTION_LABEL_OPTIONS
      ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        TextKeyNode.home(), SECTION_LABEL_OPTIONS
      ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty,
        TextKeyNode.end(), SECTION_LABEL_OPTIONS
      ) ] );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpPredictSection', MeanAndMedianKeyboardHelpPredictSection );
