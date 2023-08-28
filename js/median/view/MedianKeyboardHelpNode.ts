// Copyright 2023, University of Colorado Boulder

/**
 * The keyboard help content for the Median screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import CAVKeyboardHelpGrabOrReleaseSection from '../../common/view/CAVKeyboardHelpGrabOrReleaseSection.js';
import CAVKeyboardHelpMoveGrabbedBallAndOrCardSection from '../../common/view/CAVKeyboardHelpMoveGrabbedBallAndOrCardSection.js';
import MedianKeyboardHelpPredictMedianSection from './MedianKeyboardHelpPredictMedianSection.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class MedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpGrabOrReleaseSection( CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.grabOrReleaseBallOrCardStringProperty ),
      new CAVKeyboardHelpMoveGrabbedBallAndOrCardSection(
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardTitleStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.jumpToStartOfCardsOrNumberLineStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.jumpToEndOfCardsOrNumberLineStringProperty
      ),
      new MedianKeyboardHelpPredictMedianSection()
    ] );
  }
}

centerAndVariability.register( 'MedianKeyboardHelpNode', MedianKeyboardHelpNode );
