// Copyright 2022-2023, University of Colorado Boulder

/**
 * The keyboard help content for the Quadrilateral sim. This has yet to be designed and is just ready for more content.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import CAVKeyboardHelpSectionGrabOrRelease from '../../common/view/CAVKeyboardHelpSectionGrabOrRelease.js';
import CAVKeyboardHelpSectionMoveGrabbedBallAndOrCardSection from '../../common/view/CAVKeyboardHelpSectionMoveGrabbedBallAndOrCardSection.js';
import MeanAndMedianKeyboardHelpPredictSection from './MeanAndMedianKeyboardHelpPredictSection.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class MeanAndMedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpSectionGrabOrRelease( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.grabOrReleaseBallStringProperty ),
      new CAVKeyboardHelpSectionMoveGrabbedBallAndOrCardSection(
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.moveGrabbedBallTitleStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.moveGrabbedBallStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty
      ),
      new MeanAndMedianKeyboardHelpPredictSection()
    ] );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpNode', MeanAndMedianKeyboardHelpNode );
