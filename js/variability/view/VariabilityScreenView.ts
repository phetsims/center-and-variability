// Copyright 2022-2023, University of Colorado Boulder

/**
 * VariabilityScreenView is the ScreenView for the 'Variability' screen, which has four different scenes with four different
 * distributions.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { AlignGroup, ManualConstraint } from '../../../../scenery/js/imports.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';
import VariabilityMeasureRadioButtonGroup from './VariabilityMeasureRadioButtonGroup.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import VariabilityAccordionBox from './VariabilityAccordionBox.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import CAVConstants from '../../common/CAVConstants.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import SoccerPlayer from '../../soccer-common/model/SoccerPlayer.js';
import { SoccerPlayerImageSet } from '../../soccer-common/view/SoccerPlayerNode.js';
import VariabilityInfoDialog from './VariabilityInfoDialog.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PredictionSlider, { PredictionSliderOptions } from '../../common/view/PredictionSlider.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import IntervalToolNode from './IntervalToolNode.js';
import ContinuousPropertySoundGenerator from '../../../../tambo/js/sound-generators/ContinuousPropertySoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';

// TODO: https://github.com/phetsims/center-and-variability/issues/307 should this be in common code? It was copied from GFL
import saturatedSineLoopTrimmed_wav from '../../../sounds/saturatedSineLoopTrimmed_wav.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import SoccerPlayerGroupNumbered from '../../soccer-common/view/SoccerPlayerGroupNumbered.js';

type SelfOptions = EmptySelfOptions;
type VariabilityScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class VariabilityScreenView extends CAVScreenView {
  private readonly continuousPropertySoundGenerator: ContinuousPropertySoundGenerator;

  public constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const options = optionize<VariabilityScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.variabilityQuestionStringProperty
      }
    }, providedOptions );

    const variabilityMeasureRadioButtonGroup = new VariabilityMeasureRadioButtonGroup( model.selectedVariabilityMeasureProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'variabilityMeasureRadioButtonGroup' )
    } );

    super( model, options );

    const predictionSliderOptions = {
      predictionThumbNodeOptions: {
        color: CAVColors.intervalToolIconShadedSphereMainColorProperty,
        style: 'line' as const
      },

      enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
      roundToInterval: null, // continuous
      visibleProperty: model.isIntervalToolVisibleProperty
    };

    const isIntervalHandle1BeingDraggedProperty = new BooleanProperty( false );
    const isIntervalHandle2BeingDraggedProperty = new BooleanProperty( false );
    const isIntervalAreaBeingDraggedProperty = new BooleanProperty( false );

    this.backScreenViewLayer.addChild( new PredictionSlider( model.intervalTool1ValueProperty, this.modelViewTransform, CAVConstants.VARIABILITY_DRAG_RANGE,
      isIntervalHandle1BeingDraggedProperty, new BooleanProperty( false ), combineOptions<PredictionSliderOptions>( {
        valueProperty: model.intervalTool1ValueProperty,
        tandem: options.tandem.createTandem( 'variabilityIntervalPredictionTool1ValueNode' )
      }, predictionSliderOptions ) ) );

    this.backScreenViewLayer.addChild( new PredictionSlider( model.intervalTool2ValueProperty, this.modelViewTransform, CAVConstants.VARIABILITY_DRAG_RANGE,
      isIntervalHandle2BeingDraggedProperty, new BooleanProperty( false ), combineOptions<PredictionSliderOptions>( {
        valueProperty: model.intervalTool2ValueProperty,
        tandem: options.tandem.createTandem( 'variabilityIntervalPredictionTool2ValueNode' )
      }, predictionSliderOptions ) ) );

    const variabilityAccordionBox = new VariabilityAccordionBox(
      model,
      this.layoutBounds,
      options.tandem.createTandem( 'accordionBox' ),
      this.questionBar.bottom + CAVConstants.ACCORDION_BOX_TOP_MARGIN,
      this.playAreaNumberLineNode
    );
    this.setAccordionBox( variabilityAccordionBox );

    ManualConstraint.create( this, [ variabilityMeasureRadioButtonGroup, this.accordionBox! ],
      ( variabilityRadioButtonGroupWrapper, accordionBoxWrapper ) => {
        variabilityRadioButtonGroupWrapper.top = accordionBoxWrapper.top + 8;
      } );

    const intervalToolNode = new IntervalToolNode( model.intervalTool1ValueProperty, model.intervalTool2ValueProperty, this.modelViewTransform,
      new DerivedProperty( [ variabilityAccordionBox.boundsProperty ], bounds => bounds.top ), isIntervalAreaBeingDraggedProperty, {
        visibleProperty: model.isIntervalToolVisibleProperty,
        tandem: options.tandem.createTandem( 'intervalToolNode' )
      } );
    this.intervalToolLayer.addChild( intervalToolNode );

    const intervalDistanceProperty = new DerivedProperty( [ model.intervalToolDeltaStableProperty ], interval => {
      return Utils.roundToInterval( Utils.linear( 0, 16, 2, 1, interval ), CAVQueryParameters.intervalToolSoundInterval );
    } );

    // the minimum distance that the interval must change before a sound is played (to prevent sound playing on tiny movements)
    const INTERVAL_WIDTH_CHANGE_THRESHOLD = 0.01;
    const INTERVAL_POSITION_CHANGE_THRESHOLD = 0.1;

    let lastIntervalWidthValue = intervalDistanceProperty.value;
    let lastIntervalTool1Value = model.intervalTool1ValueProperty.value;

    const intervalDistanceWithThresholdProperty = new NumberProperty( lastIntervalWidthValue );

    intervalDistanceProperty.link( newValue => {
      if ( Math.abs( newValue - lastIntervalWidthValue ) >= INTERVAL_WIDTH_CHANGE_THRESHOLD ) {
        intervalDistanceWithThresholdProperty.value = newValue;
        lastIntervalWidthValue = newValue;
      }
    } );

    // keeps track of the translation of the entire interval tool
    model.intervalTool1ValueProperty.link( newValue => {
      if ( Math.abs( newValue - lastIntervalTool1Value ) >= INTERVAL_POSITION_CHANGE_THRESHOLD ) {
        intervalDistanceWithThresholdProperty.notifyListenersStatic();
        lastIntervalTool1Value = newValue;
      }
    } );

    const biquadFilterNode = new BiquadFilterNode( phetAudioContext, {
      type: 'lowpass',
      frequency: 800,
      Q: 1.5
    } );

    isIntervalHandle1BeingDraggedProperty.lazyLink( value => {
      if ( value ) {
        biquadFilterNode.frequency.setTargetAtTime( 300, phetAudioContext.currentTime, 0 );
      }
    } );

    isIntervalHandle2BeingDraggedProperty.lazyLink( value => {
      if ( value ) {
        biquadFilterNode.frequency.setTargetAtTime( 1200, phetAudioContext.currentTime, 0 );
      }
    } );

    isIntervalAreaBeingDraggedProperty.lazyLink( value => {
      if ( value ) {
        biquadFilterNode.frequency.setTargetAtTime( 600, phetAudioContext.currentTime, 0 );
      }
    } );

    this.continuousPropertySoundGenerator = new ContinuousPropertySoundGenerator(
      intervalDistanceWithThresholdProperty,
      saturatedSineLoopTrimmed_wav,
      new Range( 1, 2 ), {
        initialOutputLevel: 0.3,
        playbackRateCenterOffset: 0,

        resetInProgressProperty: model.variabilityModelResetInProgressProperty,
        trimSilence: false, // a very precise sound file is used, so make sure it doesn't get changed
        fadeTime: 0,
        delayBeforeStop: 0.5,
        playbackRateSpanOctaves: 1.5,
        additionalAudioNodes: [
          biquadFilterNode
        ]
      }
    );
    soundManager.addSoundGenerator( this.continuousPropertySoundGenerator );

    const sceneRadioButtonGroup = new SceneRadioButtonGroup( model.variabilitySceneModels, model.selectedSceneModelProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'sceneRadioButtonGroup' )
    } );

    // Float above the ground
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, sceneRadioButtonGroup ],
      ( lowerNumberLineWrapper, sceneRadioButtonGroupWrapper ) => {
        sceneRadioButtonGroupWrapper.bottom = lowerNumberLineWrapper.top - 10;
      } );

    this.addChild( sceneRadioButtonGroup );
    this.addChild( variabilityMeasureRadioButtonGroup );

    const iconGroup = new AlignGroup();

    this.setBottomControls(
      new VerticalCheckboxGroup( [
        PlayAreaCheckboxFactory.getMedianCheckboxItem( iconGroup, model ),
        PlayAreaCheckboxFactory.getMeanCheckboxItem( iconGroup, model ),
        PlayAreaCheckboxFactory.getIntervalToolCheckboxItem( iconGroup, model )
      ], {
        tandem: this.tandem.createTandem( 'bottomCheckboxGroup' )
      } ), options.tandem );

    model.variabilitySceneModels.forEach( ( sceneModel, index ) => {

      // The VariabilityInfoDialog only exists in the VariabilityScreen, so having CAVScreenView be in charge of creating custom subclasses
      // of CAVSceneView is overcomplicated and unnecessary. Instead, we create an equivalent tandem, so that it will appear
      // under the appropriate sceneView in the studio tree.
      const infoDialog = new VariabilityInfoDialog( model, sceneModel, this.playAreaNumberLineNode, {
        tandem: options.tandem.createTandem1Indexed( CAVConstants.SCENE_VIEW_TANDEM, index ).createTandem( 'infoDialog' )
      } );

      Multilink.multilink( [ model.isInfoVisibleProperty, sceneModel.isVisibleProperty ],
        ( isInfoShowing, isVisible ) => {
          if ( isInfoShowing && isVisible ) {
            infoDialog.show();
          }
          else {
            infoDialog.hide();
          }
        } );
    } );
  }

  public override getSoccerPlayerImageSet( soccerPlayer: SoccerPlayer, sceneModel: CAVSoccerSceneModel ): SoccerPlayerImageSet {
    const index = this.model.sceneModels.indexOf( sceneModel );
    return SoccerPlayerGroupNumbered[ index ];
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.continuousPropertySoundGenerator.step( dt );
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );