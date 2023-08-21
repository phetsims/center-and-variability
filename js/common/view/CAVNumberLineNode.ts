// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of NumberLineNode, that adds in a MeanIndicator and RangeNode.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 *
 */

import NumberLineNode, { NumberLineNodeOptions } from '../../../../soccer-common/js/view/NumberLineNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import { Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MeanIndicatorNode from './MeanIndicatorNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CAVColors from '../CAVColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';

//REVIEW document options
type SelfOptions = {
  includeRangeOnXAxis: boolean;
  includeMeanStroke: boolean;
};
type CAVNumberLineNodeOptions = SelfOptions & NumberLineNodeOptions;

export default class CAVNumberLineNode extends NumberLineNode {

  public constructor( meanValueProperty: TReadOnlyProperty<number | null>,
                      modelViewTransform: ModelViewTransform2,
                      isMeanIndicatorVisibleProperty: TReadOnlyProperty<boolean>,
                      rangeProperty: TReadOnlyProperty<Range | null>,
                      chartViewWidth: number,
                      physicalRange: Range,
                      providedOptions: CAVNumberLineNodeOptions ) {

    const options = optionize<CAVNumberLineNodeOptions, SelfOptions, NumberLineNodeOptions>()( {}, providedOptions );

    super( chartViewWidth, physicalRange, options );

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

    const meanIndicatorNode = new MeanIndicatorNode( options.includeMeanStroke, false );
    this.addChild( meanIndicatorNode );

    Multilink.multilink( [ meanValueProperty, isMeanIndicatorVisibleProperty ],
      ( meanValue, isMeanIndicatorVisible ) => {
        if ( meanValue !== null ) {

          // Account for the overall offset of the number line node itself (leftmost tick mark)
          const x = modelViewTransform.modelToViewX( meanValue ) - modelViewTransform.modelToViewX( physicalRange.min );
          meanIndicatorNode.centerTop = new Vector2( x, 0 );
        }
        meanIndicatorNode.visible = isMeanIndicatorVisible && meanValue !== null;
      } );
  }
}

centerAndVariability.register( 'CAVNumberLineNode', CAVNumberLineNode );