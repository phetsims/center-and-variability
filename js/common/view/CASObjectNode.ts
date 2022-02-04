// Copyright 2022, University of Colorado Boulder

/**
 * Base class which renders a Node for the CASObject.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import CASObject from '../model/CASObject.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CASObjectType from '../model/CASObjectType.js';
import ball_png from '../../../images/ball_png.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';

type CASObjectNodeSelfOptions = {};
export type CASObjectNodeOptions = CASObjectNodeSelfOptions & NodeOptions;

class CASObjectNode extends Node {

  constructor( casObject: CASObject, modelViewTransform: ModelViewTransform2, providedOptions?: CASObjectNodeOptions ) {
    const options = optionize<CASObjectNodeOptions>( {
      phetioDynamicElement: true
    }, providedOptions );
    super( options );

    this.maxWidth = modelViewTransform.modelToViewDeltaX( casObject.radius * 2 );
    this.maxHeight = this.maxWidth;
    this.addChild( casObject.objectType === CASObjectType.SOCCER_BALL ? new Image( ball_png ) :
                   new ShadedSphereNode( casObject.radius * 2 ) );

    casObject.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

centerAndSpread.register( 'CASObjectNode', CASObjectNode );
export default CASObjectNode;