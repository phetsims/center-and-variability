// Copyright 2023, University of Colorado Boulder

import centerAndVariability from '../../centerAndVariability.js';
import { Rectangle, Node, Line } from '../../../../scenery/js/imports.js';
import CAVColors from '../../common/CAVColors.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default class IntervalToolPlayAreaNode extends Node {
  public constructor( intervalToolValue1Property: NumberProperty, intervalToolValue2Property: NumberProperty, modelViewTransform: ModelViewTransform2,
                      topAlignmentBoundsProperty: TReadOnlyProperty<Bounds2> ) {

    const rectangleNode = new Rectangle( 0, 0, 0, 400, {
      fill: CAVColors.intervalToolFillProperty,
      stroke: CAVColors.intervalToolStrokeProperty,
      cursor: 'pointer'
    } );
    const leftEdge = new Line( 0, 0, 0, 400, {
      stroke: CAVColors.intervalToolStrokeProperty
    } );
    const rightEdge = new Line( 0, 0, 0, 400, {
      stroke: CAVColors.intervalToolStrokeProperty
    } );
    super( {
      children: [
        rectangleNode,
        leftEdge,
        rightEdge
      ]
    } );

    Multilink.multilink( [ intervalToolValue1Property, intervalToolValue2Property, topAlignmentBoundsProperty ], ( value1, value2, topAlignmentBounds ) => {
      const viewX1 = modelViewTransform.modelToViewX( value1 );
      const viewX2 = modelViewTransform.modelToViewX( value2 );
      const rectBottom = modelViewTransform.modelToViewY( 0 );
      const rectTop = topAlignmentBounds.top + 1;
      const rectHeight = rectBottom - rectTop;
      rectangleNode.setRect( Math.min( viewX1, viewX2 ), rectBottom - rectHeight, Math.abs( viewX2 - viewX1 ), rectHeight );

      leftEdge.setLine( viewX1, rectBottom, viewX1, rectTop );
      rightEdge.setLine( viewX2, rectBottom, viewX2, rectTop );
    } );
  }
}

centerAndVariability.register( 'IntervalToolPlayAreaNode', IntervalToolPlayAreaNode );