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
import CAVSceneModel from '../model/CAVSceneModel.js';
import CAVConstants from '../CAVConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { AlignBox, ManualConstraint, Node } from '../../../../scenery/js/imports.js';
import CAVObjectType from '../model/CAVObjectType.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DragIndicatorArrowNode from './DragIndicatorArrowNode.js';
import QuestionBar, { QuestionBarOptions } from '../../../../scenery-phet/js/QuestionBar.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BackgroundNode from './BackgroundNode.js';
import SoccerPlayerNode from './SoccerPlayerNode.js';
import merge from '../../../../phet-core/js/merge.js';
import KickButtonGroup from './KickButtonGroup.js';
import PlayAreaMedianIndicatorNode from './PlayAreaMedianIndicatorNode.js';
import CAVAccordionBox from './CAVAccordionBox.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { AnimationMode } from '../model/AnimationMode.js';
import SoccerBallNode from './SoccerBallNode.js';
import PredictionSlider from './PredictionSlider.js';
import CAVColors from '../CAVColors.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  questionBarOptions: QuestionBarOptions;
};

export type CAVScreenViewOptions = SelfOptions & ScreenViewOptions;

// constants
const GROUND_POSITION_Y = 500;

export default class CAVScreenView extends ScreenView {

  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly model: CAVSceneModel;
  protected readonly frontObjectLayer = new Node();

  // TODO: We haven't enforced the "exactly half a ball should be occluded if anything is occluded" design,
  // May need https://github.com/phetsims/center-and-variability/issues/166 to be addressed first
  protected readonly backObjectLayer = new Node();
  protected readonly playAreaMedianIndicatorNode: ArrowNode;
  protected readonly eraseButton: EraserButton;

  // Subclasses use this to add to for correct z-ordering and correct tab navigation order
  protected readonly contentLayer = new Node();

  protected accordionBox: CAVAccordionBox | null = null;

  protected readonly questionBar: QuestionBar;
  protected readonly playAreaNumberLineNode: NumberLineNode;
  private readonly updateMedianNode: () => void;

  public constructor( model: CAVSceneModel, providedOptions: CAVScreenViewOptions ) {
    const options = optionize<CAVScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    // The ground is at y=0
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( model.physicalRange.min, 0, model.physicalRange.max, model.physicalRange.getLength() ),
      new Bounds2( CAVConstants.NUMBER_LINE_MARGIN_X, GROUND_POSITION_Y - CAVConstants.CHART_VIEW_WIDTH, CAVConstants.NUMBER_LINE_MARGIN_X + CAVConstants.CHART_VIEW_WIDTH, GROUND_POSITION_Y )
    );

    super( options );

    this.modelViewTransform = modelViewTransform;
    this.model = model;

    const objectNodeGroupTandem = options.tandem.createTandem( 'soccerBallNodeGroup' );

    const objectNodesInputEnabledProperty = new BooleanProperty( true, {
      tandem: objectNodeGroupTandem.createTandem( 'inputEnabledProperty' )
    } );

