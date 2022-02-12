// Copyright 2022, University of Colorado Boulder

/**
 * Base class which renders a Node for the CASObject.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import { DragListener, Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import CASObject from '../model/CASObject.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CASObjectType from '../model/CASObjectType.js';
import ball_png from '../../../images/ball_png.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type CASObjectNodeSelfOptions = {};
export type CASObjectNodeOptions = CASObjectNodeSelfOptions & NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class CASObjectNode extends Node {

  constructor( casObject: CASObject, modelViewTransform: ModelViewTransform2, providedOptions?: CASObjectNodeOptions ) {

    const options = optionize<CASObjectNodeOptions>( {
      phetioDynamicElement: true
    }, providedOptions );
    super( options );

    const childNode = casObject.objectType === CASObjectType.SOCCER_BALL ? new Image( ball_png ) :
                      new ShadedSphereNode( casObject.objectType.radius * 2 );
    childNode.maxWidth = modelViewTransform.modelToViewDeltaX( casObject.objectType.radius * 2 );

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

    // expand the horizontal touch areas but don't overlap with the neighboring columns.
    // TODO: do we want to expand the vertical touch areas for the top and bottom ball in a stack?  It may depend on
    // whether the Spread screen reduces the size of the balls, see https://github.com/phetsims/center-and-spread/issues/28
    this.touchArea = this.localBounds.dilatedX( 10 );

    // Prevent dragging or interaction while the object is animating
    casObject.isAnimatingProperty.link( isAnimating => {
      this.cursor = isAnimating ? null : 'pointer';
      this.pickable = !isAnimating;
    } );
  }
}

centerAndSpread.register( 'CASObjectNode', CASObjectNode );
export default CASObjectNode;