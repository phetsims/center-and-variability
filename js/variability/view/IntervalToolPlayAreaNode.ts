// Copyright 2023, University of Colorado Boulder

import centerAndVariability from '../../centerAndVariability.js';
import { Rectangle, Node, Line, NodeOptions, DragListener } from '../../../../scenery/js/imports.js';
import CAVColors from '../../common/CAVColors.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';

type SelfOptions = EmptySelfOptions;
type InternalToolPlayAreaNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class IntervalToolPlayAreaNode extends Node {
  public constructor( intervalToolValue1Property: NumberProperty, intervalToolValue2Property: NumberProperty, modelViewTransform: ModelViewTransform2,
                      topAlignmentProperty: TReadOnlyProperty<number>, providedOptions: InternalToolPlayAreaNodeOptions ) {

    const rectangleNode = new Rectangle( 0, 0, 0, 400, {
      fill: CAVColors.intervalToolFillProperty,
      cursor: 'pointer'
    } );
    const leftEdge = new Line( 0, 0, 0, 400, {
      stroke: CAVColors.intervalToolStrokeProperty
    } );
    const rightEdge = new Line( 0, 0, 0, 400, {
      stroke: CAVColors.intervalToolStrokeProperty
    } );

    const options = optionize<InternalToolPlayAreaNodeOptions, SelfOptions, NodeOptions>()( {
      children: [
        rectangleNode,
        leftEdge,
        rightEdge
      ]
    }, providedOptions );

    super( options );

    Multilink.multilink( [ intervalToolValue1Property, intervalToolValue2Property, topAlignmentProperty ],
      ( value1, value2, topAlignment ) => {
        const viewX1 = modelViewTransform.modelToViewX( value1 );
        const viewX2 = modelViewTransform.modelToViewX( value2 );
        const rectBottom = modelViewTransform.modelToViewY( 0 );

        // offset the top of the rect down by one pixel so that it doesn't peek out behind the top of the AccordionBox
        const rectTop = topAlignment + 1;
        const rectHeight = rectBottom - rectTop;
        rectangleNode.setRect( Math.min( viewX1, viewX2 ), rectBottom - rectHeight, Math.abs( viewX2 - viewX1 ), rectHeight );
        leftEdge.setLine( viewX1, rectBottom, viewX1, rectTop );
        rightEdge.setLine( viewX2, rectBottom, viewX2, rectTop );
      } );

    // TODO: https://github.com/phetsims/center-and-variability/issues/194 support or exclude multi-touch
    const getDragBounds = () => {
      const dist = intervalToolValue2Property.value - intervalToolValue1Property.value;

      if ( dist > 0 ) {
        return new Bounds2(
          intervalToolValue1Property.range.min, 0,
          intervalToolValue1Property.range.max - dist, 0
        );
      }
      else {
        return new Bounds2(
          intervalToolValue1Property.range.min + Math.abs( dist ), 0,
          intervalToolValue1Property.range.max, 0
        );
      }
    };

    // The drag listener operates in 2D but our model value is 1D, so we just have an extent-less y bounds.
    const dragBoundsProperty = new Property( getDragBounds() );

    const updateDragBounds = () => {
      dragBoundsProperty.value = getDragBounds();
    };

    // The drag listener requires a Vector2 instead of a number, so we need to create a DynamicProperty to convert between the two
    const intervalToolValue1PositionProperty = new DynamicProperty( new Property( intervalToolValue1Property ), {
      bidirectional: true,
      map: function( value: number ) { return new Vector2( value, 0 );},
      inverseMap: function( value: Vector2 ) { return value.x; }
    } );

    // When the drag is powered by the DragListener, the distance between the two values is constant.
    let distanceBetweenToolValues: number | null = null;

    intervalToolValue1PositionProperty.link( ( value: Vector2 ) => {

      // If the change was triggered by the drag listener, then we want to keep the distance between the two values constant.
      if ( distanceBetweenToolValues !== null ) {

        // The dragBounds makes sure neither of these exceeds the bounds.
        intervalToolValue1Property.value = value.x;
        intervalToolValue2Property.value = value.x + distanceBetweenToolValues;
      }

      updateDragBounds();
    } );

    intervalToolValue1Property.link( updateDragBounds );
    intervalToolValue2Property.link( updateDragBounds );

    const dragListener = new DragListener( {
      dragBoundsProperty: dragBoundsProperty,
      useParentOffset: true,
      positionProperty: intervalToolValue1PositionProperty,
      transform: modelViewTransform,
      start: ( event, dragListener ) => {
        distanceBetweenToolValues = intervalToolValue2Property.value - intervalToolValue1Property.value;
      },
      end: ( event, dragListener ) => {
        distanceBetweenToolValues = null;
      },
      tandem: providedOptions.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );
  }
}

centerAndVariability.register( 'IntervalToolPlayAreaNode', IntervalToolPlayAreaNode );