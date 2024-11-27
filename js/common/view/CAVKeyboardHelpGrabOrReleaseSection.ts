// Copyright 2023-2024, University of Colorado Boulder

/**
 * CAVKeyboardHelpGrabOrReleaseSection provides instructions within the KeyboardHelpDialog. It specifically outlines
 * the steps for grabbing or releasing an item using keyboard inputs in the Center and Variability simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class CAVKeyboardHelpGrabOrReleaseSection extends KeyboardHelpSection {
  public constructor( title: LocalizedStringProperty ) {
    super( title, [
      KeyboardHelpSectionRow.labelWithIcon(
        CenterAndVariabilityStrings.keyboardHelpDialog.grabOrReleaseStringProperty,
        KeyboardHelpIconFactory.spaceOrEnter()
      ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpGrabOrReleaseSection', CAVKeyboardHelpGrabOrReleaseSection );