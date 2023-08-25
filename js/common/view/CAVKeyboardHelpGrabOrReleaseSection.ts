// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog describing how to grab or drop an item.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import centerAndVariability from '../../centerAndVariability.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class CAVKeyboardHelpGrabOrReleaseSection extends KeyboardHelpSection {
  public constructor( title: LocalizedStringProperty ) {
    super( title, [ KeyboardHelpSectionRow.labelWithIcon(
      CenterAndVariabilityStrings.a11y.keyboardHelpDialog.grabOrReleaseStringProperty,
      KeyboardHelpIconFactory.spaceOrEnter()
    ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpGrabOrReleaseSection', CAVKeyboardHelpGrabOrReleaseSection );
