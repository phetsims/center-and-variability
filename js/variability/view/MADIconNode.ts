// Copyright 2023-2024, University of Colorado Boulder

import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Line, Node, Rectangle } from '../../../../scenery/js/imports.js';
/**
 * `MADIconNode` represents the icon for the MAD radio button. This icon displays a vertical line at the center
 * of a purple background rectangle, accompanied by horizontal double-headed arrows on both sides.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
import centerAndVariability from '../../centerAndVariability.js';

export default class MADIconNode extends Node {
  public constructor() {

    // Main background rectangle
    const rectangle = new Rectangle( 0, 0, 40, 40, {
      fill: '#bb89ec',
      cornerRadius: 4
    } );

    // Vertical line
    const verticalLine = new Line( rectangle.centerX, rectangle.top + 4, rectangle.centerX, rectangle.bottom - 4, {
      stroke: 'black',
      lineWidth: 1
    } );

    // Horizontal double-headed arrows on the left and right side
    const arrowOptions = {
      doubleHead: true,
      fill: 'black',
      stroke: null,
      headWidth: 5,
      headHeight: 5,
      tailWidth: 1.2,
      centerY: rectangle.centerY
    };
    const arrowLeft = new ArrowNode( rectangle.centerX, 0, rectangle.centerX - rectangle.width / 2 * 0.92, 0, arrowOptions );
    const arrowRight = new ArrowNode( rectangle.centerX, 0, rectangle.centerX + rectangle.width / 2 * 0.92, 0, arrowOptions );

    super( {
      children: [
        rectangle,
        verticalLine,
        arrowLeft,
        arrowRight
      ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'MADIconNode', MADIconNode );