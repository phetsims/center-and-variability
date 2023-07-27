// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for all ScreenViews in the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../CAVConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { AlignBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import QuestionBar, { QuestionBarOptions } from '../../../../scenery-phet/js/QuestionBar.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BackgroundNode from './BackgroundNode.js';
import CAVAccordionBox from './CAVAccordionBox.js';
import PredictionSlider from './PredictionSlider.js';
import CAVColors from '../CAVColors.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVModel from '../model/CAVModel.js';
import SoccerSceneView from '../../soccer-common/view/SoccerSceneView.js';
import KickButtonGroup from './KickButtonGroup.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { KickerImageSet } from '../../soccer-common/view/KickerNode.js';
import Kicker from '../../soccer-common/model/Kicker.js';
import SoccerSceneModel from '../../soccer-common/model/SoccerSceneModel.js';
import DragIndicatorArrowNode from '../../soccer-common/view/DragIndicatorArrowNode.js';
import CAVObjectType from '../model/CAVObjectType.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import PlayAreaMedianIndicatorNode from './PlayAreaMedianIndicatorNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { SoccerBallPhase } from '../../soccer-common/model/SoccerBallPhase.js';
import cvEraserOptions001_mp3 from '../../../sounds/cvEraserOptions001_mp3.js';
import SoundClipPlayer from '../../../../tambo/js/sound-generators/SoundClipPlayer.js';
import SoccerCommonConstants from '../../soccer-common/SoccerCommonConstants.js';
import CAVSceneView from './CAVSceneView.js';
import CAVNumberLineNode from './CAVNumberLineNode.js';
import KickerGroupUnnumbered from '../../soccer-common/view/KickerGroupUnnumbered.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

type SelfOptions = {
  questionBarOptions: StrictOmit<QuestionBarOptions, 'tandem'>;
};

export type CAVScreenViewOptions = SelfOptions & ScreenViewOptions;

// constants
const GROUND_POSITION_Y = 515;
const INDICATOR_MARGIN = 4;

// There are 15 items in the KickerGroupUnnumbered, so we need 2x copies to cover 30 max kicks
const MULTI_GROUP = [ ...KickerGroupUnnumbered, ...KickerGroupUnnumbered ];

export default class CAVScreenView extends ScreenView {

  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly model: CAVModel;

  // Subclasses add to the backScreenViewLayer for correct z-ordering and correct tab navigation order
  // Soccer balls go behind the accordion box after they land
  protected readonly backScreenViewLayer;
  private readonly middleScreenViewLayer = new Node();
  private readonly frontScreenViewLayer;
  protected readonly screenViewRootNode = new Node();

  protected readonly intervalToolLayer = new Node();

  protected readonly eraserButton: EraserButton;

  protected accordionBox: CAVAccordionBox | null = null;

  protected readonly questionBar: QuestionBar;
  protected readonly playAreaNumberLineNode: NumberLineNode;
  private readonly sceneViews: SoccerSceneView[];

  private readonly updateMedianNode: () => void;
  private readonly updateDragIndicatorNode: () => void;
  protected readonly numberOfKicksProperty: DynamicProperty<number, number, CAVSoccerSceneModel>;
  protected readonly kickButtonGroup: KickButtonGroup;

  public constructor( model: CAVModel, providedOptions: CAVScreenViewOptions ) {
    const options = optionize<CAVScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    // View size of a soccer ball
    const objectHeight = 41;

    // The ground is at y=0
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( CAVConstants.PHYSICAL_RANGE.min, 0, CAVConstants.PHYSICAL_RANGE.max, 1 ),
      new Bounds2( CAVConstants.NUMBER_LINE_MARGIN_X, GROUND_POSITION_Y - objectHeight, CAVConstants.NUMBER_LINE_MARGIN_X + CAVConstants.CHART_VIEW_WIDTH, GROUND_POSITION_Y )
    );

    super( options );
    this.numberOfKicksProperty = new DynamicProperty<number, number, CAVSoccerSceneModel>( model.selectedSceneModelProperty, { derive: 'numberOfDataPointsProperty' } );


    this.modelViewTransform = modelViewTransform;
    this.model = model;

    this.playAreaNumberLineNode = new CAVNumberLineNode(
      new DynamicProperty( model.selectedSceneModelProperty, {
        derive: 'meanValueProperty'
      } ),
      modelViewTransform,
      model.isPlayAreaMeanVisibleProperty,
      new DynamicProperty( model.selectedSceneModelProperty, {
        derive: 'dataRangeProperty'
      } ),
      CAVConstants.CHART_VIEW_WIDTH,
      CAVConstants.PHYSICAL_RANGE, {
        includeXAxis: false,
        includeRangeOnXAxis: false,
        includeMeanStroke: true,
        x: CAVConstants.NUMBER_LINE_MARGIN_X,
        y: GROUND_POSITION_Y
      } );

