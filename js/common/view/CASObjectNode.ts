// Copyright 2022, University of Colorado Boulder

/**
 * Base class which renders a Node for the CASObject.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import CASObject from '../model/CASObject.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type CASObjectNodeSelfOptions = {
  contentNode: Node
};
export type CASObjectNodeOptions = CASObjectNodeSelfOptions & NodeOptions;

class CASObjectNode extends Node {

  constructor( casObject: CASObject, modelViewTransform: ModelViewTransform2, providedOptions: CASObjectNodeOptions ) {
    const options = optionize<CASObjectNodeOptions>( {}, providedOptions );
    super( options );

    this.maxWidth = modelViewTransform.modelToViewDeltaX( casObject.radius * 2 );
    this.maxHeight = this.maxWidth;
    this.addChild( options.contentNode );

    casObject.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

centerAndSpread.register( 'CASObjectNode', CASObjectNode );
export default CASObjectNode;