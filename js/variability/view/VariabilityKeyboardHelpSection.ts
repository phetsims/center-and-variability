// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog for moving the pointer, interval handle, or interval block in the Variability screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import centerAndVariability from '../../centerAndVariability.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class VariabilityKeyboardHelpSection extends KeyboardHelpSection {
  public constructor() {

    super( CenterAndVariabilityStrings.keyboardHelpDialog.variabilityScreen.movePointerIntervalHandleOrIntervalBlockStringProperty, [
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.variabilityScreen.moveStringProperty, KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.variabilityScreen.moveInSmallerStepsStringProperty, KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ) ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.moveInLargerStepsStringProperty, KeyboardHelpIconFactory.pageUpPageDownRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty, TextKeyNode.home() ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty, TextKeyNode.end() ) ], {
      headingOptions: { lineWrap: 300 }
    } );
  }
}

centerAndVariability.register( 'VariabilityKeyboardHelpSection', VariabilityKeyboardHelpSection );
