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

type SelfOptions = {
  topCheckboxPanelOptions?: boolean;
  bottomCheckboxPanelOptions?: boolean;
};
export type CASScreenViewOptions = SelfOptions & ScreenViewOptions;

class CASScreenView extends ScreenView {

  protected readonly topCheckboxPanel: TopRepresentationCheckboxGroup;
  protected readonly bottomCheckboxPanel: BottomRepresentationCheckboxGroup;

  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly model: CASModel;
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

  constructor( model: CASModel, modelViewTransform: ModelViewTransform2, options: CASScreenViewOptions ) {
    options = optionize<CASScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    this.modelViewTransform = modelViewTransform;
    this.model = model;

    const objectNodeGroup = new PhetioGroup<CASObjectNode, [ CASObject ]>( ( tandem, casObject ) => {
      return new CASObjectNode( casObject, model.isShowingPlayAreaMedianProperty, modelViewTransform, {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( model.objectType === CASObjectType.SOCCER_BALL ? 'soccerBallNodeGroup' : 'dataPointNodeGroup' ),
      supportsDynamicState: false
    } );

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

    // TODO: Separate class?
    this.playAreaMedianIndicatorNode = new ArrowNode( 0, 0, 0, 27, {
      fill: CASColors.medianColorProperty,
      stroke: CASColors.arrowStrokeProperty,
      lineWidth: CASConstants.ARROW_LINE_WIDTH,
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
      color: CASColors.medianColorProperty,
      roundToInterval: 0.5
    } );
    this.meanPredictionNode = new PredictionNode( model.meanPredictionProperty, this.modelViewTransform, model.physicalRange, {
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

        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - CASConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CASConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.eraserButton = new EraserButton( {
      listener: () => {

        // Interrupt dragging of existing objects
        this.interruptSubtreeInput();

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
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
  }
}

centerAndSpread.register( 'CASScreenView', CASScreenView );
export default CASScreenView;