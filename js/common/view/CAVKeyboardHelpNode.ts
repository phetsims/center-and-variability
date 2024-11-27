// Copyright 2023-2024, University of Colorado Boulder

/**
 * CAVKeyboardHelpNode offers the specific keyboard guidance for a Center and Variability simulation screen.
 * It is a structured layout presenting basic actions and other keyboard interactions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import centerAndVariability from '../../centerAndVariability.js';

export const SECTION_LABEL_OPTIONS = { labelOptions: { lineWrap: 200 } };

export default class CAVKeyboardHelpNode extends TwoColumnKeyboardHelpContent {
  public constructor( leftContent: KeyboardHelpSection[], sliderContent: KeyboardHelpSection ) {
    KeyboardHelpSection.alignHelpSectionIcons( leftContent );
    super( leftContent, [ sliderContent, new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpNode', CAVKeyboardHelpNode );