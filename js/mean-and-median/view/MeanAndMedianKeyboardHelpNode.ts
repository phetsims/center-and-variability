// Copyright 2022-2023, University of Colorado Boulder

/**
 * The keyboard help content for the Mean and Median screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import CAVKeyboardHelpGrabOrReleaseSection from '../../common/view/CAVKeyboardHelpGrabOrReleaseSection.js';
import CAVKeyboardHelpMoveGrabbedBallAndOrCardSection from '../../common/view/CAVKeyboardHelpMoveGrabbedBallAndOrCardSection.js';
import MeanAndMedianKeyboardHelpPredictSection from './MeanAndMedianKeyboardHelpPredictSection.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class MeanAndMedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpGrabOrReleaseSection( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.grabOrReleaseBallStringProperty ),
      new CAVKeyboardHelpMoveGrabbedBallAndOrCardSection(
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
