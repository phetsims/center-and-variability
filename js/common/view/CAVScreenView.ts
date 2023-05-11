// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for all ScreenViews in the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../CAVConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { AlignBox, Node } from '../../../../scenery/js/imports.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import QuestionBar, { QuestionBarOptions } from '../../../../scenery-phet/js/QuestionBar.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BackgroundNode from './BackgroundNode.js';
import merge from '../../../../phet-core/js/merge.js';
import CAVAccordionBox from './CAVAccordionBox.js';
import PredictionSlider from './PredictionSlider.js';
import CAVColors from '../CAVColors.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVModel from '../model/CAVModel.js';
import SceneView from './SceneView.js';
import KickButtonGroup from './KickButtonGroup.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import SoccerPlayerNode, { SoccerPlayerImageSet } from './SoccerPlayerNode.js';
import SoccerPlayer from '../model/SoccerPlayer.js';
import CAVSceneModel from '../model/CAVSceneModel.js';
import DragIndicatorArrowNode from './DragIndicatorArrowNode.js';
import CAVObjectType from '../model/CAVObjectType.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';

type SelfOptions = {
  questionBarOptions: QuestionBarOptions;
};

export type CAVScreenViewOptions = SelfOptions & ScreenViewOptions;

// constants
const GROUND_POSITION_Y = 500;

export default class CAVScreenView extends ScreenView {

  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly model: CAVModel;

  // TODO: We haven't enforced the "exactly half a ball should be occluded if anything is occluded" design, see https://github.com/phetsims/center-and-variability/issues/175
  protected readonly frontObjectLayer = new Node();
  protected readonly backObjectLayer = new Node();

  protected readonly eraseButton: EraserButton;

  // Subclasses use this to add to for correct z-ordering and correct tab navigation order
  protected readonly contentLayer = new Node();

  protected accordionBox: CAVAccordionBox | null = null;

  protected readonly questionBar: QuestionBar;
  protected readonly playAreaNumberLineNode: NumberLineNode;

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

    this.modelViewTransform = modelViewTransform;
    this.model = model;

    this.addChild( this.contentLayer );

    this.contentLayer.addChild( new BackgroundNode( GROUND_POSITION_Y, this.visibleBoundsProperty ) );

    // Soccer balls go behind the accordion box after they land
    this.contentLayer.addChild( this.backObjectLayer );
    this.addChild( this.frontObjectLayer );

    // TODO: Scene names, see https://github.com/phetsims/center-and-variability/issues/184
    const sceneViews = model.sceneModels.map( ( sceneModel, index ) => new SceneView(
      model,
      sceneModel,
      ( soccerPlayer, sceneModel ) => this.getSoccerPlayerImageSet( soccerPlayer, sceneModel ),
      modelViewTransform, () => this.accordionBox, {
        tandem: options.tandem.createTandem( 'sceneView' + index )
      } ) );

    const createToggleNode = ( pickLayer: ( sceneView: SceneView ) => Node ) => new ToggleNode( model.selectedSceneModelProperty, sceneViews.map( sceneView => {
        return {
          value: sceneView.sceneModel,
          createNode: tandem => pickLayer( sceneView )
        };
      }
    ), {
      alignChildren: ToggleNode.NONE
    } );

    this.backObjectLayer.addChild( createToggleNode( sceneView => sceneView.backLayer ) );
    this.frontObjectLayer.addChild( createToggleNode( sceneView => sceneView.frontLayer ) );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress

        model.reset();

