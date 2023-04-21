// Copyright 2022, University of Colorado Boulder
/**
 * The thumb node for the PreditionSlider. Is made up of an Arrow and ShadedSphere.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  color: TColor;
};

export type PredictionThumbNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'tandem'>;

export default class PredictionThumbNode extends Node {

  public constructor( providedOptions: PredictionThumbNodeOptions ) {

    const shadedSphereNode = new ShadedSphereNode( 16, {

      // TODO-DESIGN: This looks more orange in the mockup.  Use colorblind red?
      mainColor: providedOptions.color,
      stroke: CAVColors.arrowStrokeProperty,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH
    } );

    // TODO-DESIGN: The mockup shows different arrowheads.
    const arrowNode = new ArrowNode( 0, 0, 0, -50, {
      headHeight: 10,
      headWidth: 14,
      tailWidth: 2,
      fill: providedOptions.color,
      stroke: CAVColors.arrowStrokeProperty,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH
    } );

    const options = optionize<PredictionThumbNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ arrowNode, shadedSphereNode ]
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'PredictionThumbNode', PredictionThumbNode );