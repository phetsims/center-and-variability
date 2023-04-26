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
import CAVModel from '../model/CAVModel.js';
import CAVConstants from '../CAVConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CAVObjectNode from './CAVObjectNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import CAVObjectType from '../model/CAVObjectType.js';
import CAVObject from '../model/CAVObject.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import PredictionSlider from './PredictionSlider.js';
import CAVColors from '../CAVColors.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DragIndicatorArrowNode from './DragIndicatorArrowNode.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuestionBar, { QuestionBarOptions } from '../../../../scenery-phet/js/QuestionBar.js';
import CAVAccordionBox from './CAVAccordionBox.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BackgroundNode from './BackgroundNode.js';
import SoccerPlayerNode from './SoccerPlayerNode.js';
import SoccerPlayer from '../model/SoccerPlayer.js';
import merge from '../../../../phet-core/js/merge.js';
import KickButtonGroup from './KickButtonGroup.js';
import PlayAreaMedianIndicatorNode from './PlayAreaMedianIndicatorNode.js';

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
  protected readonly frontObjectLayer = new Node();

  // TODO: We haven't enforced the "exactly half a ball should be occluded if anything is occluded" idea.
  protected readonly backObjectLayer = new Node();
  protected readonly playAreaMedianIndicatorNode: ArrowNode;
  protected readonly eraseButton: EraserButton;

  // Subclasses use this to add to for correct z-ordering and correct tab navigation order
  // TODO: investigate if this is needed
  protected readonly contentLayer = new Node();

  protected readonly medianPredictionNode: PredictionSlider;
  protected readonly meanPredictionNode: PredictionSlider;

  protected readonly accordionBox: CAVAccordionBox;

  protected readonly questionBar: QuestionBar;
  protected readonly playAreaNumberLineNode: NumberLineNode;

  public constructor( model: CAVModel,
                      // TODO: Structure in options?
                      createAccordionBox: ( tandem: Tandem, top: number, layoutBounds: Bounds2, playAreaNumberLineNode: Node ) => CAVAccordionBox, providedOptions: CAVScreenViewOptions ) {
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

    const objectNodeGroup = new PhetioGroup<CAVObjectNode, [ CAVObject ]>( ( tandem, cavObject ) => {
      return new CAVObjectNode( cavObject, model.isShowingPlayAreaMedianProperty, modelViewTransform, objectNodesInputEnabledProperty, {

        // TODO: Why require if null is OK?
        fill: null,
        tandem: tandem
      } );
    }, () => [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: objectNodeGroupTandem,
      supportsDynamicState: false
    } );

    this.addChild( this.contentLayer );
    this.addChild( this.frontObjectLayer );

    const map = new Map<CAVObject, CAVObjectNode>();

    let objectHasBeenDragged = false;
    const dragIndicatorArrowNode = new DragIndicatorArrowNode( {
      tandem: options.tandem.createTandem( 'dragIndicatorArrowNode' ),
      visible: false
    } );
    this.backObjectLayer.addChild( dragIndicatorArrowNode );

    const createObjectNode = ( cavObject: CAVObject ) => {
      const cavObjectNode = objectNodeGroup.createCorrespondingGroupElement( cavObject.tandem.name, cavObject );
      this.frontObjectLayer.addChild( cavObjectNode );

      cavObject.valueProperty.lazyLink( ( value, oldValue ) => {
        if ( value !== null ) {
          if ( oldValue === null ) {
            assert && assert( this.frontObjectLayer.hasChild( cavObjectNode ) );
            this.frontObjectLayer.removeChild( cavObjectNode );
            this.backObjectLayer.addChild( cavObjectNode );

            // add the dragIndicatorArrowNode above the last object when it is added to the play area. if an object was
            // moved before this happens, don't show the dragIndicatorArrowNode
            if ( model.objectGroup.countProperty.value === this.model.physicalRange.max &&
                 objectNodesInputEnabledProperty.value &&
                 _.every( model.objectGroup.getArray(), cavObject => cavObject.valueProperty.value !== null ) &&
                 !objectHasBeenDragged ) {
              dragIndicatorArrowNode.centerX = this.modelViewTransform.modelToViewX( value );

              const dragIndicatorArrowNodeMargin = 6;

              // calculate where the top object is
              const topObjectPositionY = this.modelViewTransform.modelToViewY( 0 ) -
                                         ( model.getOtherObjectsAtTarget( cavObject ).length + 1 ) *
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

      map.set( cavObject, cavObjectNode );
    };
    model.objectGroup.forEach( createObjectNode );
    model.objectGroup.elementCreatedEmitter.addListener( createObjectNode );

    model.objectGroup.elementDisposedEmitter.addListener( cavObject => {
      const viewNode = map.get( cavObject )!;
      objectNodeGroup.disposeElement( viewNode );
      map.delete( cavObject );
    } );

    this.playAreaMedianIndicatorNode = new PlayAreaMedianIndicatorNode();
    this.addChild( this.playAreaMedianIndicatorNode );

    const updateMedianNode = () => {
      const medianValue = model.medianValueProperty.value;
      const visible = medianValue !== null && model.isShowingPlayAreaMedianProperty.value;

      if ( visible ) {

        // if there is a ball at that location, go above the ball
        const ballsAtLocation = model.objectGroup.filter( cavObject => cavObject.valueProperty.value === medianValue );
        const modelHeight = ballsAtLocation.length * CAVObjectType.SOCCER_BALL.radius * 2; // assumes no spacing

        const viewHeight = this.modelViewTransform.modelToViewDeltaY( modelHeight );

        this.playAreaMedianIndicatorNode.centerX = this.modelViewTransform.modelToViewX( medianValue );
        this.playAreaMedianIndicatorNode.bottom = this.modelViewTransform.modelToViewY( 0 ) + viewHeight;

        // The arrow shouldn't overlap the accordion box
        const accordionBoxHeight = this.accordionBox.expandedProperty.value ? this.accordionBox.getExpandedBoxHeight() : this.accordionBox.getCollapsedBoxHeight();
        if ( this.playAreaMedianIndicatorNode.top < this.accordionBox.top + accordionBoxHeight ) {
          this.playAreaMedianIndicatorNode.top = this.accordionBox.top + accordionBoxHeight + 4;
        }
      }
      this.playAreaMedianIndicatorNode.visible = visible;
    };
    model.medianValueProperty.link( updateMedianNode );
    model.objectChangedEmitter.addListener( updateMedianNode );
    model.isShowingPlayAreaMedianProperty.link( updateMedianNode );

    this.medianPredictionNode = new PredictionSlider( model.medianPredictionProperty, this.modelViewTransform, model.physicalRange, {
      predictionThumbNodeOptions: {
        color: CAVColors.medianColorProperty
      },
      valueProperty: model.medianPredictionProperty,
      enabledRangeProperty: new Property<Range>( model.physicalRange ),
      roundToInterval: 0.5,
      visibleProperty: model.isShowingMedianPredictionProperty,
      tandem: options.tandem.createTandem( 'medianPredictionNode' )
    } );
    this.meanPredictionNode = new PredictionSlider( model.meanPredictionProperty, this.modelViewTransform, model.physicalRange, {
      predictionThumbNodeOptions: {
        color: CAVColors.meanColorProperty
      },
      valueProperty: model.meanPredictionProperty,
      enabledRangeProperty: new Property<Range>( model.physicalRange ),
      roundToInterval: null, // continuous
      visibleProperty: model.isShowingMeanPredictionProperty,
      tandem: options.tandem.createTandem( 'meanPredictionNode' )
    } );

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

    const soccerPlayerNodeGroup = new PhetioGroup<SoccerPlayerNode, [ SoccerPlayer ]>( ( tandem, soccerPlayer ) => {
      return new SoccerPlayerNode( soccerPlayer, this.modelViewTransform, {
        tandem: tandem
      } );
    }, () => [ model.soccerPlayerGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'soccerPlayerNodeGroup' ),
      supportsDynamicState: false
    } );

    // A layer for the soccer players, so we can adjust their z-ordering within that layer
    const soccerPlayerLayer = new Node();
    const createSoccerPlayerNode = ( soccerPlayer: SoccerPlayer ) => {
      const soccerPlayerNode = soccerPlayerNodeGroup.createCorrespondingGroupElement( soccerPlayer.tandem.name, soccerPlayer );
      soccerPlayerLayer.addChild( soccerPlayerNode );

      // TODO: Document why this is correct (since it seems counterintuitive)
      soccerPlayerNode.moveToBack();
    };
    this.contentLayer.addChild( soccerPlayerLayer );
    model.soccerPlayerGroup.forEach( createSoccerPlayerNode );
    model.soccerPlayerGroup.elementCreatedEmitter.addListener( createSoccerPlayerNode );

    model.soccerPlayerGroup.elementDisposedEmitter.addListener( soccerPlayer => {
      const viewNode = soccerPlayerNodeGroup.getArray().find( soccerPlayerNode => soccerPlayerNode.soccerPlayer === soccerPlayer )!;
      soccerPlayerNodeGroup.disposeElement( viewNode );
    } );

    // 0th soccer player is at the front of the line, and should also be in the front in z-ordering
    soccerPlayerNodeGroup.getArrayCopy().reverse().forEach( soccerPlayerNode => soccerPlayerNode.moveToFront() );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, merge( {
      tandem: options.tandem.createTandem( 'questionBar' )
    }, options.questionBarOptions ) );
    this.contentLayer.addChild( this.questionBar );

    this.accordionBox = createAccordionBox( options.tandem.createTandem( 'accordionBox' ), this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN, this.layoutBounds, this.playAreaNumberLineNode );

    this.contentLayer.addChild( new KickButtonGroup( model, {
      left: 25,

      // Center between the ground and the bottom of the layout bounds.  Adjust because of the asymmetries:
      // the soccer player foot falls beneath the ground, and the shading of the buttons.
      centerY: ( GROUND_POSITION_Y + this.layoutBounds.maxY ) / 2 + 2,
      tandem: options.tandem.createTandem( 'kickButtonGroup' )
    } ) );

    // Soccer balls go behind the accordion box after they land
    this.contentLayer.addChild( this.backObjectLayer );

    this.contentLayer.addChild( this.accordionBox );
    this.accordionBox.expandedProperty.link( updateMedianNode );

    // Add in the same order as the checkboxes, so the z-order matches the checkbox order

    // TODO: meanPredictionNode should only exist in MeanAndMedianScreenView
    this.contentLayer.addChild( this.meanPredictionNode );
    this.contentLayer.addChild( this.medianPredictionNode );
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    // See subclass for implementation
  }

  /**
   * Floating layout that keeps the ground near the ground, and accordion box near the question bar
   */
  public override layout( viewBounds: Bounds2 ): void {

    // TODO: Duplicates effort with the parent implementation
    this.matrix = ScreenView.getLayoutMatrix( this.layoutBounds, viewBounds, {
      verticalAlign: 'bottom'
    } );
    this.visibleBoundsProperty.value = this.parentToLocalBounds( viewBounds );

    this.accordionBox.top = this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN;
  }
}

centerAndVariability.register( 'CAVScreenView', CAVScreenView );