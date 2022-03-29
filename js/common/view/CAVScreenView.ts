// Copyright 2022, University of Colorado Boulder

/**
 * Base class for all ScreenViews in the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
import merge from '../../../../phet-core/js/merge.js';
import TopRepresentationCheckboxGroup from './TopRepresentationCheckboxGroup.js';
import BottomRepresentationCheckboxGroup from './BottomRepresentationCheckboxGroup.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import PredictionNode from './PredictionNode.js';
import CAVColors from '../CAVColors.js';
import { BarStyle, NotchDirection } from './MedianBarNode.js';

type SelfOptions = {
  topCheckboxGroupOptions?: {
    includeSortData: boolean;
    includeMean: boolean;
    medianBarIconOptions: {
      notchDirection: NotchDirection;
      barStyle: BarStyle;
    };
    showMedianCheckboxIcon: boolean;
  };
  bottomCheckboxGroupOptions?: {
    includeMean?: boolean;
    includePredictMean?: boolean;
  };
};
export type CAVScreenViewOptions = SelfOptions & ScreenViewOptions;

class CAVScreenView extends ScreenView {

  protected readonly topCheckboxGroup: TopRepresentationCheckboxGroup;
  protected readonly bottomCheckboxGroup: BottomRepresentationCheckboxGroup;

  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly model: CAVModel;
  protected readonly frontObjectLayer: Node;

  // TODO: We haven't enforced the "exactly half a ball should be occluded if anything is occluded" idea.
  protected readonly backObjectLayer: Node;
  protected readonly playAreaMedianIndicatorNode: ArrowNode;
  protected readonly eraserButton: EraserButton;

  // Subclasses use this to add to for correct z-ordering and correct tab navigation order
  // TODO: investigate if this is needed
  protected readonly contentLayer: Node;

  protected readonly medianPredictionNode: PredictionNode;
  protected readonly meanPredictionNode: PredictionNode;

  constructor( model: CAVModel, modelViewTransform: ModelViewTransform2, providedOptions: CAVScreenViewOptions ) {
    // @ts-ignore what was happening here?
    const options = optionize<CAVScreenViewOptions, SelfOptions, ScreenViewOptions, 'tandem'>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.modelViewTransform = modelViewTransform;
    this.model = model;

    const objectNodeGroup = new PhetioGroup<CAVObjectNode, [ CAVObject ]>( ( tandem, casObject ) => {
      return new CAVObjectNode( casObject, model.isShowingPlayAreaMedianProperty, modelViewTransform, {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( model.objectType === CAVObjectType.SOCCER_BALL ? 'soccerBallNodeGroup' : 'dataPointNodeGroup' ),
      supportsDynamicState: false
    } );

    this.contentLayer = new Node();
    this.backObjectLayer = new Node();

    this.addChild( this.contentLayer );

    this.frontObjectLayer = new Node();
    this.addChild( this.frontObjectLayer );

    const map = new Map<CAVObject, CAVObjectNode>();

    const createObjectNode = ( casObject: CAVObject ) => {
      const casObjectNode = objectNodeGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject );
      this.frontObjectLayer.addChild( casObjectNode );

      casObject.valueProperty.link( value => {
        if ( value !== null && this.frontObjectLayer.hasChild( casObjectNode ) ) {
          this.frontObjectLayer.removeChild( casObjectNode );
          this.backObjectLayer.addChild( casObjectNode );
        }
      } );

      map.set( casObject, casObjectNode );
    };
    model.objectGroup.forEach( createObjectNode );
    model.objectGroup.elementCreatedEmitter.addListener( createObjectNode );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const viewNode = map.get( casObject )!;
      objectNodeGroup.disposeElement( viewNode );
    } );

    this.topCheckboxGroup = new TopRepresentationCheckboxGroup( model, merge( {
      tandem: options.tandem.createTandem( 'topCheckboxGroup' )
    }, options.topCheckboxGroupOptions ) );
    this.bottomCheckboxGroup = new BottomRepresentationCheckboxGroup( model, merge( {
      tandem: options.tandem.createTandem( 'bottomCheckboxGroup' )
    }, options.bottomCheckboxGroupOptions ) );
    this.addChild( this.bottomCheckboxGroup );

    // TODO: Separate class?
    this.playAreaMedianIndicatorNode = new ArrowNode( 0, 0, 0, 27, {
      fill: CAVColors.medianColorProperty,
      stroke: CAVColors.arrowStrokeProperty,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH,
      headHeight: 12,
      headWidth: 18
    } );
    this.addChild( this.playAreaMedianIndicatorNode );

    const updateMedianNode = () => {
      const medianValue = model.medianValueProperty.value;
      const visible = medianValue !== null && model.isShowingPlayAreaMedianProperty.value;

      if ( visible ) {

        // if there is a ball at that location, go above the ball
        const ballsAtLocation = model.objectGroup.filter( casObject => casObject.valueProperty.value === medianValue );
        const modelHeight = ballsAtLocation.length * model.objectType.radius * 2; // assumes no spacing

        const viewHeight = this.modelViewTransform.modelToViewDeltaY( modelHeight );

        this.playAreaMedianIndicatorNode.centerX = this.modelViewTransform.modelToViewX( medianValue );
        this.playAreaMedianIndicatorNode.bottom = this.modelViewTransform.modelToViewY( 0 ) + viewHeight;
      }
      this.playAreaMedianIndicatorNode.visible = visible;
    };
    model.medianValueProperty.link( updateMedianNode );
    model.objectChangedEmitter.addListener( updateMedianNode );
    model.isShowingPlayAreaMedianProperty.link( updateMedianNode );

    this.medianPredictionNode = new PredictionNode( model.medianPredictionProperty, this.modelViewTransform, model.physicalRange, {
      center: this.layoutBounds.center,
      tandem: options.tandem.createTandem( 'medianPredictionNode' ),
      color: CAVColors.medianColorProperty,
      roundToInterval: 0.5
    } );
    this.meanPredictionNode = new PredictionNode( model.meanPredictionProperty, this.modelViewTransform, model.physicalRange, {
      center: this.layoutBounds.center,
      tandem: options.tandem.createTandem( 'meanPredictionNode' ),
      color: CAVColors.meanColorProperty,
      roundToInterval: null // continuous
    } );

    model.isShowingMedianPredictionProperty.link( isShowingMedianPrediction => {
      this.medianPredictionNode.visible = isShowingMedianPrediction;
    } );
    model.isShowingMeanPredictionProperty.link( isShowingMeanPrediction => {
      this.meanPredictionNode.visible = isShowingMeanPrediction;
    } );

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

        model.clearData();
      },
      iconWidth: 26,
      right: this.resetAllButton.left - CAVConstants.SCREEN_VIEW_X_MARGIN,
      centerY: this.resetAllButton.centerY
    } );
    this.addChild( this.eraserButton );
    this.addChild( this.resetAllButton );
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
  }
}

centerAndVariability.register( 'CAVScreenView', CAVScreenView );
export default CAVScreenView;