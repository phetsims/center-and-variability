// Copyright 2023, University of Colorado Boulder

/**
 * CAVKeyboardHelpMoveGrabbedBallAndOrCardSection provides help content within the KeyboardHelpDialog. It instructs
 * users on how to move a grabbed ball and/or card using keyboard inputs in the Center and Variability simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import centerAndVariability from '../../centerAndVariability.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import NumberKeyNode from '../../../../scenery-phet/js/keyboard/NumberKeyNode.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { SECTION_LABEL_OPTIONS } from './CAVKeyboardHelpNode.js';

export default class CAVKeyboardHelpMoveGrabbedBallAndOrCardSection extends KeyboardHelpSection {
  public constructor(
    title: LocalizedStringProperty,
    moveMessage: LocalizedStringProperty,
    jumpStartMessage: LocalizedStringProperty,
    jumpEndMessage: LocalizedStringProperty
  ) {
    super( title, [
      KeyboardHelpSectionRow.labelWithIcon( moveMessage,
        KeyboardHelpIconFactory.iconOrIcon(
          KeyboardHelpIconFactory.iconOrIcon(
            KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
            KeyboardHelpIconFactory.iconRow( [ LetterKeyNode.a(), LetterKeyNode.d() ], { spacing: 1.3 } ) ),
          KeyboardHelpIconFactory.iconOrIcon(
            KeyboardHelpIconFactory.upDownArrowKeysRowIcon(),
            KeyboardHelpIconFactory.iconRow( [ LetterKeyNode.w(), LetterKeyNode.s() ] ), { spacing: 1.3 } ) ) ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.moveInLargerStepsStringProperty, KeyboardHelpIconFactory.pageUpPageDownRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( jumpStartMessage, TextKeyNode.home(), SECTION_LABEL_OPTIONS ),
      KeyboardHelpSectionRow.labelWithIcon( jumpEndMessage, TextKeyNode.end(), SECTION_LABEL_OPTIONS ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.jumpBallToTickMarkStringProperty,
        KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 0 ), new NumberKeyNode( 9 ) )
      ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpMoveGrabbedBallAndOrCardSection', CAVKeyboardHelpMoveGrabbedBallAndOrCardSection );
