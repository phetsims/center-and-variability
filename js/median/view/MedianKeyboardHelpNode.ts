// Copyright 2023-2025, University of Colorado Boulder

/**
 * The MedianKeyboardHelpNode provides specialized keyboard help content tailored for the Median screen.
 * This content assists users in navigating and interacting with the Median screen using keyboard controls.
 * It offers guidance on:
 * - Grabbing or releasing a ball or card.
 * - Moving a grabbed ball or card, including jumping to the start or end of cards or the number line.
 * - Predicting the median.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVKeyboardHelpGrabOrReleaseSection from '../../common/view/CAVKeyboardHelpGrabOrReleaseSection.js';
import CAVKeyboardHelpMoveGrabbedBallAndOrCardSection from '../../common/view/CAVKeyboardHelpMoveGrabbedBallAndOrCardSection.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import MedianKeyboardHelpPredictMedianSection from './MedianKeyboardHelpPredictMedianSection.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class MedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpGrabOrReleaseSection( CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.grabOrReleaseBallOrCardStringProperty ),
      new CAVKeyboardHelpMoveGrabbedBallAndOrCardSection(
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardTitleStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.jumpToStartOfCardsOrNumberLineStringProperty,
        CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.jumpToEndOfCardsOrNumberLineStringProperty,
        CenterAndVariabilityFluent.a11y.keyboardHelp.jumpToStartOfCardsOrNumberLineDescriptionStringProperty,
        CenterAndVariabilityFluent.a11y.keyboardHelp.jumpToEndOfCardsOrNumberLineDescriptionStringProperty,
        CenterAndVariabilityFluent.a11y.keyboardHelp.moveGrabbedBallOrCardDescriptionStringProperty
      )
    ], new MedianKeyboardHelpPredictMedianSection() );
  }
}

centerAndVariability.register( 'MedianKeyboardHelpNode', MedianKeyboardHelpNode );