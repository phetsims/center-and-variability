// Copyright 2022-2023, University of Colorado Boulder

/**
 * A double-headed arrow used to indicate something can be dragged horizontally.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import soccerCommon from '../soccerCommon.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import SoccerCommonColors from '../SoccerCommonColors.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type DragIndicatorArrowNodeOptions = WithRequired<NodeOptions, 'tandem'>;

export default class DragIndicatorHandAndArrowNode extends Node {

  public constructor( providedOptions: DragIndicatorArrowNodeOptions ) {

    const createArrow = ( direction: 'left' | 'right' ) => {
      return new ArrowNode( 0, 0, 15 * ( direction === 'left' ? -1 : 1 ), 0, optionize<DragIndicatorArrowNodeOptions, SelfOptions, ArrowNodeOptions>()( {
        headHeight: 9,
        headWidth: 14,
        tailWidth: 6,
        doubleHead: false,
        fill: SoccerCommonColors.dragIndicatorColorProperty,
        lineWidth: 1.2
      } ) );
    };

    const options = optionize<DragIndicatorArrowNodeOptions, SelfOptions, NodeOptions>()( {
      children: [
        new HBox( {
          spacing: 26,
          children: [
            createArrow( 'left' ),
            createArrow( 'right' )
          ]
        } )
      ]
    }, providedOptions );

    super( options );
  }
}

soccerCommon.register( 'DragIndicatorHandAndArrowNode', DragIndicatorHandAndArrowNode );
