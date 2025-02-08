// Copyright 2023-2025, University of Colorado Boulder

/**
 * PredictionThumbNode is a visual handle for the PredictionSlider. Is made up of an Arrow and ShadedSphere.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import SoccerCommonColors from '../../../../soccer-common/js/SoccerCommonColors.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';

type SelfOptions = {
  color: TColor;
  style: 'line' | 'arrow';
};

export type PredictionThumbNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'tandem'>;

export default class PredictionThumbNode extends Node {

  public constructor( providedOptions: PredictionThumbNodeOptions ) {

    const sphereDiameter = 16;
    const shadedSphereNode = new ShadedSphereNode( sphereDiameter, {
      mainColor: providedOptions.color,
      stroke: SoccerCommonColors.arrowStrokeProperty,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH
    } );

    // Expand the pointer area to encompass the arrow if there is one, otherwise add equal margins above/below the sphere
    const oldBounds = shadedSphereNode.localBounds;
    const boundsHeightBelowSphere = 5;
    const boundsHeightAboveSphere = providedOptions.style === 'arrow' ? 40 : boundsHeightBelowSphere;
    const expandedArea = new Bounds2( oldBounds.minX, oldBounds.minY - boundsHeightAboveSphere, oldBounds.maxX, oldBounds.maxY + boundsHeightBelowSphere );
    shadedSphereNode.mouseArea = expandedArea;
    shadedSphereNode.touchArea = expandedArea;

    const indicatorNode =
      providedOptions.style === 'arrow' ?

        // Arrows for Median and Mean & Median screens.
      new ArrowNode( 0, 0, 0, -43, {
        headHeight: 10,
        headWidth: 14,
        tailWidth: 2,
        fill: providedOptions.color,
        stroke: SoccerCommonColors.arrowStrokeProperty,
        lineWidth: CAVConstants.ARROW_LINE_WIDTH
      } ) :

        // Lines for the Interval Tool Node in the Variability screen
      new Line( 0, -0.5 * sphereDiameter, 0, -63, {
        stroke: CAVColors.intervalToolStrokeProperty,
        lineWidth: 1
      } );

    const options = optionize<PredictionThumbNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ indicatorNode, shadedSphereNode ],
      isDisposable: false
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'PredictionThumbNode', PredictionThumbNode );