    this.sceneViews = model.sceneModels.map( ( sceneModel, index ) => new CAVSceneView(
      model,
      sceneModel,
      ( kicker, sceneModel ) => this.getKickerImageSet( kicker, sceneModel ),
      modelViewTransform,
      CAVConstants.PHYSICAL_RANGE, {
        //The variability screen has multiple scenes, and we want to connect these to a specific kicker, while the first
        // two screens have multiple kickers in the same scene.
        tandem: model.sceneModels.length === 1 ?
                options.tandem.createTandem1Indexed( CAVConstants.SCENE_VIEW_TANDEM, index ) :
                options.tandem.createTandem( `sceneKicker${index + 1}View` )
      } ) );

    const backLayerToggleNode = new ToggleNode( model.selectedSceneModelProperty, this.sceneViews.map( sceneView => {
        return {
          value: sceneView.sceneModel,
          createNode: () => sceneView.backSceneViewLayer
        };
      }
    ), {
      alignChildren: ToggleNode.NONE
    } );

    const dragIndicatorArrowNode = new DragIndicatorArrowNode( {
      tandem: options.tandem.createTandem( 'dragIndicatorArrowNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    this.backScreenViewLayer = new Node( {
      children: [
        new BackgroundNode( GROUND_POSITION_Y, this.visibleBoundsProperty ),

        // median highlight appears in front of the ticks, so these need to be in the background.
        this.playAreaNumberLineNode,

        this.intervalToolLayer,
        backLayerToggleNode
      ]
    } );
    this.backScreenViewLayer.pdomOrder = [
      backLayerToggleNode
    ];

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      right: this.layoutBounds.maxX - CAVConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CAVConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.eraserButton = new EraserButton( {
      tandem: options.tandem.createTandem( 'eraserButton' ),
      listener: () => {

        // Interrupt dragging of existing objects
        this.interruptSubtreeInput();

        model.selectedSceneModelProperty.value.clearData();
      },
      iconWidth: 26,
      right: this.resetAllButton.left - CAVConstants.SCREEN_VIEW_X_MARGIN,
      centerY: this.resetAllButton.centerY,
      soundPlayer: new SoundClipPlayer( cvEraserOptions001_mp3, {
        soundClipOptions: { initialOutputLevel: 0.072 }
      } )
    } );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, combineOptions<QuestionBarOptions>( {
      barHeight: 50,
      tandem: options.tandem.createTandem( 'questionBar' ),
      textOptions: {
        font: new PhetFont( {
          weight: 'bold',
          size: '20px'
        } )
      }
    }, options.questionBarOptions ) );

    this.questionBar.visibleProperty.link( () => this.updateAccordionBoxPosition() );

    this.kickButtonGroup = new KickButtonGroup( model, {

      // Center under where the soccer player nodes will be. Since the KickerNode are positioned in the
      // SceneView, we can't use those node bounds to position the kick buttons, so this is a manually tuned magic number.
      centerX: modelViewTransform.modelToViewX( 0 ) - 63,

      // Center between the ground and the bottom of the layout bounds.  Adjust because of the asymmetries:
      // the soccer player foot falls beneath the ground, and the shading of the buttons.
      centerY: ( GROUND_POSITION_Y + this.layoutBounds.maxY ) / 2 + 2,
      tandem: options.tandem.createTandem( 'kickButtonGroup' )
    } );

    this.updateDragIndicatorNode = () => {
      const dragIndicatorVisible = model.dragIndicatorModel.isDragIndicatorVisibleProperty.value;
      const dragIndicatorValue = model.dragIndicatorModel.dragIndicatorValueProperty.value;

      dragIndicatorArrowNode.visible = dragIndicatorVisible;

      if ( dragIndicatorVisible && dragIndicatorValue ) {

        dragIndicatorArrowNode.center = new Vector2(
          modelViewTransform.modelToViewX( dragIndicatorValue ),
          this.getTopObjectPositionY( dragIndicatorValue ) + Math.abs( this.modelViewTransform.modelToViewDeltaY( CAVObjectType.SOCCER_BALL.radius ) )
        );

        // The arrow shouldn't overlap the accordion box
        if ( this.accordionBox ) {
          if ( dragIndicatorArrowNode.top < this.accordionBox.bottom + INDICATOR_MARGIN ) {
            dragIndicatorArrowNode.top = this.accordionBox.bottom + INDICATOR_MARGIN;
          }
        }
      }
    };

