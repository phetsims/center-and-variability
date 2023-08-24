// Copyright 2022-2023, University of Colorado Boulder

/**
 * The keyboard help content for the Variability screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import CAVKeyboardHelpSectionGrabOrRelease from '../../common/view/CAVKeyboardHelpSectionGrabOrRelease.js';
import CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard from '../../common/view/CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard.js';
import VariabilityKeyboardHelpSection from './VariabilityKeyboardHelpSection.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class VariabilityKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpSectionGrabOrRelease( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.grabOrReleaseBallStringProperty ),
      new CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard(
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.moveGrabbedBallTitleStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.moveGrabbedBallStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty
      ),
      new VariabilityKeyboardHelpSection()
    ] );
  }
}

centerAndVariability.register( 'VariabilityKeyboardHelpNode', VariabilityKeyboardHelpNode );
