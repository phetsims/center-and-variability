// Copyright 2023-2024, University of Colorado Boulder

/**
 * IntervalToolNode is a graphical node that enables users to highlight a range of values on the soccer field as well
 * as in the accordion box. It contains an IntervalToolRectangle as well as two IntervalToolPredictionSliders.
 * The IntervalToolNode can be used to make variability estimations, and as a pedagogical tool to
 * highlight data or make predictions. It also provides auditory feedback through sound effects,
 * which change based on user interactions with the sliders and overall interval tool movement.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Node } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import IntervalToolPredictionSlider from './IntervalToolPredictionSlider.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVConstants from '../../common/CAVConstants.js';
import IntervalToolModel from '../model/IntervalToolModel.js';
import CAVColors from '../../common/CAVColors.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import IntervalToolRectangle from './IntervalToolRectangle.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import ContinuousPropertySoundClip from '../../../../tambo/js/sound-generators/ContinuousPropertySoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import intervalToolLoop_wav from '../../../sounds/intervalToolLoop_wav.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';


export default class IntervalToolNode extends Node {

  public readonly rectangle: IntervalToolRectangle;

  private readonly continuousPropertySoundClip: ContinuousPropertySoundClip;

  public constructor( model: IntervalToolModel, modelViewTransform: ModelViewTransform2, accordionBoxTopProperty: TReadOnlyProperty<number>, tandem: Tandem ) {
    const handle1 = new IntervalToolPredictionSlider( model.handle1ValueProperty,
      modelViewTransform, CAVConstants.VARIABILITY_DRAG_RANGE, model.isHandle1BeingMouseDraggedProperty, model.isHandle1BeingKeyboardDraggedProperty,
      {
        valueProperty: model.handle1ValueProperty,
        predictionThumbNodeOptions: {
          color: CAVColors.intervalToolIconShadedSphereMainColorProperty,
          style: 'line' as const
        },
        enabledRangeProperty: new Property<Range>( CAVConstants.VARIABILITY_DRAG_RANGE ),
        roundToInterval: null, // continuous

        tandem: tandem.createTandem( 'handle1' ),
        phetioVisiblePropertyInstrumented: true,
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      } );

    const handle2 = new IntervalToolPredictionSlider( model.handle2ValueProperty,
      modelViewTransform, CAVConstants.VARIABILITY_DRAG_RANGE, model.isHandle2BeingMouseDraggedProperty, model.isHandle2BeingKeyboardDraggedProperty,
      {
        valueProperty: model.handle2ValueProperty,
        predictionThumbNodeOptions: {
          color: CAVColors.intervalToolIconShadedSphereMainColorProperty,
          style: 'line' as const
        },
        enabledRangeProperty: new Property<Range>( CAVConstants.VARIABILITY_DRAG_RANGE ),
        roundToInterval: null, // continuous

        tandem: tandem.createTandem( 'handle2' ),
        phetioVisiblePropertyInstrumented: true,
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      } );

    const rectangle = new IntervalToolRectangle( model.handle1ValueProperty, model.handle2ValueProperty,
      modelViewTransform, accordionBoxTopProperty, model.isBeingTranslatedProperty, {
        inputEnabledProperty: model.isRectangleInputEnabledProperty,
        phetioEnabledPropertyInstrumented: false,
        tandem: tandem.createTandem( 'rectangle' ),
        phetioVisiblePropertyInstrumented: false
      } );

    super( {
      children: [ handle1, handle2, rectangle ],
      visibleProperty: model.isVisibleProperty
    } );

    // Prevent multitouch on the handles when the tool is being translated, see https://github.com/phetsims/center-and-variability/issues/225
    model.isBeingTranslatedProperty.link( isBeingTranslated => {
      handle1.inputEnabled = !isBeingTranslated;
      handle2.inputEnabled = !isBeingTranslated;
    } );

    const intervalDistanceProperty = new DerivedProperty( [ model.deltaStableProperty ], delta => {
      return Utils.linear( 0, 16, 2, 1, delta );
    } );

    // the minimum distance that the interval must change before a sound is played (to prevent sound playing on tiny movements)
    const INTERVAL_WIDTH_CHANGE_THRESHOLD = 0.005;
    const INTERVAL_POSITION_CHANGE_THRESHOLD = 0.05;

    let lastIntervalWidthValue = intervalDistanceProperty.value;
    let lastHandle1Value = model.handle1ValueProperty.value;

    const intervalDistanceWithThresholdProperty = new NumberProperty( lastIntervalWidthValue );

    intervalDistanceProperty.link( newValue => {
      if ( Math.abs( newValue - lastIntervalWidthValue ) >= INTERVAL_WIDTH_CHANGE_THRESHOLD ) {
        intervalDistanceWithThresholdProperty.value = newValue;
        lastIntervalWidthValue = newValue;
      }
    } );

    // keeps track of the translation of the entire interval tool
    model.handle1ValueProperty.link( newValue => {
      if ( Math.abs( newValue - lastHandle1Value ) >= INTERVAL_POSITION_CHANGE_THRESHOLD ) {
        intervalDistanceWithThresholdProperty.notifyListenersStatic();
        lastHandle1Value = newValue;
      }
    } );


    const biquadFilterNode = new BiquadFilterNode( phetAudioContext, {
      type: 'lowpass',
      frequency: 800,
      Q: 1.5
    } );

    model.isHandle1BeingMouseDraggedProperty.lazyLink( value => {
      if ( value ) {
        biquadFilterNode.frequency.setTargetAtTime( 300, phetAudioContext.currentTime, 0 );
      }
    } );

    model.isHandle2BeingMouseDraggedProperty.lazyLink( value => {
      if ( value ) {
        biquadFilterNode.frequency.setTargetAtTime( 1200, phetAudioContext.currentTime, 0 );
      }
    } );

    model.isBeingTranslatedProperty.lazyLink( value => {
      if ( value ) {
        biquadFilterNode.frequency.setTargetAtTime( 600, phetAudioContext.currentTime, 0 );
      }
    } );

    this.continuousPropertySoundClip = new ContinuousPropertySoundClip(
      intervalDistanceWithThresholdProperty,
      new Range( 1, 2 ),
      intervalToolLoop_wav, {
        initialOutputLevel: 0.25,
        enableControlProperties: [ DerivedProperty.not( ResetAllButton.isResettingAllProperty ) ],
        trimSilence: false, // a very precise sound file is used, so make sure it doesn't get changed
        fadeTime: 0.3,
        delayBeforeStop: 0.25,
        playbackRateRange: new Range( 0.6, 1.7 ), // about 1.5 octaves
        stopOnDisabled: true,
        additionalAudioNodes: [
          biquadFilterNode
        ]
      }
    );

    soundManager.addSoundGenerator( this.continuousPropertySoundClip, { associatedViewNode: this } );

    this.rectangle = rectangle;

    this.pdomOrder = [ handle1, handle2, rectangle ];
  }

  public step( dt: number ): void {
    this.continuousPropertySoundClip.step( dt );
  }
}

centerAndVariability.register( 'IntervalToolNode', IntervalToolNode );