        // hide the dragIndicatorArrowNode and reset the flag for if it has been dragged already
        // TODO: See also https://github.com/phetsims/center-and-variability/issues/129
        // dragIndicatorArrowNode.visible = false;
      },
      right: this.layoutBounds.maxX - CAVConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CAVConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.eraseButton = new EraserButton( {
      tandem: options.tandem.createTandem( 'eraseButton' ),
      listener: () => {

        // Interrupt dragging of existing objects
        this.interruptSubtreeInput();

        model.selectedSceneModelProperty.value.clearData();

        // hide the dragIndicatorArrowNode but don't reset objectHasBeenDragged
        // dragIndicatorArrowNode.visible = false;
      },
      iconWidth: 26,
      right: this.resetAllButton.left - CAVConstants.SCREEN_VIEW_X_MARGIN,
      centerY: this.resetAllButton.centerY
    } );
    this.addChild( this.eraseButton );
    this.addChild( this.resetAllButton );

    this.playAreaNumberLineNode = new NumberLineNode(
      new DynamicProperty( model.selectedSceneModelProperty, {
        derive: 'meanValueProperty'
      } ),
      modelViewTransform,
      model.isShowingPlayAreaMeanProperty,
      new DynamicProperty( model.selectedSceneModelProperty, {
        derive: 'dataRangeProperty'
      } ), {
        includeXAxis: false,
        includeMeanStroke: true,
        tandem: options.tandem.createTandem( 'playAreaNumberLineNode' ),
        x: CAVConstants.NUMBER_LINE_MARGIN_X,
        y: GROUND_POSITION_Y
      } );
    this.contentLayer.addChild( this.playAreaNumberLineNode );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, merge( {
      tandem: options.tandem.createTandem( 'questionBar' )
    }, options.questionBarOptions ) );
    this.contentLayer.addChild( this.questionBar );

    this.contentLayer.addChild( new KickButtonGroup( model, {
      left: 25,

      // Center between the ground and the bottom of the layout bounds.  Adjust because of the asymmetries:
      // the soccer player foot falls beneath the ground, and the shading of the buttons.
      centerY: ( GROUND_POSITION_Y + this.layoutBounds.maxY ) / 2 + 2,
      tandem: options.tandem.createTandem( 'kickButtonGroup' )
    } ) );

    const dragIndicatorArrowNode = new DragIndicatorArrowNode( {
      tandem: options.tandem.createTandem( 'dragIndicatorArrowNode' )
    } );

    Multilink.multilink( [ model.dragIndicatorVisibleProperty, model.dragIndicatorValueProperty ],
      ( dragIndicatorVisible, dragIndicatorValue ) => {
        dragIndicatorArrowNode.visible = dragIndicatorVisible;

        if ( dragIndicatorVisible && dragIndicatorValue ) {
          const selectedSceneModel = model.selectedSceneModelProperty.value;

          dragIndicatorArrowNode.centerX = modelViewTransform.modelToViewX( dragIndicatorValue );
          const dragIndicatorArrowNodeMargin = 6;

          // calculate where the top object is
          const topObjectPositionY = modelViewTransform.modelToViewY( 0 ) -
                                     ( selectedSceneModel.getStackAtLocation( dragIndicatorValue ).length ) *
                                     Math.abs( modelViewTransform.modelToViewDeltaY( CAVObjectType.SOCCER_BALL.radius ) ) * 2 -
                                     dragIndicatorArrowNodeMargin;

          dragIndicatorArrowNode.bottom = topObjectPositionY;
        }
      } );

    this.backObjectLayer.addChild( dragIndicatorArrowNode );
  }

  private updateAccordionBoxPosition(): void {
    this.accordionBox!.top = this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN;
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
   * Called by subtype constructors to finish initialization.
   */
  protected setAccordionBox( accordionBox: CAVAccordionBox ): void {
    this.accordionBox = accordionBox;
    this.backObjectLayer.addChild( this.accordionBox );
    this.updateAccordionBoxPosition();
  }

  protected setBottomControls( controlNode: Node ): void {

    // In order to use the AlignBox we need to know the distance from the top of the screen, to the top of the grass.
    const BOTTOM_CHECKBOX_PANEL_MARGIN = 12.5;
    const BOTTOM_CHECKBOX_PANEL_Y_MARGIN = this.layoutBounds.maxY - this.modelViewTransform.modelToViewY( 0 ) + BOTTOM_CHECKBOX_PANEL_MARGIN;

    this.addChild( new AlignBox( controlNode, {
      alignBounds: this.layoutBounds,
      xAlign: 'right',
      yAlign: 'bottom',
      xMargin: BOTTOM_CHECKBOX_PANEL_MARGIN,
      yMargin: BOTTOM_CHECKBOX_PANEL_Y_MARGIN
    } ) );
  }

  public getSoccerPlayerImageSet( soccerPlayer: SoccerPlayer, sceneModel: CAVSceneModel ): SoccerPlayerImageSet {
    return SoccerPlayerNode.MULTI_GROUP[ soccerPlayer.initialPlaceInLine ];
  }

  /**
   * The MedianPredictionNode is shared in the Median screen and MeanAndMedianScreen, so factored out here.
   */
  public static createMedianPredictionNode( model: CAVModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ): PredictionSlider {
    return new PredictionSlider( model.medianPredictionProperty, modelViewTransform, CAVConstants.PHYSICAL_RANGE, {
      predictionThumbNodeOptions: {
        color: CAVColors.medianColorProperty
      },
      valueProperty: model.medianPredictionProperty,
      enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
      roundToInterval: 0.5,
      visibleProperty: model.isShowingMedianPredictionProperty,
      tandem: tandem
    } );
  }
}

centerAndVariability.register( 'CAVScreenView', CAVScreenView );