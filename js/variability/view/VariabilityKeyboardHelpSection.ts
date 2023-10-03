// Copyright 2023, University of Colorado Boulder

/**
 * VariabilityKeyboardHelpSection displays the help content for the KeyboardHelpDialog for moving the pointer,
 * interval handle, or interval block in the Variability screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import StringProperty from '../../../../axon/js/StringProperty.js';

export default class VariabilityKeyboardHelpSection extends SliderControlsKeyboardHelpSection {
  public constructor() {

    super( {
      headingStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.variabilityScreen.movePointerIntervalHandleOrIntervalBlockStringProperty,
      sliderStringProperty: new StringProperty( '' ),
      verbStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.moveStringProperty,
      maximumStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.endOfNumberLineStringProperty,
      minimumStringProperty: CenterAndVariabilityStrings.keyboardHelpDialog.startOfNumberLineStringProperty
    } );
  }
}

centerAndVariability.register( 'VariabilityKeyboardHelpSection', VariabilityKeyboardHelpSection );
