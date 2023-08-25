// Copyright 2023, University of Colorado Boulder

/**
 * The keyboard help content for a Center and Variability sim screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import centerAndVariability from '../../centerAndVariability.js';

export const SECTION_LABEL_OPTIONS = { labelOptions: { lineWrap: 200 } };

export default class CAVKeyboardHelpNode extends TwoColumnKeyboardHelpContent {
  public constructor( leftContent: KeyboardHelpSection[] ) {
    KeyboardHelpSection.alignHelpSectionIcons( leftContent );
    super( leftContent, [ new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpNode', CAVKeyboardHelpNode );