    dragIndicatorArrowNode.addLinkedElement( model.dragIndicatorModel.dragIndicatorValueProperty );

    model.dragIndicatorModel.isDragIndicatorVisibleProperty.link( this.updateDragIndicatorNode );
    model.dragIndicatorModel.dragIndicatorValueProperty.link( this.updateDragIndicatorNode );
    this.visibleBoundsProperty.link( this.updateDragIndicatorNode );
    this.model.selectedSceneModelProperty.link( this.updateDragIndicatorNode );
    this.model.sceneModels.forEach( sceneModel => {
      sceneModel.medianValueProperty.link( this.updateDragIndicatorNode );
      sceneModel.objectChangedEmitter.addListener( this.updateDragIndicatorNode );
    } );

    const playAreaMedianIndicatorNode = new PlayAreaMedianIndicatorNode();

    const frontLayerToggleNode = new ToggleNode( model.selectedSceneModelProperty, this.sceneViews.map( sceneView => {
        return {
          value: sceneView.sceneModel,
          createNode: () => sceneView.frontSceneViewLayer
        };
      }
    ), {
      alignChildren: ToggleNode.NONE
    } );

    this.frontScreenViewLayer = new Node( {
      children: [
        frontLayerToggleNode,
        this.eraserButton,
        this.resetAllButton,
        this.questionBar,
        this.kickButtonGroup,
        playAreaMedianIndicatorNode
      ]
    } );

    this.updateMedianNode = () => {
      const sceneModel = this.model.selectedSceneModelProperty.value;
      const medianValue = sceneModel.medianValueProperty.value;
      const visible = medianValue !== null && model.isPlayAreaMedianVisibleProperty.value;

      if ( visible ) {
        playAreaMedianIndicatorNode.centerX = modelViewTransform.modelToViewX( medianValue );
        playAreaMedianIndicatorNode.bottom = this.getTopObjectPositionY( medianValue );

        // The arrow shouldn't overlap the accordion box
        if ( this.accordionBox ) {
          if ( playAreaMedianIndicatorNode.top < this.accordionBox.bottom + INDICATOR_MARGIN ) {
            playAreaMedianIndicatorNode.top = this.accordionBox.bottom + INDICATOR_MARGIN;
          }
        }
      }
      playAreaMedianIndicatorNode.visible = visible;
    };
    this.model.selectedSceneModelProperty.link( this.updateMedianNode );
    this.model.sceneModels.forEach( sceneModel => {
      sceneModel.medianValueProperty.link( this.updateMedianNode );
      sceneModel.objectChangedEmitter.addListener( this.updateMedianNode );
    } );
    this.visibleBoundsProperty.link( this.updateMedianNode );
    model.isPlayAreaMedianVisibleProperty.link( this.updateMedianNode );

    this.middleScreenViewLayer.addChild( dragIndicatorArrowNode );

    // TODO: check for other this.addChild calls that should move into screenViewRootNode, see: https://github.com/phetsims/center-and-variability/issues/351, see 2 occurrences in VariabilityScreenView
    // Add to screenViewRootNode for alternativeInput
    this.screenViewRootNode.addChild( this.backScreenViewLayer );
    this.screenViewRootNode.addChild( this.middleScreenViewLayer );
    this.screenViewRootNode.addChild( this.frontScreenViewLayer );

