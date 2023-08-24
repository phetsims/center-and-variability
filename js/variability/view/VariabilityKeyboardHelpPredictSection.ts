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

const variabilityStrings = CenterAndVariabilityStrings.a11y.keyboardHelpDialog.variabilityScreen;

export default class VariabilityKeyboardHelpPredictSection extends KeyboardHelpSection {
  public constructor() {

    super( variabilityStrings.movePointerIntervalHandleOrIntervalBlockStringProperty, [
      KeyboardHelpSectionRow.labelWithIcon( variabilityStrings.moveStringProperty, KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( variabilityStrings.moveInSmallerStepsStringProperty, KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() ) ),
      KeyboardHelpSectionRow.labelWithIcon( variabilityStrings.moveInLargerStepsStringProperty, KeyboardHelpIconFactory.pageUpPageDownRowIcon() ),
      KeyboardHelpSectionRow.labelWithIcon( variabilityStrings.jumpToStartOfNumberLineStringProperty, TextKeyNode.home() ),
      KeyboardHelpSectionRow.labelWithIcon( variabilityStrings.jumpToEndOfNumberLineStringProperty, TextKeyNode.end() ) ], {
      headingOptions: { lineWrap: 300 }
    } );
  }
}

centerAndVariability.register( 'VariabilityKeyboardHelpPredictSection', VariabilityKeyboardHelpPredictSection );
