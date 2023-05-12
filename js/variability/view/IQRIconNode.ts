// Copyright 2023, University of Colorado Boulder

import centerAndVariability from '../../centerAndVariability.js';
import { Line, Node, Rectangle } from '../../../../scenery/js/imports.js';

/**
 * Icon for the IQR radio button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class IQRIconNode extends Node {
  public constructor() {

    // Main background rectangle
    const rectangle = new Rectangle( 0, 0, 22, 22, {
      fill: '#e8b3a2'
    } );

    const options = {
      stroke: 'black',
      lineWidth: 1.3
    };

    // Foreground rectangle with null fill, black stroke and lineWidth 0.5
    const iqrRectangle = new Rectangle( 0, 0, 13, 6, {
      center: rectangle.center,
      ...options
    } );

    // Vertical line
    const verticalLine = new Line( iqrRectangle.centerX + 2, iqrRectangle.top, iqrRectangle.centerX + 2, iqrRectangle.bottom, options );

    // Short stub line on the left and right side
    const stubLineLeft = new Line( iqrRectangle.left, iqrRectangle.centerY, iqrRectangle.left - 4, iqrRectangle.centerY, options );
    const stubLineRight = new Line( iqrRectangle.right, iqrRectangle.centerY, iqrRectangle.right + 2, iqrRectangle.centerY, options );

    super( {
      children: [
        rectangle,
        iqrRectangle,
        verticalLine,
        stubLineLeft,
        stubLineRight
      ]
    } );
  }
}

centerAndVariability.register( 'IQRIconNode', IQRIconNode );
