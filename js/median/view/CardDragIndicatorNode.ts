// Copyright 2023-2024, University of Colorado Boulder

/**
 * CardDragIndicatorNode visualizes a draggable cue for cards, displaying an arrow and hand symbol on the
 * leftmost card of the accordion box. It signals that the card can be interactively moved.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import centerAndVariability from '../../centerAndVariability.js';
import InteractiveCueArrowNode from '../../../../scenery-phet/js/accessibility/group-sort/view/InteractiveCueArrowNode.js';
import { Image, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import dragIndicatorHand_png from '../../../images/dragIndicatorHand_png.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type CardDragIndicatorNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'visibleProperty'>;

export default class CardDragIndicatorNode extends Node {

  public constructor( providedOptions?: CardDragIndicatorNodeOptions ) {

    const arrowNode = new InteractiveCueArrowNode( {
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