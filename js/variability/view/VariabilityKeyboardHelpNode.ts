// Copyright 2023-2024, University of Colorado Boulder

/**
 * VariabilityKeyboardHelpNode displays the keyboard help content for the Variability screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVKeyboardHelpGrabOrReleaseSection from '../../common/view/CAVKeyboardHelpGrabOrReleaseSection.js';
import CAVKeyboardHelpMoveGrabbedBallAndOrCardSection from '../../common/view/CAVKeyboardHelpMoveGrabbedBallAndOrCardSection.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import VariabilityKeyboardHelpSection from './VariabilityKeyboardHelpSection.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class VariabilityKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpGrabOrReleaseSection( CenterAndVariabilityStrings.keyboardHelpDialog.grabOrReleaseBallStringProperty ),
      new CAVKeyboardHelpMoveGrabbedBallAndOrCardSection(
        CenterAndVariabilityStrings.keyboardHelpDialog.moveGrabbedBallTitleStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.moveGrabbedBallStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty,
        CenterAndVariabilityFluent.a11y.keyboardHelp.ballStringProperty,
        CenterAndVariabilityFluent.a11y.keyboardHelp.numberLineStringProperty
      )
    ], new VariabilityKeyboardHelpSection() );
  }
}

centerAndVariability.register( 'VariabilityKeyboardHelpNode', VariabilityKeyboardHelpNode );