// Copyright 2023-2024, University of Colorado Boulder

/**
 * MeanIndicatorNode displays an upward-pointing triangle shape to represent the value of the mean.
 * The triangle's size can vary based on whether it is used as an icon or not,
 * and it can optionally have a stroke around it.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import SoccerCommonColors from '../../../../soccer-common/js/SoccerCommonColors.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';


export default class MeanIndicatorNode extends Path {

  public constructor( includeStroke: boolean, isIcon: boolean ) {

    const TRIANGLE_LENGTH = isIcon ? CAVConstants.CHECKBOX_ICON_DIMENSION - 8 : 15;
    const TRIANGLE_ALTITUDE = isIcon ? CAVConstants.CHECKBOX_ICON_DIMENSION - 11 : 13;

    // This is a triangle that points up.  Start at the top center tip.
    const TRIANGLE_SHAPE = new Shape().moveTo( 0, 0 )

      // Moving counterclockwise
      .lineTo( -TRIANGLE_LENGTH / 2, TRIANGLE_ALTITUDE )
      .lineToRelative( TRIANGLE_LENGTH, 0 )
      .close();

    super( TRIANGLE_SHAPE, {
      fill: CAVColors.meanColorProperty,
      stroke: includeStroke ? SoccerCommonColors.arrowStrokeProperty : null,
      lineWidth: 0.5,
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'MeanIndicatorNode', MeanIndicatorNode );