// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows a shaded sphere and arrow pointing up, to show where the user predicts a median value.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { DragListener, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import PredictionThumbNode, { PredictionThumbNodeOptions } from './PredictionThumbNode.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = {
  predictionThumbNodeOptions: PredictionThumbNodeOptions;

  // Round to the nearest specified number, or, if null, there is no rounding. Mean is continuous, median is rounded to 0.5
  roundToInterval: number | null;
};
type ParentOptions = AccessibleSliderOptions & NodeOptions;
export type PredictionSliderOptions = SelfOptions & WithRequired<ParentOptions, 'tandem'>;

export default class PredictionSlider extends AccessibleSlider( Node, 0 ) {

  public constructor( predictionProperty: Property<number>, modelViewTransform: ModelViewTransform2, dragRange: Range,
                      isMouseTouchDragging: Property<boolean>, isKeyboardDragging: Property<boolean>, providedOptions: PredictionSliderOptions ) {

    const thumbNode = new PredictionThumbNode( providedOptions.predictionThumbNodeOptions );

    const options = optionize<PredictionSliderOptions, SelfOptions, ParentOptions>()( {
      children: [ thumbNode ],
      cursor: 'pointer',

      keyboardStep: 0.5,
      shiftKeyboardStep: 0.1,
      pageKeyboardStep: 1,

      // Keyboard has a different rounding than mouse
      constrainValue: value => Utils.roundToInterval( value, 0.5 ),

      // Only for keyboard
      startDrag: () => {
        isKeyboardDragging.value = true;
      },
      endDrag: () => {
        isKeyboardDragging.value = false;
      }
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
      const offsetY = options.predictionThumbNodeOptions.style === 'arrow' ? 42 : 0;
      this.centerTop = modelViewTransform.modelToViewXY( prediction, 0 ).plusXY( 0, offsetY );
    } );

    this.addInputListener( new DragListener( {
      tandem: options.tandem.createTandem( 'dragListener' ),
      positionProperty: dragPositionProperty,
      start: () => {
        isMouseTouchDragging.value = true;
        this.moveToFront();
      },
      end: () => {
        isMouseTouchDragging.value = false;
      }
    } ) );
  }
}

centerAndVariability.register( 'PredictionSlider', PredictionSlider );