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

export default class MedianKeyboardHelpNode extends CAVKeyboardHelpNode {

  public constructor() {
    const shapeShortcutsHelpSection = new CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard();
    super( [ new CAVKeyboardHelpSectionGrabOrRelease( 'Grab or Release Ball or Card' ), shapeShortcutsHelpSection ] );
  }
}

centerAndVariability.register( 'MedianKeyboardHelpNode', MedianKeyboardHelpNode );