    model.soccerBalls.map( ( soccerBall, index ) => {
      const soccerBallNode = new SoccerBallNode( soccerBall, model.isShowingPlayAreaMedianProperty, modelViewTransform, objectNodesInputEnabledProperty, {
        tandem: options.tandem.createTandem( 'soccerBalls' ).createTandem( 'soccerBallNode' + index )
      } );

      this.backObjectLayer.addChild( soccerBallNode );

      // While flying, it should be in front in z-order, to be in front of the accordion box
      soccerBall.animationModeProperty.lazyLink( ( animationMode, oldAnimationModel ) => {
        if ( animationMode === AnimationMode.FLYING ) {
          this.backObjectLayer.removeChild( soccerBallNode );
          this.frontObjectLayer.addChild( soccerBallNode );
        }
        else if ( oldAnimationModel ) {
          this.frontObjectLayer.removeChild( soccerBallNode );
          this.backObjectLayer.addChild( soccerBallNode );
        }
      } );

      soccerBall.valueProperty.lazyLink( ( value, oldValue ) => {
        if ( value !== null ) {
          if ( oldValue === null ) {

            // add the dragIndicatorArrowNode above the last object when it is added to the play area. if an object was
            // moved before this happens, don't show the dragIndicatorArrowNode
            if ( model.soccerBallCountProperty.value === this.model.physicalRange.max &&
                 objectNodesInputEnabledProperty.value &&
                 _.every( model.soccerBalls, soccerBall => soccerBall.valueProperty.value !== null ) &&
                 !objectHasBeenDragged ) {
              dragIndicatorArrowNode.centerX = this.modelViewTransform.modelToViewX( value );

              const dragIndicatorArrowNodeMargin = 6;

              // calculate where the top object is
              const topObjectPositionY = this.modelViewTransform.modelToViewY( 0 ) -
                                         ( model.getOtherObjectsAtTarget( soccerBall ).length + 1 ) *
                                         Math.abs( this.modelViewTransform.modelToViewDeltaY( CAVObjectType.SOCCER_BALL.radius ) ) * 2 -
                                         dragIndicatorArrowNodeMargin;

              dragIndicatorArrowNode.bottom = topObjectPositionY;
              dragIndicatorArrowNode.visible = true;
            }
          }
          else {
            objectHasBeenDragged = true;
            dragIndicatorArrowNode.visible = false;
          }
        }
      } );

      return soccerBallNode;
    } );

    this.addChild( this.contentLayer );
    this.addChild( this.frontObjectLayer );

    let objectHasBeenDragged = false;
    const dragIndicatorArrowNode = new DragIndicatorArrowNode( {
      tandem: options.tandem.createTandem( 'dragIndicatorArrowNode' ),
      visible: false
    } );
    this.backObjectLayer.addChild( dragIndicatorArrowNode );

    this.playAreaMedianIndicatorNode = new PlayAreaMedianIndicatorNode();
    this.addChild( this.playAreaMedianIndicatorNode );

    this.updateMedianNode = () => {
      const medianValue = model.medianValueProperty.value;
      const visible = medianValue !== null && model.isShowingPlayAreaMedianProperty.value;

      if ( visible ) {

        // if there is a ball at that location, go above the ball
        const ballsAtLocation = model.soccerBalls.filter( soccerBall => soccerBall.valueProperty.value === medianValue );
        const modelHeight = ballsAtLocation.length * CAVObjectType.SOCCER_BALL.radius * 2; // assumes no spacing

        const viewHeight = this.modelViewTransform.modelToViewDeltaY( modelHeight );

        this.playAreaMedianIndicatorNode.centerX = this.modelViewTransform.modelToViewX( medianValue );
        this.playAreaMedianIndicatorNode.bottom = this.modelViewTransform.modelToViewY( 0 ) + viewHeight;

        // The arrow shouldn't overlap the accordion box
        if ( this.accordionBox ) {
          const accordionBoxHeight = this.accordionBox.expandedProperty.value ? this.accordionBox.getExpandedBoxHeight() : this.accordionBox.getCollapsedBoxHeight();
          if ( this.playAreaMedianIndicatorNode.top < this.accordionBox.top + accordionBoxHeight ) {
            this.playAreaMedianIndicatorNode.top = this.accordionBox.top + accordionBoxHeight + 4;
          }
        }
      }
      this.playAreaMedianIndicatorNode.visible = visible;
    };
    model.medianValueProperty.link( this.updateMedianNode );
    model.objectChangedEmitter.addListener( this.updateMedianNode );
    model.isShowingPlayAreaMedianProperty.link( this.updateMedianNode );


    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress

        model.reset();

        // hide the dragIndicatorArrowNode and reset the flag for if it has been dragged already
        objectHasBeenDragged = false;
        dragIndicatorArrowNode.visible = false;
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

        model.clearData();

