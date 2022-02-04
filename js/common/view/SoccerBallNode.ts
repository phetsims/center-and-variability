// Copyright 2022, University of Colorado Boulder

/**
 * Renders a soccer ball using a raster image.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import { Image } from '../../../../scenery/js/imports.js';
import CASObject from '../model/CASObject.js';
import CASObjectNode, { CASObjectNodeOptions } from './CASObjectNode.js';
import ball_png from '../../../images/ball_png.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type SoccerBallNodeSelfOptions = {};
export type SoccerBallNodeOptions = SoccerBallNodeSelfOptions & Omit<CASObjectNodeOptions, 'contentNode'>;

class SoccerBallNode extends CASObjectNode {
  constructor( casObject: CASObject, modelViewTransform: ModelViewTransform2, providedOptions: SoccerBallNodeOptions ) {

    // TODO: Why do we have to specify 'contentNode'?
    const options = optionize<SoccerBallNodeOptions, SoccerBallNodeSelfOptions, CASObjectNodeOptions, 'contentNode'>( {
      contentNode: new Image( ball_png )
    }, providedOptions );
    super( casObject, modelViewTransform, options );
  }
}

centerAndSpread.register( 'SoccerBallNode', SoccerBallNode );
export default SoccerBallNode;