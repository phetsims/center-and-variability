// Copyright 2022-2023, University of Colorado Boulder

/**
 * A double-headed arrow used to indicate something can be dragged horizontally.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';
import soccerCommon from '../../soccer-common/soccerCommon.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;
type DragIndicatorArrowNodeOptions = PickRequired<ArrowNodeOptions, 'tandem'> & Pick<ArrowNodeOptions, 'visible'> & NodeOptions;

export default class DragIndicatorArrowNode extends ArrowNode {

  public constructor( options: DragIndicatorArrowNodeOptions ) {

    super( 0, 0, 35, 0, optionize<DragIndicatorArrowNodeOptions, SelfOptions, ArrowNodeOptions>()( {
      headHeight: 8,
      headWidth: 12,
      tailWidth: 5,
      doubleHead: true,
      fill: CAVColors.dragIndicatorColorProperty,
      stroke: CAVColors.arrowStrokeProperty,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH
    }, options ) );
  }
}

soccerCommon.register( 'DragIndicatorArrowNode', DragIndicatorArrowNode );
