// Copyright 2022, University of Colorado Boulder

/**
 * Shows the dot plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * TODO: If the median bar shows at min=median=max=1, the dot plot shifts
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Color, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASModel from '../model/CASModel.js';
import CASObject from '../model/CASObject.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CASObjectNode from './CASObjectNode.js';
import CASObjectType from '../model/CASObjectType.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import MedianBarsNode from './MedianBarsNode.js';

// constants

type DotPlotNodeSelfOptions = {};
export type DotPlotNodeOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class DotPlotNode extends Node {

  private readonly dotLayer: Node;
  private readonly medianBarsNode: MedianBarsNode;

  constructor( model: CASModel, numberLineWidth: number, providedOptions?: DotPlotNodeOptions ) {

    const options = optionize<DotPlotNodeOptions, DotPlotNodeSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    // TODO: Factor out height with accordion box height
    const backgroundNode = new Rectangle( 0, 0, numberLineWidth, 180 );

    // explicitly set the local bounds so they don't change. Without this, a ball appearing at the left edge during the runtime
    // could mess up the layout.
    // TODO: Review how the bounds are handled here.
    backgroundNode.localBounds = backgroundNode.getRectBounds();
    this.addChild( backgroundNode );

    const numberLinePositionY = 143;

    // scale down in the y direction to support smaller object nodes
    const yScale = 1 / model.objectType.radius * CASObjectType.DOT.radius;

    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( model.range.min, 0, model.range.max, model.range.getLength() ),
      new Bounds2( 0, numberLinePositionY - numberLineWidth * yScale, 0 + numberLineWidth, numberLinePositionY )
    );

    const numberLineNode = new NumberLineNode(
      model.range,
      numberLineWidth,
      model.meanValueProperty,
      model.isShowingTopMeanProperty, {
        color: Color.BLACK,
        includeXAxis: true,
        tandem: options.tandem.createTandem( 'numberLineNode' ),
        top: numberLinePositionY
      } );
    backgroundNode.addChild( numberLineNode );

    this.dotLayer = new Node();
    backgroundNode.addChild( this.dotLayer );

    const dotNodeGroup = new PhetioGroup<CASObjectNode, [ CASObject ]>( ( tandem, casObject ) => {
      return new CASObjectNode( casObject, model.isShowingBottomMedianProperty, modelViewTransform, {
        objectViewType: CASObjectType.DOT,
        draggingEnabled: false,
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'dotNodeGroup' ),
      supportsDynamicState: false
    } );

    const map = new Map<CASObject, CASObjectNode>();

    const createDotNode = ( casObject: CASObject ) => {
      const dotNode = dotNodeGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject );

      casObject.valueProperty.link( value => {
        dotNode.setVisible( value !== null );
        if ( value !== null && !this.dotLayer.hasChild( dotNode ) ) {
          this.dotLayer.addChild( dotNode );
        }
      } );
      map.set( casObject, dotNode );
    };
    model.objectGroup.forEach( createDotNode );
    model.objectGroup.elementCreatedEmitter.addListener( createDotNode );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const viewNode = map.get( casObject )!;
      dotNodeGroup.disposeElement( viewNode );
    } );

    this.medianBarsNode = new MedianBarsNode( {
      notchDirection: 'down'
    } );
    this.addChild( this.medianBarsNode );

    const updateMedianNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];

      const medianValue = model.medianValueProperty.value;

      const MARGIN_Y = 5;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card

      if ( model.isShowingTopMedianProperty.value && leftmostDot ) {
        const highestDot = _.maxBy( sortedDots, object => object.positionProperty.value.y );
        const dotRadius = Math.abs( modelViewTransform.modelToViewDeltaY( leftmostDot.objectType.radius ) );

        // assumes all of the dots have the same radius
        // TODO: do we need to know notch height here?
        const barY = modelViewTransform.modelToViewY( highestDot!.positionProperty.value.y ) -
                     dotRadius - MARGIN_Y - MedianBarsNode.NOTCH_HEIGHT;

        const rightmostDot = sortedDots[ sortedDots.length - 1 ];
        const left = modelViewTransform.modelToViewX( leftmostDot.valueProperty.value );
        const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value );
        const medianPositionX = modelViewTransform.modelToViewX( medianValue );

        this.medianBarsNode.setMedianBarsShape( barY, left, medianPositionX, right );
      }
      else {
        this.medianBarsNode.clear();
      }
    };
    model.objectChangedEmitter.addListener( updateMedianNode );
    model.isShowingTopMedianProperty.link( updateMedianNode );
  }

  /**
   * No implementation because this node is powered by the model. Reset needed for uniformity with NumberCardContainer.
   */
  reset() {}
}

centerAndSpread.register( 'DotPlotNode', DotPlotNode );
export default DotPlotNode;