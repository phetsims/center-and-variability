// Copyright 2023-2024, University of Colorado Boulder

/**
 * MeanAndMedianKeyboardHelpNode provides a guide to keyboard interactions on the Mean and Median screen.
 * It defines input behaviors for different keyboard actions, such as grabbing, moving, or predicting with
 * interactive elements in the simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVKeyboardHelpGrabOrReleaseSection from '../../common/view/CAVKeyboardHelpGrabOrReleaseSection.js';
import CAVKeyboardHelpMoveGrabbedBallAndOrCardSection from '../../common/view/CAVKeyboardHelpMoveGrabbedBallAndOrCardSection.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import MeanAndMedianKeyboardHelpPredictSection from './MeanAndMedianKeyboardHelpPredictSection.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class MeanAndMedianKeyboardHelpNode extends CAVKeyboardHelpNode {

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
    ], new MeanAndMedianKeyboardHelpPredictSection() );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpNode', MeanAndMedianKeyboardHelpNode );