// Copyright 2022-2023, University of Colorado Boulder

/**
 * The keyboard help content for the Median screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import CAVKeyboardHelpSectionGrabOrRelease from '../../common/view/CAVKeyboardHelpSectionGrabOrRelease.js';
import CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard from '../../common/view/CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard.js';
import MedianKeyboardHelpPredictMedianSection from './MedianKeyboardHelpPredictMedianSection.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

export default class MedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpSectionGrabOrRelease( CenterAndVariabilityStrings.a11y.keyboardHelpDialog.medianScreen.grabOrReleaseBallOrCardStringProperty ),
      new CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard(
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardTitleStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.medianScreen.jumpToStartOfCardsOrNumberLineStringProperty,
        CenterAndVariabilityStrings.a11y.keyboardHelpDialog.medianScreen.jumpToEndOfCardsOrNumberLineStringProperty
      ),
      new MedianKeyboardHelpPredictMedianSection()
    ] );
  }
}

centerAndVariability.register( 'MedianKeyboardHelpNode', MedianKeyboardHelpNode );
