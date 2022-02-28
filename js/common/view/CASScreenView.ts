// Copyright 2022, University of Colorado Boulder

/**
 * Base class for all ScreenViews in the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel from '../model/CASModel.js';
import CASConstants from '../CASConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CASObjectNode from './CASObjectNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import CASObjectType from '../model/CASObjectType.js';
import CASObject from '../model/CASObject.js';
import TopRepresentationCheckboxGroup from './TopRepresentationCheckboxGroup.js';
import BottomRepresentationCheckboxGroup from './BottomRepresentationCheckboxGroup.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import PredictionNode from './PredictionNode.js';
import CASColors from '../CASColors.js';

type CASScreenViewSelfOptions = {
  topCheckboxPanelOptions?: boolean;
  bottomCheckboxPanelOptions?: boolean;
};
export type CASScreenViewOptions = CASScreenViewSelfOptions & ScreenViewOptions;

class CASScreenView extends ScreenView {

  readonly topCheckboxPanel: TopRepresentationCheckboxGroup; // TODO: can these be private or protected?
  readonly bottomCheckboxPanel: BottomRepresentationCheckboxGroup;

  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly model: CASModel;
  protected readonly frontObjectLayer: Node;

  // TODO: We haven't enforced the "exactly half a ball should be occluded if anything is occluded" idea.
  protected readonly backObjectLayer: Node;
  protected readonly playAreaMedianIndicatorNode: ArrowNode;
  protected readonly eraserButton: EraserButton;
  protected readonly contentLayer: Node;
  protected readonly medianPredictionNode: PredictionNode;
  protected readonly meanPredictionNode: PredictionNode;

  constructor( model: CASModel, modelViewTransform: ModelViewTransform2, options: CASScreenViewOptions ) {
    options = optionize<CASScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    this.modelViewTransform = modelViewTransform;
    this.model = model;

    const objectNodeGroup = new PhetioGroup<CASObjectNode, [ CASObject ]>( ( tandem, casObject ) => {
      return new CASObjectNode( casObject, model.isShowingBottomMedianProperty, modelViewTransform, {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( model.objectType === CASObjectType.SOCCER_BALL ? 'soccerBallNodeGroup' : 'dataPointNodeGroup' ),
      supportsDynamicState: false
    } );

    // Subclasses use this to add to for correct z-ordering and correct tab navigation order
    // TODO: investigate if this is needed
    this.contentLayer = new Node();
    this.backObjectLayer = new Node();

    this.addChild( this.contentLayer );

    this.frontObjectLayer = new Node();
    this.addChild( this.frontObjectLayer );

    const map = new Map<CASObject, CASObjectNode>();

    const createObjectNode = ( casObject: CASObject ) => {
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

    // TODO: Consider renaming as Group instead of panel (if they only contain checkboxes)
    this.topCheckboxPanel = new TopRepresentationCheckboxGroup( model, options.topCheckboxPanelOptions );
    this.bottomCheckboxPanel = new BottomRepresentationCheckboxGroup( model, options.bottomCheckboxPanelOptions );
    this.addChild( this.bottomCheckboxPanel );

    // Play area median indicator.  TODO: Separate class?
    this.playAreaMedianIndicatorNode = new ArrowNode( 0, 0, 0, 35, { fill: CASColors.medianColorProperty, stroke: null } );
    this.addChild( this.playAreaMedianIndicatorNode );

    const updateMedianNode = () => {
      const medianValue = model.medianValueProperty.value;
      const visible = medianValue !== null && model.isShowingBottomMedianProperty.value;

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
    model.isShowingBottomMedianProperty.link( updateMedianNode );

    this.medianPredictionNode = new PredictionNode( model.medianPredictionProperty, this.modelViewTransform, model.range, {
      center: this.layoutBounds.center,
      tandem: options.tandem.createTandem( 'medianPredictionNode' ),
      color: CASColors.medianColorProperty,
      roundToInterval: 0.5
    } );
    this.meanPredictionNode = new PredictionNode( model.meanPredictionProperty, this.modelViewTransform, model.range, {
      center: this.layoutBounds.center,
      tandem: options.tandem.createTandem( 'meanPredictionNode' ),
      color: CASColors.meanColorProperty,
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

        // TODO: Model should be resetting first, see TODO for this.eraserButton
        this.reset();
        model.reset();
      },
      right: this.layoutBounds.maxX - CASConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CASConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.eraserButton = new EraserButton( {
      listener: () => {

        // Interrupt dragging of existing objects
        this.interruptSubtreeInput();

        // TODO: Model should be clearing first but there is currently an order dependency because this.clearData() is
        // initializing new data (the new ball to kick) before the view has reset, and the view is currently is storing
        // model information in CardNodeContainer.
        this.clearData(); // TODO: observe model clearing? CK: Yes, i think we should do this. We either need a
        // CardModelContainer to track model state, or an Emitter from the CASModel to CardNodeContainer.clear(). Then
        // we can omit all view clearData calls.
        model.clearData();
      },
      iconWidth: 26,
      right: this.resetAllButton.left - CASConstants.SCREEN_VIEW_X_MARGIN,
      centerY: this.resetAllButton.centerY
    } );
    this.addChild( this.eraserButton );
    this.addChild( this.resetAllButton );
  }

  /**
   * Resets the view.
   */
  reset(): void {
  }

  /**
   * Resets the view for the data.
   */
  clearData(): void {
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
  }
}

centerAndSpread.register( 'CASScreenView', CASScreenView );
export default CASScreenView;