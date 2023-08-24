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

export default class VariabilityKeyboardHelpPredictSection extends KeyboardHelpSection {
  public constructor() {
    super( 'Move Pointer, Interval Handles, or Interval Block', [
      KeyboardHelpSectionRow.labelWithIcon( 'Move', KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( 'Move in smaller steps', KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ) ),
      KeyboardHelpSectionRow.labelWithIcon( 'Move in larger steps', KeyboardHelpIconFactory.pageUpPageDownRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( 'Jump to start of number line', TextKeyNode.home() ),
      KeyboardHelpSectionRow.labelWithIcon( 'Jump to end of number line', TextKeyNode.end() ) ] );
  }
}

centerAndVariability.register( 'VariabilityKeyboardHelpPredictSection', VariabilityKeyboardHelpPredictSection );
