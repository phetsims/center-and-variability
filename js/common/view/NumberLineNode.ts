// Copyright 2022, University of Colorado Boulder

/**
 * A number line for displaying data objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Color, Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import CASColors from '../CASColors.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// constants
const TICK_MARK_EXTENT = 10;

type NumberLineNodeSelfOptions = {
  color?: PaintDef;
  includeXAxis?: boolean;
};
export type NumberLineNodeOptions = NumberLineNodeSelfOptions & NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class NumberLineNode extends Node {

  constructor( range: Range, width: number, meanValueProperty: IReadOnlyProperty<number | null>,
               isShowingMeanIndicatorProperty: IReadOnlyProperty<boolean>, providedOptions?: NumberLineNodeOptions ) {

    const options = optionize<NumberLineNodeOptions, NumberLineNodeSelfOptions, NodeOptions>( {
      color: Color.WHITE,
      includeXAxis: false,
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

    let originY = tickMarkSet.top;

    // override our localBounds so they don't change since moving the tick marks/labels for the x-axis or adding the
    // mean triangle can cause visual shifting from changing bounds
    this.localBounds = this.localBounds.copy();

    if ( options.includeXAxis ) {

      // TODO from CK: this feels like the wrong way to do this
      // shift the number line up so 0 is on the x-axis
      tickMarkSet.y = -TICK_MARK_EXTENT / 2;
      tickLabelSet.y = -TICK_MARK_EXTENT / 2;
      originY = tickMarkSet.centerY;

      const xAxisNode = new Path( new Shape()
        .moveTo( tickMarkSet.left, originY )
        .lineTo( tickMarkSet.right, originY ), {
        stroke: options.color
      } );
      this.addChild( xAxisNode );
    }

    // TODO: Can we make a 2d MVT since that's all that's needed here?
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( range.min, 0, range.max, range.getLength() ),
      new Bounds2( 0, originY - width, width, width )
    );

    const meanIndicatorNode = NumberLineNode.createMeanIndicatorNode();
    this.addChild( meanIndicatorNode );

    Property.multilink( [ meanValueProperty, isShowingMeanIndicatorProperty ],
      ( meanValue: number | null, isShowingMeanIndicator: boolean ) => {
        if ( meanValue !== null ) {
          meanIndicatorNode.translation = new Vector2( modelViewTransform.modelToViewX( meanValue ), originY );
        }
        meanIndicatorNode.visible = isShowingMeanIndicator && meanValue !== null;
      } );

    this.mutate( options );
  }

  static createMeanIndicatorNode() {
    const TRIANGLE_LENGTH = 15;
    const TRIANGLE_ALTITUDE = 13;
    const TRIANGLE_SHAPE = new Shape().moveTo( 0, 0 )
      .lineTo( -TRIANGLE_LENGTH / 2, TRIANGLE_ALTITUDE )
      .lineToRelative( TRIANGLE_LENGTH, 0 )
      .lineTo( 0, 0 );

    return new Path( TRIANGLE_SHAPE, {
      fill: CASColors.meanColorProperty
    } );
  }
}

centerAndSpread.register( 'NumberLineNode', NumberLineNode );
export default NumberLineNode;