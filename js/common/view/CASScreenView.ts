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
  protected readonly objectsLayer: Node;
  protected readonly playAreaMedianIndicatorNode: ArrowNode;
  protected readonly eraserButton: EraserButton;
  protected readonly medianPredictionNode: PredictionNode;

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

    // Added by the child ScreenView so it is in the correct z-ordering
    this.objectsLayer = new Node();

    const map = new Map<CASObject, CASObjectNode>();

    const createObjectNode = ( casObject: CASObject ) => {
      const casObjectNode = objectNodeGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject );
      this.objectsLayer.addChild( casObjectNode );
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

    // Play area median indicator.  TODO: Separate class?
    this.playAreaMedianIndicatorNode = new ArrowNode( 0, 0, 0, 35, { fill: 'red', stroke: null } );

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
    model.objectValueChangedEmitter.addListener( updateMedianNode );
    model.isShowingBottomMedianProperty.link( updateMedianNode );

    this.medianPredictionNode = new PredictionNode( model.medianPredictionProperty, this.modelViewTransform, model.range, {
      center: this.layoutBounds.center,
      tandem: options.tandem.createTandem( 'medianPredictionNode' )
    } );

    model.isShowingMedianPredictionProperty.link( isShowingMedianPrediction => {
      this.medianPredictionNode.visible = isShowingMedianPrediction;
    } );

    // Added by the child ScreenView so it is in the correct z-ordering
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

    // Added by the child ScreenView so it is in the correct z-ordering
    this.eraserButton = new EraserButton( {
      listener: () => {

        // Interrupt dragging of existing objects
        this.interruptSubtreeInput();

        model.clearData();
        this.clearData();
      },
      iconWidth: 26,
      right: this.resetAllButton.left - CASConstants.SCREEN_VIEW_X_MARGIN,
      centerY: this.resetAllButton.centerY
    } );
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