// Copyright 2022, University of Colorado Boulder

/**
 * A number line for displaying data objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Color, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const TICK_MARK_EXTENT = 18;

type NumberLineNodeSelfOptions = {
  color?: PaintDef
};
export type NumberLineNodeOptions = NumberLineNodeSelfOptions & NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class NumberLineNode extends Node {

  constructor( range: Range, width: number, providedOptions?: NumberLineNodeOptions ) {

    const options = optionize<NumberLineNodeOptions, NumberLineNodeSelfOptions, NodeOptions>( {
      color: Color.WHITE,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super();

    const chartTransform = new ChartTransform( {
      viewWidth: width,
      modelXRange: range
    } );
    const tickMarkSet = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 1, {
      stroke: options.color,
      extent: TICK_MARK_EXTENT
    } );
    this.addChild( tickMarkSet );

    const tickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, {
      extent: TICK_MARK_EXTENT + 12,
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), {
        fontSize: 16,
        fill: options.color
      } )
    } );
    this.addChild( tickLabelSet );

    this.mutate( options );
  }
}

centerAndSpread.register( 'NumberLineNode', NumberLineNode );
export default NumberLineNode;