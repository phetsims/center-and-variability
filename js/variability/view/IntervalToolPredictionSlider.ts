// Copyright 2023, University of Colorado Boulder
/**
 * The handle for the Interval Tool. These act as sliders and move left or right across
 * the play area number line.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 *
 */

import PredictionSlider, { PredictionSliderOptions } from '../../common/view/PredictionSlider.js';
import centerAndVariability from '../../centerAndVariability.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type IntervalToolPredictionSliderOptions = PredictionSliderOptions;

export default class IntervalToolPredictionSlider extends PredictionSlider {

  public constructor(
    predictionProperty: Property<number>,
    modelViewTransform: ModelViewTransform2,
    dragRange: Range,

    // Tracks whether a slider handle is being dragged through mouse input. This allows us to control
    // input enabling between the two different handles on the interval tool to disable multitouch appropriately.
    public readonly isMouseTouchDraggingProperty: Property<boolean>,

    // Tracks whether a slider handle is being dragged through keyboard input. This allows us to control
    // input enabling between the two different handles on the interval tool to disable multitouch appropriately.
    public readonly isKeyboardDraggingProperty: Property<boolean>,
    providedOptions: IntervalToolPredictionSliderOptions
  ) {

    const options = optionize<IntervalToolPredictionSliderOptions, EmptySelfOptions, PredictionSliderOptions>()( {

      // Only for keyboard
      startDrag: () => {
        isKeyboardDraggingProperty.value = true;
        this.moveToFront();
      },
      endDrag: () => {
        isKeyboardDraggingProperty.value = false;
      }
    }, providedOptions );


    super( predictionProperty, modelViewTransform, dragRange, options );
  }

  // TODO: we wanted to call this in the constructor, but ran into various roadblocks... see: https://github.com/phetsims/center-and-variability/issues/225;
  public override addDragListener( tandem: Tandem ): void {
    this.addInputListener( new DragListener( {
      tandem: tandem.createTandem( 'dragListener' ),
      positionProperty: this.dragPositionProperty,
      start: () => {
        this.isMouseTouchDraggingProperty.value = true;
        this.moveToFront();
      },
      end: () => {
        this.isMouseTouchDraggingProperty.value = false;
      }
    } ) );
  }
}

centerAndVariability.register( 'IntervalToolPredictionSlider', IntervalToolPredictionSlider );