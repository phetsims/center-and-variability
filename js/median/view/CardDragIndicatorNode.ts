// Copyright 2023-2025, University of Colorado Boulder

/**
 * CardDragIndicatorNode visualizes a draggable cue for cards, displaying an arrow and hand symbol on the
 * leftmost card of the accordion box. It signals that the card can be interactively moved.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import dragIndicatorHand_png from '../../../../scenery-phet/images/dragIndicatorHand_png.js';
import SortCueArrowNode from '../../../../scenery-phet/js/accessibility/group-sort/view/SortCueArrowNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import centerAndVariability from '../../centerAndVariability.js';

type SelfOptions = EmptySelfOptions;

type CardDragIndicatorNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'visibleProperty'>;

export default class CardDragIndicatorNode extends Node {

  public constructor( providedOptions?: CardDragIndicatorNodeOptions ) {

    const arrowNode = new SortCueArrowNode( {
      doubleHead: false,
      dashWidth: 2,
      dashHeight: 1.8,
      numberOfDashes: 3,
      spacing: 1.5,
      triangleNodeOptions: {
        triangleWidth: 5,
        triangleHeight: 4.7
      }
    } );

    const handNode = new Image( dragIndicatorHand_png, {
      scale: 0.077,
      centerTop: arrowNode.leftTop.plusXY( -0.5, 0 )
    } );

    const options = optionize<CardDragIndicatorNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ arrowNode, handNode ],
      pickable: false
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'CardDragIndicatorNode', CardDragIndicatorNode );