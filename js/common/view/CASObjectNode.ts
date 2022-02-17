// Copyright 2022, University of Colorado Boulder

/**
 * Base class which renders a Node for the CASObject.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import { Circle, Color, DragListener, Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import CASObject from '../model/CASObject.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CASObjectType from '../model/CASObjectType.js';
import ball_png from '../../../images/ball_png.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';

type CASObjectNodeSelfOptions = {
  objectViewType?: CASObjectType
};
export type CASObjectNodeOptions = CASObjectNodeSelfOptions & NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class CASObjectNode extends Node {

  constructor( casObject: CASObject, isShowingBottomMedianProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2, providedOptions?: CASObjectNodeOptions ) {

    const options = optionize<CASObjectNodeOptions, CASObjectNodeSelfOptions, NodeOptions>( {
      objectViewType: casObject.objectType,
      phetioDynamicElement: true
    }, providedOptions );
    super( options );

    const viewRadius = modelViewTransform.modelToViewDeltaX( options.objectViewType.radius );

    // TODO: These should be edge to edge
    const medianHighlight = new Circle( viewRadius + 1.75, {
      fill: Color.RED
    } );
    this.addChild( medianHighlight );

    const childNode = options.objectViewType === CASObjectType.SOCCER_BALL ? new Image( ball_png ) :
                      options.objectViewType === CASObjectType.DOT ? new Circle( viewRadius, { fill: Color.BLACK } ) :
                      new ShadedSphereNode( options.objectViewType.radius * 2 );
    childNode.maxWidth = viewRadius * 2;

    // if the child node is non-square, it should still fit within specified dimensions. Note: this does not change the
    // aspect ratio.
    childNode.maxHeight = childNode.maxWidth;

    // Center the nested Node for compatibility with DragListener
    childNode.center = Vector2.ZERO;

    // TODO: CK: Better comment that explains why this nested layer is necessary
    this.addChild( childNode );

    this.addLinkedElement( casObject, {
      tandem: options.tandem.createTandem( casObject.objectType === CASObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' ),
      phetioState: false
    } );

    casObject.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    this.addInputListener( new DragListener( {
      positionProperty: casObject.dragPositionProperty,
      transform: modelViewTransform
    } ) );

    this.touchArea = this.localBounds.dilatedX( 10 );

    // Prevent dragging or interaction while the object is animating
    casObject.isAnimatingProperty.link( isAnimating => {
      this.cursor = isAnimating ? null : 'pointer';
      this.pickable = !isAnimating;
    } );

    // show or hide the median highlight
    Property.multilink( [ casObject.isMedianObjectProperty, isShowingBottomMedianProperty ],
      ( isMedianObject, isShowingBottomMedian ) => {
        medianHighlight.visible = isMedianObject && isShowingBottomMedian;
      } );

    // TODO: The initial ball should be draggable, remember that should move it into the data set, and
    // when dropped, a new ball should be created.
    // TODO-DESIGN: Should the ball enter the data set once dragged, or only after dropped?
    casObject.valueProperty.link( value => {
      this.pickable = value !== null;
    } );
  }
}

centerAndSpread.register( 'CASObjectNode', CASObjectNode );
export default CASObjectNode;