// Copyright 2022-2023, University of Colorado Boulder

/**
 * A number line for displaying data objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from '../soccerCommon.js';
import { Node, NodeOptions, Path, Text, TPaint } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CAVColors from '../../common/CAVColors.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVConstants from '../../common/CAVConstants.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = {
  color?: TPaint;
  includeXAxis: boolean;
  includeRangeOnXAxis: boolean;
  includeMeanStroke: boolean;
};
export type NumberLineNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class NumberLineNode extends Node {

  // For layout
  public readonly tickMarkSet: TickMarkSet;

  public constructor(
    meanValueProperty: TReadOnlyProperty<number | null>,
    modelViewTransform: ModelViewTransform2,
    isMeanIndicatorVisibleProperty: TReadOnlyProperty<boolean>,
    rangeProperty: TReadOnlyProperty<Range | null>,
    providedOptions?: NumberLineNodeOptions
  ) {

    const options = optionize<NumberLineNodeOptions, SelfOptions, NodeOptions>()( {
      color: 'white'
    }, providedOptions );

    super();

    // Tick marks on the dot plot are a little shorter than in the play area
    const tickMarkExtent = options.includeXAxis ? 7 : 10;

    const chartTransform = new ChartTransform( {
      viewWidth: CAVConstants.CHART_VIEW_WIDTH,
      modelXRange: CAVConstants.PHYSICAL_RANGE,
      viewHeight: tickMarkExtent / 2,
      modelYRange: new Range( 0, 1 )
    } );
    const tickMarkSet = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 1, {
      stroke: options.color,
      extent: tickMarkExtent
    } );
    this.addChild( tickMarkSet );

    this.tickMarkSet = tickMarkSet;

    const tickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, {
      extent: tickMarkExtent + 12,
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), {
        fontSize: 16,
        fill: options.color
      } )
    } );
    this.addChild( tickLabelSet );

    if ( options.includeXAxis ) {
      const xAxisNode = new Path( new Shape()
        .moveTo( tickMarkSet.left, 0 )
        .lineTo( tickMarkSet.right, 0 ), {
        stroke: options.color
      } );
      this.addChild( xAxisNode );

      if ( options.includeRangeOnXAxis ) {

        // For the dot plot on the Mean and Median screen, when "mean" is selected, there is a purple overlay on the x-axis (if there is an x-axis)
        const rangeNode = new Path( new Shape().moveTo( 0, 0 ).lineToRelative( 100, 0 ), {
          stroke: CAVColors.meanColorProperty,
          lineWidth: 3.2
        } );
        Multilink.multilink( [ rangeProperty, isMeanIndicatorVisibleProperty ],
          ( range, isMeanIndicatorVisible ) => {
            if ( range !== null ) {

              // Do not show any area or text above the data point if the range is 0
              rangeNode.shape = new Shape()
                .moveTo( modelViewTransform.modelToViewX( range.min ), 0 )
                .lineTo( modelViewTransform.modelToViewX( range.max ), 0 );
            }
            rangeNode.visible = isMeanIndicatorVisible && range !== null;
          } );

        this.addChild( rangeNode );
      }
    }

    const meanIndicatorNode = NumberLineNode.createMeanIndicatorNode( options.includeMeanStroke, false );
    this.addChild( meanIndicatorNode );

    Multilink.multilink( [ meanValueProperty, isMeanIndicatorVisibleProperty ],
      ( meanValue, isMeanIndicatorVisible ) => {
        if ( meanValue !== null ) {

          // Account for the overall offset of the number line node itself (leftmost tick mark)
          const x = modelViewTransform.modelToViewX( meanValue ) - modelViewTransform.modelToViewX( CAVConstants.PHYSICAL_RANGE.min );
          meanIndicatorNode.centerTop = new Vector2( x, 0 );
        }
        meanIndicatorNode.visible = isMeanIndicatorVisible && meanValue !== null;
      } );

    this.mutate( options );
  }

  public static createMeanIndicatorNode( includeStroke: boolean, isIcon: boolean ): Node {
    const TRIANGLE_LENGTH = 15;
    const TRIANGLE_ALTITUDE = 13;

    // This is a triangle that points up.  Start at the top center tip.
    const TRIANGLE_SHAPE = new Shape().moveTo( 0, 0 )

      // Moving counterclockwise
      .lineTo( -TRIANGLE_LENGTH / 2, TRIANGLE_ALTITUDE )
      .lineToRelative( TRIANGLE_LENGTH, 0 )
      .close();

    return new Path( TRIANGLE_SHAPE, {
      fill: CAVColors.meanColorProperty,
      stroke: includeStroke ? CAVColors.arrowStrokeProperty : null,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH
    } );
  }
}

soccerCommon.register( 'NumberLineNode', NumberLineNode );