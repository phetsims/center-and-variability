// Copyright 2022-2023, University of Colorado Boulder

/**
 * A double-headed arrow used to indicate something can be dragged horizontally.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from '../soccerCommon.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Image, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import soccerBallDragIndicatorHand_png from '../../../images/soccerBallDragIndicatorHand_png.js';
import soccerBallDragIndicatorArrow_png from '../../../images/soccerBallDragIndicatorArrow_png.js';

type SelfOptions = EmptySelfOptions;
type DragIndicatorArrowNodeOptions = WithRequired<NodeOptions, 'tandem'>;

export default class DragIndicatorHandAndArrowNode extends Node {

  public constructor( providedOptions: DragIndicatorArrowNodeOptions ) {

    const hand = new Image( soccerBallDragIndicatorHand_png, {
      scale: 0.08,
      layoutOptions: {
        align: 'left'
      }
    } );
    const arrow = new Image( soccerBallDragIndicatorArrow_png, {
      scale: 0.1,
      layoutOptions: {
        align: 'right'
      }
    } );

    const container = new VBox( {
      minContentWidth: 40,
      spacing: 10,
      children: [
        arrow,
        hand
      ]
    } );

    const options = optionize<DragIndicatorArrowNodeOptions, SelfOptions, NodeOptions>()( {
      children: [
        container
      ]
    }, providedOptions );

    super( options );
  }
}

soccerCommon.register( 'DragIndicatorHandAndArrowNode', DragIndicatorHandAndArrowNode );
