// Copyright 2023-2025, University of Colorado Boulder

/**
 * CAVKeyboardHelpGrabOrReleaseSection provides instructions within the KeyboardHelpDialog. It specifically outlines
 * the steps for grabbing or releasing an item using keyboard inputs in the Center and Variability simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import GrabReleaseKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GrabReleaseKeyboardHelpSection.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class CAVKeyboardHelpGrabOrReleaseSection extends GrabReleaseKeyboardHelpSection {
  public constructor( title: TReadOnlyProperty<string> ) {
    super( title, new Property( '' ) );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpGrabOrReleaseSection', CAVKeyboardHelpGrabOrReleaseSection );