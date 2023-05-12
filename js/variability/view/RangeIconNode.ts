// Copyright 2023, University of Colorado Boulder

import centerAndVariability from '../../centerAndVariability.js';
import { Circle, Line, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import CAVColors from '../../common/CAVColors.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import CAVConstants from '../../common/CAVConstants.js';
import PlotType from '../../common/model/PlotType.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';

/**
 * Icon for the range radio button. Dynamically changes between dot plot and line plot based on preferences.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class RangeIconNode extends Node {
  public constructor() {

    // Main background rectangle
    const rectangle = new Rectangle( 0, 0, 22, 22, {
      fill: CAVColors.rangeFillProperty
    } );

    // Create a data point at the given row, column
    const toDataPoint = ( i: number, j: number ) => {

      // Divide into 3 columns, and leave room for marigns
      const viewDiameter = rectangle.width / 3 * 0.8;
      const viewRadius = viewDiameter / 2;

      const options = {
        fill: CAVColors.grayDataPointFill,
        centerX: i * viewRadius * 2,
        centerY: 22 - j * viewRadius * 2
      };

      return new ToggleNode<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
        value: PlotType.DOT_PLOT,

        // Allow spacing
        createNode: tandem => new Circle( viewRadius * 0.93, options )
      }, {
        value: PlotType.LINE_PLOT,
        createNode: tandem => new Path( timesSolidShape, {
          ...options,

          // Allow spacing between the items
          maxWidth: viewRadius * 2 * 0.9
        } )
      } ] );
    };

    super( {
      children: [

        // Main background rectangle
        rectangle,

        // Line at the bottom
        new Line( 0, rectangle.height, rectangle.width, rectangle.height, {
          stroke: CAVColors.grayDataPointFill
        } ),

        // Horizontal arrow at the top
        new ArrowNode( 0, 0, 22, 0, {
          doubleHead: true,
          fill: CAVColors.grayDataPointFill,
          stroke: null,
          headWidth: 5,
          headHeight: 5,
          tailWidth: 1.5,
          top: 0
        } ),

        // Data point layer
        new Node( {
          children: [
            toDataPoint( 0, 0 ),
            toDataPoint( 1, 0 ),
            toDataPoint( 1, 1 ),
            toDataPoint( 1, 2 ),
            toDataPoint( 2, 0 ),
            toDataPoint( 2, 1 )
          ],
          centerX: rectangle.centerX,
          bottom: rectangle.bottom - 1
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'RangeIconNode', RangeIconNode );