        // hide the dragIndicatorArrowNode but don't reset objectHasBeenDragged
        dragIndicatorArrowNode.visible = false;
      },
      iconWidth: 26,
      right: this.resetAllButton.left - CAVConstants.SCREEN_VIEW_X_MARGIN,
      centerY: this.resetAllButton.centerY
    } );
    this.addChild( this.eraseButton );
    this.addChild( this.resetAllButton );

    this.contentLayer.addChild( new BackgroundNode( GROUND_POSITION_Y, this.visibleBoundsProperty ) );

    this.playAreaNumberLineNode = new NumberLineNode(
      model.physicalRange,
      model.meanValueProperty,
      model.isShowingPlayAreaMeanProperty,
      model.dataRangeProperty, {
        includeXAxis: false,
        includeMeanStroke: true,
        tandem: options.tandem.createTandem( 'playAreaNumberLineNode' ),
        x: CAVConstants.NUMBER_LINE_MARGIN_X,
        y: GROUND_POSITION_Y
      } );
    this.contentLayer.addChild( this.playAreaNumberLineNode );

    const soccerPlayerNodes = model.soccerPlayers.map( soccerPlayer => new SoccerPlayerNode( soccerPlayer, this.modelViewTransform ) );

    soccerPlayerNodes.forEach( soccerPlayerNode => this.contentLayer.addChild( soccerPlayerNode ) );

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

    // Soccer balls go behind the accordion box after they land
    this.contentLayer.addChild( this.backObjectLayer );
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
    this.contentLayer.addChild( this.accordionBox );
    this.accordionBox.expandedProperty.link( this.updateMedianNode );
    this.updateAccordionBoxPosition();
  }

  /**
   * Sets the accordion box and aligns its content with the play area number line node.
   * Should be used with accordion boxes that also have a number line.
   * The alignment  assumes that the NumberLineNode in the play area and in the dot plot have the same characteristics:
   * - Same font
   * -Same offset and scale
   * Given those assumptions, this code moves the dot plot so that its number line matches the play area one.
   */
  protected setAccordionBoxWithAlignedContent( accordionBox: CAVAccordionBox ): void {
    this.setAccordionBox( accordionBox );
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, accordionBox.plotNode ],
      ( lowerNumberLineWrapper, contentsWrapper ) => {
        contentsWrapper.x = lowerNumberLineWrapper.x;
      } );
  }

  protected setBottomCheckboxGroup( items: VerticalCheckboxGroupItem[] ): void {

    const bottomCheckboxGroup = new VerticalCheckboxGroup( items, {
      tandem: this.tandem.createTandem( 'bottomCheckboxGroup' )
    } );

    // In order to use the AlignBox we need to know the distance from the top of the screen, to the top of the grass.
    const BOTTOM_CHECKBOX_PANEL_MARGIN = 12.5;
    const BOTTOM_CHECKBOX_PANEL_Y_MARGIN = this.layoutBounds.maxY - this.modelViewTransform.modelToViewY( 0 ) + BOTTOM_CHECKBOX_PANEL_MARGIN;

    this.addChild( new AlignBox( bottomCheckboxGroup, {
      alignBounds: this.layoutBounds,
      xAlign: 'right',
      yAlign: 'bottom',
      xMargin: BOTTOM_CHECKBOX_PANEL_MARGIN,
      yMargin: BOTTOM_CHECKBOX_PANEL_Y_MARGIN
    } ) );
  }

  /**
   * The MedianPredictionNode is shared in the Median screen and MeanAndMedianScreen, so factored out here.
   */
  public static createMedianPredictionNode( model: CAVSceneModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ): PredictionSlider {
    return new PredictionSlider( model.medianPredictionProperty, modelViewTransform, model.physicalRange, {
      predictionThumbNodeOptions: {
        color: CAVColors.medianColorProperty
      },
      valueProperty: model.medianPredictionProperty,
      enabledRangeProperty: new Property<Range>( model.physicalRange ),
      roundToInterval: 0.5,
      visibleProperty: model.isShowingMedianPredictionProperty,
      tandem: tandem
    } );
  }
}

centerAndVariability.register( 'CAVScreenView', CAVScreenView );