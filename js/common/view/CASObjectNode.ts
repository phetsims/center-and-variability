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
      phetioDynamicElement: true,
      cursor: 'pointer'
    }, providedOptions );
    super( options );

    this.maxWidth = modelViewTransform.modelToViewDeltaX( casObject.objectType.radius * 2 );
    this.maxHeight = this.maxWidth;
    const childNode = casObject.objectType === CASObjectType.SOCCER_BALL ? new Image( ball_png ) :
                      new ShadedSphereNode( casObject.objectType.radius * 2 );

    // Center the nested Node for compatibility with DragListener
    childNode.center = Vector2.ZERO;

    // TODO: Better comment that explains why this nested layer is necessary
    this.addChild( childNode );

    this.addLinkedElement( casObject, {
      tandem: options.tandem.createTandem( casObject.objectType === CASObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' ),
      phetioState: false
    } );

    casObject.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // TODO: Only allow dragging when isAnimatingProperty.value is false
    this.addInputListener( new DragListener( {
      positionProperty: casObject.positionProperty,
      transform: modelViewTransform
    } ) );
  }
}

centerAndSpread.register( 'CASObjectNode', CASObjectNode );
export default CASObjectNode;