// Copyright 2022, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVModel from '../model/CAVModel.js';
import CAVObject from '../model/CAVObject.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CAVObjectNode from './CAVObjectNode.js';
import CAVObjectType from '../model/CAVObjectType.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import MedianBarNode from './MedianBarNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = EmptySelfOptions;
export type CAVPlotOptions = NodeOptions & PickRequired<NodeOptions, 'tandem'>;

class CAVPlotNode extends Node {

  private readonly dotLayer: Node;
  private readonly medianBarNode: MedianBarNode;

  public constructor( model: CAVModel, numberLineWidth: number, providedOptions?: CAVPlotOptions ) {

    const options = optionize<CAVPlotOptions, SelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    // TODO: Factor out height with accordion box height
    const backgroundNode = new Rectangle( 0, 0, numberLineWidth, 180 );
    this.addChild( backgroundNode );

    const numberLinePositionY = 127;

    // scale down in the y direction to support smaller object nodes
    const yScale = CAVObjectType.DOT.radius / model.objectType.radius;

    // const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
    //   new Bounds2( model.range.min, 0, model.range.max, 1 ),
    //   new Bounds2( 0, numberLinePositionY - 14.84, 0 + numberLineWidth, numberLinePositionY )
    // );
    // TODO: we currently define the y range with the x width because we are thinking of it as a square, with a stack of
    //  15 balls as the high point. Consider instead something like above, where we just base the y scaling on the height
    // of one ball.
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( model.physicalRange.min, 0, model.physicalRange.max, model.physicalRange.getLength() ),
      new Bounds2( 0, numberLinePositionY - numberLineWidth * yScale, 0 + numberLineWidth, numberLinePositionY )
    );

    const numberLineNode = new NumberLineNode(
      model.physicalRange,
      numberLineWidth,
      model.meanValueProperty,
      model.isShowingTopMeanProperty,
      model.dataRangeProperty, {
        color: 'black',
        includeXAxis: true,
        includeMeanStroke: false,
        tandem: options.tandem.createTandem( 'numberLineNode' ),
        y: numberLinePositionY
      } );
    backgroundNode.addChild( numberLineNode );

    backgroundNode.addChild( new Text( CenterAndVariabilityStrings.distanceInMeters, {

      // TODO-UX: This may be asymmetrical if it accounts for edge labels
      centerX: numberLineNode.centerX,
      top: numberLineNode.bottom + 2,
      font: new PhetFont( 13 )
    } ) );
    this.dotLayer = new Node();
    backgroundNode.addChild( this.dotLayer );

    // TODO: This overlaps with draggingEnabled
    const dotPlotObjectNodesDraggableProperty = new BooleanProperty( false );

    const dotNodeGroup = new PhetioGroup<CAVObjectNode, [ CAVObject ]>( ( tandem, casObject ) => {
      return new CAVObjectNode( casObject, model.isShowingTopMedianProperty, modelViewTransform, dotPlotObjectNodesDraggableProperty, {
        objectViewType: CAVObjectType.DOT,
        draggingEnabled: false,
        tandem: tandem
      } );
    }, () => [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'dotNodeGroup' ),
      supportsDynamicState: false
    } );

    const map = new Map<CAVObject, CAVObjectNode>();

    const createDotNode = ( casObject: CAVObject ) => {
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
      map.delete( casObject );
    } );

    this.medianBarNode = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous'
    } );
    this.addChild( this.medianBarNode );

    const updateMedianBarNode = () => {

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
                     dotRadius - MARGIN_Y - MedianBarNode.NOTCH_HEIGHT;

        const rightmostDot = sortedDots[ sortedDots.length - 1 ];
        assert && assert( leftmostDot.valueProperty.value !== null );
        const left = modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        assert && assert( rightmostDot.valueProperty.value !== null );
        const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );
        assert && assert( medianValue !== null );
        const medianPositionX = modelViewTransform.modelToViewX( medianValue! );

        this.medianBarNode.setMedianBarShape( barY, left, medianPositionX, right, model.isMedianAnimationCompleteProperty.value );
      }
      else {
        this.medianBarNode.clear();
      }
    };
    model.objectChangedEmitter.addListener( updateMedianBarNode );
    model.isShowingTopMedianProperty.link( updateMedianBarNode );
    model.isMedianAnimationCompleteProperty.link( updateMedianBarNode );
  }

  public reset(): void {
    // No implementation because this node is powered by the model. Reset needed for uniformity with CardNodeContainer.
  }
}

centerAndVariability.register( 'CAVPlotNode', CAVPlotNode );
export default CAVPlotNode;