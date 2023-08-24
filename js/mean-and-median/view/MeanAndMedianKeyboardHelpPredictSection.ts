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

export default class MeanAndMedianKeyboardHelpPredictSection extends KeyboardHelpSection {
  public constructor() {
    super( 'Predict Mean or Median', [
      KeyboardHelpSectionRow.labelWithIcon( 'Move prediction pointer',
        KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon(
        'Move prediction pointer in larger steps',
        KeyboardHelpIconFactory.pageUpPageDownRowIcon(), { labelOptions: { lineWrap: 200 } }
      ), KeyboardHelpSectionRow.labelWithIcon(
        'Move prediction pointer in smaller steps',
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ), { labelOptions: { lineWrap: 200 } }
      ), KeyboardHelpSectionRow.labelWithIcon(
        'Jump to start of number line',
        TextKeyNode.home(), { labelOptions: { lineWrap: 200 } }
      ), KeyboardHelpSectionRow.labelWithIcon(
        'Jump to end of number line',
        TextKeyNode.end(), { labelOptions: { lineWrap: 200 } }
      ) ] );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpPredictSection', MeanAndMedianKeyboardHelpPredictSection );
