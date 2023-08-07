// Copyright 2023, University of Colorado Boulder

/**
 * Creates a dashed arrow use for the drag indicator in the ball play area and the cards play area.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { HBox, HBoxOptions, Node, Rectangle } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {
  numberOfDashes: number;
  doubleHead: boolean;
};

type DragIndicatorArrowNodeOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class DragIndicatorArrowNode extends HBox {

  public constructor( providedOptions: DragIndicatorArrowNodeOptions ) {

    const createArrowHead = ( pointDirection: 'right' | 'left' ) => {
      return new TriangleNode( {
        pointDirection: pointDirection,
        triangleWidth: 6,
        triangleHeight: 5,
        fill: 'black'
      } );
    };

    const dashes: Node[] = [];

    _.times( providedOptions.numberOfDashes, () => {
      dashes.push( new Rectangle( 0, 0, 2, 2, { fill: 'black' } ) );
    } );

    const options = optionize<DragIndicatorArrowNodeOptions, SelfOptions, HBoxOptions>()( {
      children: [
        createArrowHead( 'left' ),
        ...dashes,
        createArrowHead( 'right' )
      ],
      spacing: 2
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'DragIndicatorArrowNode', DragIndicatorArrowNode );