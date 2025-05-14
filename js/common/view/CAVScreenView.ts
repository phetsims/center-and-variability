// Copyright 2022-2025, University of Colorado Boulder

/**
 * CAVScreenView serves as the primary base class for all ScreenViews within the simulation. It's designed to integrate
 * various components, including the play area, kicker images, and associated interactions. It also handles user interface
 * elements such as the eraser button, kick button group, and question bar. It works in conjunction with model data and
 * orchestrates the visual representation and interaction for the Center and Variability simulation's screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import QuestionBar, { QuestionBarOptions } from '../../../../scenery-phet/js/QuestionBar.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import SoccerCommonConstants from '../../../../soccer-common/js/SoccerCommonConstants.js';
import BackgroundNode from '../../../../soccer-common/js/view/BackgroundNode.js';
import KickerImageSets from '../../../../soccer-common/js/view/KickerImageSets.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import SoccerSceneView from '../../../../soccer-common/js/view/SoccerSceneView.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../../../soccer-common/js/view/SoccerScreenView.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import VariabilityKickerImageSets from '../../variability/view/VariabilityKickerImageSets.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';
import CAVModel from '../model/CAVModel.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import CAVAccordionBox from './CAVAccordionBox.js';
import CAVNumberLineNode from './CAVNumberLineNode.js';
import CAVSceneView from './CAVSceneView.js';
import CAVToggleNode from './CAVToggleNode.js';
import KickButtonGroup from './KickButtonGroup.js';
import PlayAreaMedianIndicatorNode from './PlayAreaMedianIndicatorNode.js';
import PredictionSlider from './PredictionSlider.js';

type SelfOptions = {
  questionBarOptions: StrictOmit<QuestionBarOptions, 'tandem'>;
};

export type CAVScreenViewOptions = SelfOptions & StrictOmit<SoccerScreenViewOptions, 'physicalRange' | 'chartViewWidth' | 'numberLineXMargin'>;

// constants
const GROUND_POSITION_Y = 515;
const INDICATOR_MARGIN = 4;

export default class CAVScreenView extends SoccerScreenView<CAVSoccerSceneModel, CAVModel> {

  // Subclasses add to the backScreenViewLayer for correct z-ordering and correct tab navigation order
  // Soccer balls go behind the accordion box after they land
  protected readonly backScreenViewLayer;
  private readonly middleScreenViewLayer = new Node();
  protected readonly frontScreenViewLayer;
  protected readonly screenViewRootNode = new Node();

  protected readonly intervalToolLayer = new Node();

  protected readonly eraserButton: EraserButton;

  // The accordion box in the top portion of the screen. Initializes as null and is set by setAccordionBox.
  protected accordionBox: CAVAccordionBox | null = null;

  protected override readonly playAreaNumberLineNode: NumberLineNode;
  private readonly sceneViews: SoccerSceneView[];

  private readonly updateMedianNode: () => void;

  protected readonly kickButtonGroup: KickButtonGroup;

  protected readonly soccerAreaTandem: Tandem;

  // These Nodes are created here but added in the subclasses, since the subclass specifies how and where (what layer)
  // they are added.
  protected readonly questionBar: QuestionBar;
  protected readonly resetAllButton: ResetAllButton;

  private readonly repositionNodeIfOverlappingAccordionBox: ( node: Node ) => void;
  private readonly adjustMedianIndicatorBottom: ( topObjectPositionY: number ) => void;
  private readonly playAreaMedianIndicatorNode: Node;

  protected constructor( model: CAVModel, providedOptions: CAVScreenViewOptions ) {

    const options = optionize<CAVScreenViewOptions, SelfOptions, SoccerScreenViewOptions>()( {
      physicalRange: CAVConstants.PHYSICAL_RANGE,
      chartViewWidth: CAVConstants.CHART_VIEW_WIDTH,
      numberLineXMargin: CAVConstants.NUMBER_LINE_MARGIN_X
    }, providedOptions );

    super( model, options );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      right: this.layoutBounds.maxX - SoccerCommonConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - SoccerCommonConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, combineOptions<QuestionBarOptions>( {
      barHeight: 50,
      tandem: options.tandem.createTandem( 'questionBar' ),
      textOptions: {
        font: new PhetFont( {
          weight: 'bold',
          size: '20px'
        } )
      },
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, options.questionBarOptions ) );

    this.soccerAreaTandem = options.tandem.createTandem( 'soccerArea' );

    this.playAreaNumberLineNode = new CAVNumberLineNode(
      new DynamicProperty( model.selectedSceneModelProperty, {
        derive: 'meanValueProperty'
      } ),
      this.modelViewTransform,
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
      this.keyboardSortCueNode,
      this.modelViewTransform,
      CAVConstants.PHYSICAL_RANGE,

      // The variability screen has multiple scenes, and we want to connect these to a specific kicker, while the first
      // two screens have multiple kickers in the same scene.
      model.sceneModels.length === 1 ?
      KickerImageSets :
        [ VariabilityKickerImageSets[ index ] ],
      model.sceneModels.length === 1 ?
      options.tandem.createTandem1Indexed( CAVConstants.SCENE_VIEW_TANDEM, index ) :
      options.tandem.createTandem( `sceneKicker${index + 1}View` )
    ) );

    const backLayerToggleNode = new CAVToggleNode( model.selectedSceneModelProperty, this.sceneViews.map( sceneView => {
        return {
          value: sceneView.sceneModel,
          createNode: () => sceneView.backSceneViewLayer
        };
      }
    ), {
      alignChildren: ToggleNode.NONE
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

    this.eraserButton = new EraserButton( {
      tandem: options.tandem.createTandem( 'eraserButton' ),
      listener: () => {

        // Interrupt dragging of existing objects
        this.interruptSubtreeInput();

        model.clearData();
      },
      iconWidth: 26,
      right: this.resetAllButton.left - SoccerCommonConstants.SCREEN_VIEW_X_MARGIN,
      centerY: this.resetAllButton.centerY,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    } );

    this.questionBar.visibleProperty.link( () => this.updateAccordionBoxPosition() );

    this.kickButtonGroup = new KickButtonGroup( model.selectedSceneModelProperty, {

      // Center under where the soccer player nodes will be. Since the KickerNode are positioned in the
      // SceneView, we can't use those node bounds to position the kick buttons, so this is a manually tuned magic number.
      centerX: this.modelViewTransform.modelToViewX( 0 ) - 63,

      // Center between the ground and the bottom of the layout bounds.  Adjust because of the asymmetries:
      // the soccer player foot falls beneath the ground, and the shading of the buttons.
      centerY: ( GROUND_POSITION_Y + this.layoutBounds.maxY ) / 2 + 2,
      tandem: this.soccerAreaTandem.createTandem( 'kickButtonGroup' ),

      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // Utility function to prevent nodes from overlapping with the accordion box
    this.repositionNodeIfOverlappingAccordionBox = ( node: Node ) => {
      if ( this.accordionBox ) {
        if ( node.top < this.accordionBox.bottom + INDICATOR_MARGIN ) {
          node.top = this.accordionBox.bottom + INDICATOR_MARGIN;
        }
      }
    };

    // When cueing arrows are visible the bottom of the MedianIndicator may need to adjust.
    this.adjustMedianIndicatorBottom = ( topObjectPositionY: number ) => {
      this.playAreaMedianIndicatorNode.bottom = topObjectPositionY - 15;
    };

    this.playAreaMedianIndicatorNode = new PlayAreaMedianIndicatorNode();

    const frontLayerToggleNode = new CAVToggleNode( model.selectedSceneModelProperty, this.sceneViews.map( sceneView => {
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
        this.playAreaMedianIndicatorNode
      ]
    } );

    this.updateMedianNode = () => {
      const sceneModel = this.model.selectedSceneModelProperty.value;
      const medianValue = sceneModel.medianValueProperty.value;
      const visible = medianValue !== null && model.isPlayAreaMedianVisibleProperty.value;

      if ( visible ) {
        const topObjectPositionY = this.getTopObjectPositionY( medianValue );

        this.playAreaMedianIndicatorNode.centerX = this.modelViewTransform.modelToViewX( medianValue );
        this.playAreaMedianIndicatorNode.bottom = topObjectPositionY;

        // If cueing indicators are visible and their stack matches the median stack, adjustments needs to be made.
        if ( medianValue === model.groupSortInteractionModel.selectedGroupItemProperty.value?.valueProperty.value &&
             model.groupSortInteractionModel.mouseSortCueVisibleProperty.value ) {
          this.adjustMedianIndicatorBottom( topObjectPositionY );

        }
        if ( medianValue === model.groupSortInteractionModel.selectedGroupItemProperty.value?.valueProperty.value &&
             ( model.groupSortInteractionModel.keyboardSortCueVisibleProperty.value ) ) {
          this.adjustMedianIndicatorBottom( topObjectPositionY );
        }

        // The playAreaMedianIndicatorNode shouldn't overlap the accordion box
        this.repositionNodeIfOverlappingAccordionBox( this.playAreaMedianIndicatorNode );
      }
      this.playAreaMedianIndicatorNode.visible = visible;
    };

    Multilink.multilink( [ model.groupSortInteractionModel.mouseSortCueVisibleProperty,
        model.groupSortInteractionModel.keyboardSortCueVisibleProperty ],
      () => {
        this.updateMedianNode();
      } );


    this.model.selectedSceneModelProperty.link( this.updateMedianNode );
    this.model.sceneModels.forEach( sceneModel => {
      sceneModel.medianValueProperty.link( this.updateMedianNode );
      sceneModel.medianValueProperty.link( this.updateMouseSortCueNode.bind( this ) );
      sceneModel.objectChangedEmitter.addListener( this.updateMedianNode );
    } );
    this.visibleBoundsProperty.link( this.updateMedianNode );
    model.isPlayAreaMedianVisibleProperty.link( this.updateMedianNode );

    this.middleScreenViewLayer.addChild( this.sortIndicatorArrowNode );
    this.middleScreenViewLayer.addChild( this.mouseSortHandCueNode );

    // Add to screenViewRootNode for alternativeInput
    this.screenViewRootNode.addChild( this.backScreenViewLayer );
    this.screenViewRootNode.addChild( this.middleScreenViewLayer );
    this.screenViewRootNode.addChild( this.frontScreenViewLayer );

    this.addChild( this.screenViewRootNode );
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
    this.accordionBox.boundsProperty.link( this.updateMouseSortCueNode.bind( this ) );
    this.accordionBox.boundsProperty.link( () => {
      this.sceneViews.forEach( sceneView => sceneView.groupSortInteractionView.setGroupFocusHighlightTop(
        this.accordionBox!.bounds.bottom, CAVConstants.PHYSICAL_RANGE ) );
    } );
  }

  /**
   * Add controls to the play area. This is the same for all screens, so factored out here.
   * @returns the AlignBox so the pdom order can be set
   */
  protected addPlayAreaControls( controlNode: Node, tandem: Tandem ): AlignBox {

    // In order to use the AlignBox we need to know the distance from the top of the screen, to the top of the grass.
    const BOTTOM_CHECKBOX_PANEL_LEFT_MARGIN = 30;
    const BOTTOM_CHECKBOX_PANEL_Y_MARGIN = this.layoutBounds.maxY - this.modelViewTransform.modelToViewY( 0 ) + 12.5;

    const controlsVBox = new VBox( {
      spacing: 15,
      align: 'left',
      children: [
        controlNode,
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.valueKicksPatternStringProperty,
          { value: this.numberOfKicksProperty }, {
            tandem: tandem.createTandem( 'valueKicksPatternStringProperty' )
          } ), {
          font: CAVConstants.MAIN_FONT,
          maxWidth: CAVConstants.CHECKBOX_TEXT_MAX_WIDTH + 50,
          tandem: tandem.createTandem( 'numberOfKicksText' ),
          phetioVisiblePropertyInstrumented: true,
          visiblePropertyOptions: {
            phetioFeatured: true
          }
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
    this.pdomPlayAreaNode.setPDOMOrder( [
      ...( sceneKickerRadioButtonGroup ? [ sceneKickerRadioButtonGroup ] : [] ),
      this.kickButtonGroup,
      this.backScreenViewLayer,
      bottomControls,
      ...predictionTools,
      this.intervalToolLayer,
      ...( variabilityMeasureRadioButtonGroup ? [ variabilityMeasureRadioButtonGroup ] : [] ),
      this.accordionBox
      ] );
    this.pdomControlAreaNode.pdomOrder = [
      infoButton,
      this.eraserButton,
      this.resetAllButton
    ];
  }

  /**
   * The predictMedianNode is shared in the Median screen and MeanAndMedianScreen, so factored out here.
   */
  public static createPredictMedianNode( predictMedianValueProperty: Property<number>, isPredictMedianVisibleProperty: TReadOnlyProperty<boolean>, modelViewTransform: ModelViewTransform2, tandem: Tandem ): PredictionSlider {
    return new PredictionSlider( predictMedianValueProperty, modelViewTransform, CAVConstants.PHYSICAL_RANGE, {
      predictionThumbNodeOptions: {
        color: CAVColors.medianColorProperty,
        style: 'arrow'
      },
      valueProperty: predictMedianValueProperty,
      enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
      roundToInterval: 0.5,

      // always step 0.5 even if holding shift (median is always integer or half-integer)
      shiftKeyboardStep: 0.5,
      visibleProperty: isPredictMedianVisibleProperty,
      tandem: tandem,

      phetioFeatured: true
    } );
  }

  protected override updateMouseSortCueNode(): void {
    super.updateMouseSortCueNode();

    const mouseSortCueVisible = this.model.groupSortInteractionModel.mouseSortCueVisibleProperty.value;
    const selectedValue = this.model.groupSortInteractionModel.selectedGroupItemProperty.value?.valueProperty.value ?? null;

    if ( mouseSortCueVisible && selectedValue !== null ) {

      // If the drag indicator is visible and its stack matches the median stack, try to place the median indicator
      // above the drag indicator, while avoiding overlap with the accordion box.
      if ( this.model.selectedSceneModelProperty.value.medianValueProperty.value === selectedValue ) {
        this.adjustMedianIndicatorBottom( this.getTopObjectPositionY( selectedValue ) );
        this.repositionNodeIfOverlappingAccordionBox( this.playAreaMedianIndicatorNode );
      }

      // We never want the sortIndicatorArrowNode to overlap the accordion Box.
      this.repositionNodeIfOverlappingAccordionBox( this.sortIndicatorArrowNode );
    }
  }
}

centerAndVariability.register( 'CAVScreenView', CAVScreenView );