// Copyright 2022-2024, University of Colorado Boulder

/**
 * PredictionSlider is a visual indicator to show where the user predicts a value or boundary of an interval.
 * It consists of a shaded sphere and arrow pointing upwards.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, Node, NodeOptions, SceneryConstants } from '../../../../scenery/js/imports.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import centerAndVariability from '../../centerAndVariability.js';
import PredictionThumbNode, { PredictionThumbNodeOptions } from './PredictionThumbNode.js';

type SelfOptions = {

  // The options being passed into the PredictionThumbNode
  predictionThumbNodeOptions: PredictionThumbNodeOptions;

  // Round to the nearest specified number, or, if null, there is no rounding. Mean is continuous, median is rounded to 0.5
  roundToInterval: number | null;

  // Whether the PredictionSlider is currently being dragged by mouse/touch. Used to avoid conflicts between keyboard and mouse interactions.
  isMouseTouchDraggingProperty?: Property<boolean> | null;
};
type ParentOptions = AccessibleSliderOptions & NodeOptions;
export type PredictionSliderOptions = SelfOptions & WithRequired<ParentOptions, 'tandem'>;

export default class PredictionSlider extends AccessibleSlider( Node, 0 ) {

  protected readonly dragPositionProperty: Property<Vector2>;

  public constructor( predictionProperty: Property<number>,
                      modelViewTransform: ModelViewTransform2,
                      dragRange: Range,
                      providedOptions: PredictionSliderOptions ) {

    const thumbNode = new PredictionThumbNode( providedOptions.predictionThumbNodeOptions );

    const options = optionize<PredictionSliderOptions, SelfOptions, ParentOptions>()( {
      children: [ thumbNode ],
      cursor: 'pointer',

      keyboardStep: 0.5,
      shiftKeyboardStep: 0.1,
      pageKeyboardStep: 2,

      // Keyboard has a different rounding than mouse
      constrainValue: value => Utils.roundToInterval( value, 0.5 ),

      // Only for keyboard
      startDrag: () => {
        this.moveToFront();
      },
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,
      isMouseTouchDraggingProperty: null,

      isDisposable: false
    }, providedOptions );

    super( options );

    this.addLinkedElement( predictionProperty );

    // In view coordinates
    const dragPositionProperty = new Vector2Property( modelViewTransform.modelToViewXY( predictionProperty.value, 0 ) );

    dragPositionProperty.lazyLink( dragPosition => {
      const constrainedValue = dragRange.constrainValue( modelViewTransform.viewToModelX( dragPosition.x ) );
      predictionProperty.value = options.roundToInterval === null ?
                                 constrainedValue :
                                 Utils.roundToInterval( constrainedValue, options.roundToInterval );
    } );

    predictionProperty.link( prediction => {

      // The arrows appear completely under the labels of the number line node. The lines draw all the way up to the
      // top of the grass where the interval rectangle begins.
      const offsetY = options.predictionThumbNodeOptions.style === 'arrow' ? 40 : 0;
      this.centerTop = modelViewTransform.modelToViewXY( prediction, 0 ).plusXY( 0, offsetY );
    } );

    this.dragPositionProperty = dragPositionProperty;

    this.addInputListener( new DragListener( {
      tandem: options.tandem.createTandem( 'dragListener' ),
      positionProperty: this.dragPositionProperty,
      start: () => {
        if ( options.isMouseTouchDraggingProperty ) {
          options.isMouseTouchDraggingProperty.value = true;
        }
        this.moveToFront();
      },
      end: () => {
        if ( options.isMouseTouchDraggingProperty ) {
          options.isMouseTouchDraggingProperty.value = false;
        }
      }
    } ) );
  }
}

centerAndVariability.register( 'PredictionSlider', PredictionSlider );