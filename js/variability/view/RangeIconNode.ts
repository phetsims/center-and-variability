// Copyright 2023-2024, University of Colorado Boulder

/**
 * `RangeIconNode`: An icon for the range radio button. This icon can dynamically switch
 * between dot plot and line plot representations based on user preferences. It leverages
 * the `CAVToggleNode` for the visualization switch.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants from '../../common/CAVConstants.js';
import PlotType from '../../common/model/PlotType.js';
import CAVToggleNode from '../../common/view/CAVToggleNode.js';

/**
 * Icon for the range radio button. Dynamically changes between dot plot and line plot based on preferences.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class RangeIconNode extends Node {
  public constructor() {

    const outerRectangle = new Rectangle( 0, 0, 40, 40, {
      fill: 'white',
      cornerRadius: 4
    } );

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
        fill: CAVColors.rangeMarkerColorProperty,
        centerX: i * viewRadius * 2,
        centerY: 22 - j * viewRadius * 2
      };

      return new CAVToggleNode<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
        value: PlotType.DOT_PLOT,

        // Allow spacing
        createNode: () => new Circle( viewRadius * 0.93, options )
      }, {
        value: PlotType.LINE_PLOT,
        createNode: () => new Path( timesSolidShape, combineOptions<PathOptions>( {

          // Allow spacing between the items
          maxWidth: viewRadius * 2 * 0.9
        }, options ) )
      } ] );
    };

    const contentNode = new Node( {
      children: [

        // Main background rectangle
        rectangle,

        // Line at the bottom
        new Line( 0, rectangle.height, rectangle.width, rectangle.height, {
          stroke: 'black'
        } ),

        // Horizontal arrow at the top
        new ArrowNode( 0, 0, 22, 0, {
          doubleHead: true,
          fill: CAVColors.rangeMarkerColorProperty,
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
      ],
      center: outerRectangle.center,
      scale: 1.3
    } );

    super( {
      children: [
        outerRectangle,
        contentNode
      ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'RangeIconNode', RangeIconNode );