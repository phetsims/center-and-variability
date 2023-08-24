// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog describing how to change the shape by moving sides and vertices.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class CAVKeyboardHelpSectionGrabOrRelease extends KeyboardHelpSection {
  public constructor( title: string ) {
    super( title, [ KeyboardHelpSectionRow.labelWithIcon(
      'Grab or release',
      KeyboardHelpIconFactory.spaceOrEnter()
    ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpSectionGrabOrRelease', CAVKeyboardHelpSectionGrabOrRelease );