    this.addChild( this.screenViewRootNode );
  }

  // calculate where the top object is at a given value
  private getTopObjectPositionY( value: number ): number {
    const sceneModel = this.model.selectedSceneModelProperty.value;
    const ballsAtLocation = sceneModel.soccerBalls.filter( soccerBall =>
      soccerBall.valueProperty.value === value && soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED );
    const modelHeight = ballsAtLocation.length * CAVObjectType.SOCCER_BALL.radius * 2 * ( 1 - SoccerCommonConstants.SOCCER_BALL_OVERLAP );
    const viewHeight = this.modelViewTransform.modelToViewDeltaY( modelHeight );
    return this.modelViewTransform.modelToViewY( 0 ) + viewHeight;
  }

  private updateAccordionBoxPosition(): void {
    if ( this.accordionBox ) {
      const top = this.questionBar.visible ? this.questionBar.bottom : this.questionBar.top;
      this.accordionBox.top = top + CAVConstants.ACCORDION_BOX_TOP_MARGIN;
    }
  }

  /**
   * Floating layout that keeps the ground near the ground, and accordion box near the question bar
   */
  public override layout( viewBounds: Bounds2 ): void {
    super.layout( viewBounds, {
      verticalAlign: 'bottom'
    } );

    this.accordionBox && this.updateAccordionBoxPosition();
  }

  /**
   * Called by subtype constructors to finish initialization. This will appear in the middle layer in z-ordering,
   * so that kicked soccer balls go in front, and landed soccer balls go behind.
   */
  protected setAccordionBox( accordionBox: CAVAccordionBox ): void {
    this.accordionBox = accordionBox;
    this.middleScreenViewLayer.addChild( this.accordionBox );
    this.updateAccordionBoxPosition();

    this.accordionBox.boundsProperty.link( this.updateMedianNode );
    this.accordionBox.boundsProperty.link( this.updateDragIndicatorNode );
  }

  protected setBottomControls( controlNode: Node, tandem: Tandem ): AlignBox {

    // TODO: only call once? or rename to addBottomControls, see: https://github.com/phetsims/center-and-variability/issues/351

    // In order to use the AlignBox we need to know the distance from the top of the screen, to the top of the grass.
    const BOTTOM_CHECKBOX_PANEL_LEFT_MARGIN = 30;
    const BOTTOM_CHECKBOX_PANEL_Y_MARGIN = this.layoutBounds.maxY - this.modelViewTransform.modelToViewY( 0 ) + 12.5;

    const controlsVBox = new VBox( {
      spacing: 15,
      align: 'left',
      children: [
        controlNode,
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.kicksPatternStringProperty,
          { value: this.numberOfKicksProperty }, {
            tandem: tandem.createTandem( 'kicksPatternStringProperty' )
          } ), {
          font: CAVConstants.MAIN_FONT,
          maxWidth: CAVConstants.CHECKBOX_TEXT_MAX_WIDTH + 50,
          tandem: tandem.createTandem( 'numberOfKicksText' ),
          phetioVisiblePropertyInstrumented: true
        } )
      ]
    } );

    const checkboxBounds = this.layoutBounds.withMinX(
      this.layoutBounds.minX + CAVConstants.NUMBER_LINE_MARGIN_X + CAVConstants.CHART_VIEW_WIDTH + BOTTOM_CHECKBOX_PANEL_LEFT_MARGIN );

    const bottomControls = new AlignBox( controlsVBox, {
      alignBounds: checkboxBounds,
      xAlign: 'left',
      yAlign: 'bottom',
      yMargin: BOTTOM_CHECKBOX_PANEL_Y_MARGIN
    } );

    this.screenViewRootNode.addChild( bottomControls );

    return bottomControls;
  }

  // Set the pdom order. Only the variability screen has sceneRadioButtons and variabilityMeasureRadioButtons
  protected cavSetPDOMOrder( bottomControls: Node, predictionTools: Node[], infoButton: Node, sceneKickerRadioButtonGroup?: Node, variabilityMeasureRadioButtonGroup?: Node ): void {
    this.screenViewRootNode.pdomOrder = [
      ...( sceneKickerRadioButtonGroup ? [ sceneKickerRadioButtonGroup ] : [] ),
      this.kickButtonGroup,
      this.backScreenViewLayer,
      bottomControls,
      ...predictionTools,
      this.intervalToolLayer,
      ...( variabilityMeasureRadioButtonGroup ? [ variabilityMeasureRadioButtonGroup ] : [] ),
      this.accordionBox,
      infoButton,
      this.eraserButton,
      this.resetAllButton
    ];
  }

  public getKickerImageSet( kicker: Kicker, sceneModel: SoccerSceneModel ): KickerImageSet {
    return MULTI_GROUP[ kicker.initialPlaceInLine ];
  }

  /**
   * The predictMedianNode is shared in the Median screen and MeanAndMedianScreen, so factored out here.
   */
  public static createPredictMedianNode( model: CAVModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ): PredictionSlider {
    return new PredictionSlider( model.predictMedianValueProperty, modelViewTransform, CAVConstants.PHYSICAL_RANGE, new BooleanProperty( false ), new BooleanProperty( false ), {
      predictionThumbNodeOptions: {
        color: CAVColors.medianColorProperty,
        style: 'arrow'
      },
      valueProperty: model.predictMedianValueProperty,
      enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
      roundToInterval: 0.5,

      // always step 0.5 even if holding shift (median is always integer or half-integer)
      shiftKeyboardStep: 0.5,
      visibleProperty: model.isPredictMedianVisibleProperty,
      tandem: tandem
    } );
  }
}

centerAndVariability.register( 'CAVScreenView', CAVScreenView );