// Copyright 2023, University of Colorado Boulder

/**
 * The thumb node for the PredictionSlider. Is made up of an Arrow and ShadedSphere.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Line, Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import CAVColors from '../CAVColors.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../../phet-core/js/optionize.js';
import SoccerCommonColors from '../../soccer-common/SoccerCommonColors.js';
import CAVConstants from '../CAVConstants.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {
  color: TColor;
  style: 'line' | 'arrow';
};

export type PredictionThumbNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'tandem'>;

export default class PredictionThumbNode extends Node {

  public constructor( providedOptions: PredictionThumbNodeOptions ) {

    const shadedSphereNode = new ShadedSphereNode( 16, {
      mainColor: providedOptions.color,
      stroke: SoccerCommonColors.arrowStrokeProperty,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH
    } );

    // Expand the mouse and touch area to encompass the arrow/line
    const oldBounds = shadedSphereNode.localBounds;
    const expandedArea = new Bounds2( oldBounds.minX, oldBounds.minY - 40, oldBounds.maxX, oldBounds.maxY + 5 );
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
      new Line( 0, 0, 0, -50, {
        stroke: CAVColors.playAreaIntervalToolHandleLineStrokeProperty,
        lineWidth: 1
      } );

    const options = optionize<PredictionThumbNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ indicatorNode, shadedSphereNode ]
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'PredictionThumbNode', PredictionThumbNode );