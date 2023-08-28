// Copyright 2023, University of Colorado Boulder

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
      new CAVKeyboardHelpGrabOrReleaseSection( CenterAndVariabilityStrings.keyboardHelpDialog.grabOrReleaseBallStringProperty ),
      new CAVKeyboardHelpMoveGrabbedBallAndOrCardSection(
        CenterAndVariabilityStrings.keyboardHelpDialog.moveGrabbedBallTitleStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.moveGrabbedBallStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty
      ),
      new MeanAndMedianKeyboardHelpPredictSection()
    ] );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpNode', MeanAndMedianKeyboardHelpNode );
