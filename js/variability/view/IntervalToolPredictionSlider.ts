// Copyright 2023-2024, University of Colorado Boulder

/**
 * IntervalToolPredictionSlider represents the handle component of the Interval Tool. Each handle acts as a slider
 * that the user can move left or right across a number line in the play area. The functionality of this slider
 * includes both mouse/touch and keyboard interactions.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import centerAndVariability from '../../centerAndVariability.js';
import PredictionSlider, { PredictionSliderOptions } from '../../common/view/PredictionSlider.js';

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
      },
      isMouseTouchDraggingProperty: isMouseTouchDraggingProperty
    }, providedOptions );

    super( predictionProperty, modelViewTransform, dragRange, options );
  }
}

centerAndVariability.register( 'IntervalToolPredictionSlider', IntervalToolPredictionSlider );