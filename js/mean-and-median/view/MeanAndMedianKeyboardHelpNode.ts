// Copyright 2022-2023, University of Colorado Boulder

/**
 * The keyboard help content for the Quadrilateral sim. This has yet to be designed and is just ready for more content.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVKeyboardHelpNode from '../../common/view/CAVKeyboardHelpNode.js';
import CAVKeyboardHelpSectionGrabOrRelease from '../../common/view/CAVKeyboardHelpSectionGrabOrRelease.js';
import CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard from '../../common/view/CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard.js';
import MeanAndMedianKeyboardHelpPredictSection from './MeanAndMedianKeyboardHelpPredictSection.js';

export default class MeanAndMedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    super( [
      new CAVKeyboardHelpSectionGrabOrRelease( 'Grab or Release Ball' ),
      new CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard( 'Move Grabbed Ball', 'Move grabbed ball', 'Jump to start of number line', 'Jump to end of number line' ),
      new MeanAndMedianKeyboardHelpPredictSection()
    ] );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpNode', MeanAndMedianKeyboardHelpNode );
