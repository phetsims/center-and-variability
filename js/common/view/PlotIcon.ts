// Copyright 2023, University of Colorado Boulder

/**
 * PlotIcon is a graphical UI component that represents a mini-plot with customizable data points using
 * the provided shape. The icon consists of a background rectangle, a line at its bottom, and several
 * data points arranged in columns.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Line, Node, Path, PathOptions, Rectangle } from '../../../../scenery/js/imports.js';
import CAVColors from '../CAVColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Shape } from '../../../../kite/js/imports.js';

const RECTANGLE_DIMENSION = 28;

// Divide into 3 columns, and leave room for margins
const VIEW_DIAMETER = RECTANGLE_DIMENSION / 3 * 0.8;
export const VIEW_RADIUS = VIEW_DIAMETER / 2;

export default class PlotIcon extends Node {

  public constructor( dataPointShape: Shape ) {

    // Main background rectangle
    const rectangle = new Rectangle( 0, 0, RECTANGLE_DIMENSION, RECTANGLE_DIMENSION );

    // Create a data point at the given row, column
    const createDataPoint = ( i: number, j: number ) => {

      const options = {
        fill: CAVColors.radioButtonDataPointColorProperty,
        centerX: i * VIEW_RADIUS * 2,
        centerY: 22 - j * VIEW_RADIUS * 2
      };
      return new Path( dataPointShape, combineOptions<PathOptions>( {

        // Allow spacing between the items
        maxWidth: VIEW_RADIUS * 2 * 0.9
      }, options ) );
    };

    super( {
      children: [

        // Main background rectangle
        rectangle,

        // Line at the bottom
        new Line( 0, rectangle.height, rectangle.width, rectangle.height, {
          stroke: 'black'
        } ),

        // Data point layer
        new Node( {
          children: [
            createDataPoint( 0, 0 ),
            createDataPoint( 1, 0 ),
            createDataPoint( 1, 1 ),
            createDataPoint( 1, 2 ),
            createDataPoint( 2, 0 ),
            createDataPoint( 2, 1 )
          ],
          centerX: rectangle.centerX,
          bottom: rectangle.bottom - 1
        } )
      ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'PlotIcon', PlotIcon );