// Copyright 2023-2024, University of Colorado Boulder

/**
 * `IQRIconNode` provides a visual representation for the Interquartile Range (IQR) radio button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Line, Node, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';


export default class IQRIconNode extends Node {
  public constructor() {

    // Main background rectangle
    const rectangle = new Rectangle( 0, 0, 40, 40, {
      fill: '#ccf6f6', // the IQR color against the chart gray background, but opaque
      cornerRadius: 4
    } );

    const options = {
      stroke: 'black',
      lineWidth: 1.3
    };

    // Foreground rectangle with null fill, black stroke and lineWidth 0.5
    const iqrRectangle = new Rectangle( 0, 0, 18, 20, combineOptions<RectangleOptions>( {
      center: rectangle.center.plusXY( 2, 0 )
    }, options ) );

    // Vertical line
    const verticalLine = new Line( iqrRectangle.centerX + 2, iqrRectangle.top, iqrRectangle.centerX + 2, iqrRectangle.bottom, options );

    // Short stub line on the left and right side
    const stubLineLeft = new Line( iqrRectangle.left, iqrRectangle.centerY, iqrRectangle.left - 8, iqrRectangle.centerY, options );
    const stubLineRight = new Line( iqrRectangle.right, iqrRectangle.centerY, iqrRectangle.right + 3, iqrRectangle.centerY, options );

    super( {
      children: [
        rectangle,
        iqrRectangle,
        verticalLine,
        stubLineLeft,
        stubLineRight
      ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'IQRIconNode', IQRIconNode );
