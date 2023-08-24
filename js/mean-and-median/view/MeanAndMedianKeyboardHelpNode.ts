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

export default class MeanAndMedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    const shapeShortcutsHelpSection = new CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard( 'Move Grabbed Ball', 'Move grabbed ball' );
    super( [ new CAVKeyboardHelpSectionGrabOrRelease( 'Grab or Release Ball' ), shapeShortcutsHelpSection ] );
  }
}

centerAndVariability.register( 'MeanAndMedianKeyboardHelpNode', MeanAndMedianKeyboardHelpNode );
