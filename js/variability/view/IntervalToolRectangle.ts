// Copyright 2023, University of Colorado Boulder

/**
 * `IntervalToolRectangle` visualizes a draggable rectangular area in the play area, representing the
 * interval between two points on a number line. This rectangle serves as an interactive visualization,
 * allowing users to manipulate its position and visualize corresponding changes on the number line.
 *
 * @author Sam Reid (PhET Interactive Simulations);
 */

import centerAndVariability from '../../centerAndVariability.js';
import { DragListener, Line, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import CAVColors from '../../common/CAVColors.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = NodeOptions & AccessibleSliderOptions;
type IntervalToolNodeOptions = StrictOmit<SelfOptions & WithRequired<ParentOptions, 'tandem'>, 'enabledRangeProperty' | 'valueProperty'>;

export default class IntervalToolRectangle extends AccessibleSlider( Node, 0 ) {
  public constructor( intervalToolValue1Property: NumberProperty, intervalToolValue2Property: NumberProperty, modelViewTransform: ModelViewTransform2,
                      topAlignmentProperty: TReadOnlyProperty<number>, isBeingDraggedProperty: Property<boolean>, providedOptions: IntervalToolNodeOptions ) {

    const rectangleNode = new Rectangle( 0, 0, 0, 400, {
      fill: CAVColors.intervalToolFillProperty,
      cursor: 'pointer'
    } );

    const createEdge = () => new Line( 0, 0, 0, 400, {
      stroke: CAVColors.intervalToolStrokeProperty
    } );
    const leftEdge = createEdge();
    const rightEdge = createEdge();

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

    const dragRangeProperty = new DerivedProperty( [ dragBoundsProperty ], dragBounds => {
      return new Range( dragBounds.minX, dragBounds.maxX );
    } );

    let distanceBetweenTools = intervalToolValue2Property.value - intervalToolValue1Property.value;

    const startDrag = () => {
      isBeingDraggedProperty.value = true;
      distanceBetweenTools = intervalToolValue2Property.value - intervalToolValue1Property.value;
    };
    const endDrag = () => {
      isBeingDraggedProperty.value = false;
    };

    const options = optionize<IntervalToolNodeOptions, SelfOptions, ParentOptions>()( {
      children: [
        rectangleNode,
        leftEdge,
        rightEdge
      ],
      enabledRangeProperty: dragRangeProperty,
      valueProperty: intervalToolValue1Property,
      startDrag: startDrag,
      endDrag: endDrag,
      phetioEnabledPropertyInstrumented: true,
      isDisposable: false,

      // This tool is very large and panning in all directions so that the viewport follows the center of the Node
      // means that important content is shifted off screen. Instead, we only pan horizontally as this Node moves.
      // See https://github.com/phetsims/center-and-variability/issues/564
      focusPanDirection: 'horizontal'
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

    const updateDragBounds = () => {
      dragBoundsProperty.value = getDragBounds();
    };

    this.enabledProperty.link( enabled => {
      rectangleNode.cursor = enabled ? 'pointer' : null;
    } );

    // The drag listener requires a Vector2 instead of a number, so we need to create a DynamicProperty to convert between the two
    const intervalToolValue1PositionProperty = new DynamicProperty( new Property( intervalToolValue1Property ), {
      bidirectional: true,
      map: function( value: number ) { return new Vector2( value, 0 );},
      inverseMap: function( value: Vector2 ) { return value.x; }
    } );

    const shouldDistanceBeRecalculated = ( value: number ) => value < 0 && value > 16;
    intervalToolValue1PositionProperty.link( ( value: Vector2 ) => {

      // If the change was triggered by the drag listener, then we want to keep the distance between the two values constant.
      if ( isBeingDraggedProperty.value ) {
        distanceBetweenTools = shouldDistanceBeRecalculated( value.x + distanceBetweenTools ) ? intervalToolValue2Property.value - intervalToolValue1Property.value : distanceBetweenTools;
        const value2 = value.x + distanceBetweenTools;
        assert && assert( value2 > -0.001 && value2 < 16.001,
          `The intervalToolValue2Property is outside of its range: ${value2}. Calculation that got us here is: (value2) ${intervalToolValue2Property.value} - (value1) ${intervalToolValue1Property.value} = (distanceBetweenValues) ${distanceBetweenTools}, The x value of intervalTool handle 1: ${value}` );

        // The dragBounds makes sure neither of these exceeds the bounds.
        intervalToolValue1Property.value = intervalToolValue1Property.range.constrainValue( value.x );
        intervalToolValue2Property.value = intervalToolValue2Property.range.constrainValue( value2 );
      }

      updateDragBounds();
    } );

    intervalToolValue1Property.link( updateDragBounds );
    intervalToolValue2Property.link( updateDragBounds );

    // This drag listener is for translating the entire interval tool
    const dragListener = new DragListener( {
      enabledProperty: this.enabledProperty,
      dragBoundsProperty: dragBoundsProperty,
      useParentOffset: true,
      positionProperty: intervalToolValue1PositionProperty,
      transform: modelViewTransform,
      start: startDrag,
      end: endDrag,
      tandem: providedOptions.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );
  }
}

centerAndVariability.register( 'IntervalToolRectangle', IntervalToolRectangle );