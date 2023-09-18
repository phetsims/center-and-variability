// Copyright 2023, University of Colorado Boulder

/**
 * CardDragCueNode is provides a cue that a card can be dragged. It appears on the leftmost card in the accordion box,
 * and displays a hand with an arrow that points to the left.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import centerAndVariability from '../../centerAndVariability.js';
import InteractiveCueArrowNode from '../../../../soccer-common/js/view/InteractiveCueArrowNode.js';
import { Image, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import dragIndicatorHand_png from '../../../images/dragIndicatorHand_png.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type CardDragCueNodeOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<NodeOptions, 'visibleProperty' | 'opacity'>;

export default class CardDragCueNode extends Node {

  public constructor( providedOptions?: CardDragCueNodeOptions ) {

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

    const options = optionize<CardDragCueNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ arrowNode, handNode ],
      pickable: false
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'CardDragCueNode', CardDragCueNode );