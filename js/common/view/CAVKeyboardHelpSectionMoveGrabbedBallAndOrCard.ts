// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog describing how to change the shape by moving sides and vertices.
 *
 * Move Grabbed Ball or Card
 * - Move grabbed ball or card: <- -> or AD
 * - Move in larger steps: PgUp PgDn
 * - Jump to start of cards or number line: Home
 * - Jump to end of cards or number line: End
 * - Jump ball to tick mark: 0-9
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

export default class CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard extends KeyboardHelpSection {
  public constructor( title: string, moveMessage: string, jumpStartMessage: string, jumpEndMessage: string ) {
    super( title, [ KeyboardHelpSectionRow.labelWithIcon( moveMessage, KeyboardHelpIconFactory.iconOrIcon(
      KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
      KeyboardHelpIconFactory.iconRow( [ LetterKeyNode.a(), LetterKeyNode.d() ], { spacing: 1.3 } )
    ) ), KeyboardHelpSectionRow.labelWithIcon(
      'Move in larger steps',
      KeyboardHelpIconFactory.pageUpPageDownRowIcon()
    ), KeyboardHelpSectionRow.labelWithIcon(
      jumpStartMessage,
      TextKeyNode.home(), { labelOptions: { lineWrap: 200 } }
    ), KeyboardHelpSectionRow.labelWithIcon(
      jumpEndMessage,
      TextKeyNode.end(), { labelOptions: { lineWrap: 200 } }
    ), KeyboardHelpSectionRow.labelWithIcon(
      'Jump ball to tick mark',
      KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 0 ), new NumberKeyNode( 9 ) )
    ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard', CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard );
