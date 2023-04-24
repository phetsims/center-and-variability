// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVPlotNode from '../../common/view/CAVPlotNode.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilityType from '../model/VariabilityType.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Utils from '../../../../dot/js/Utils.js';

export type CAVPlotOptions = NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VariabilityPlotNode extends CAVPlotNode {

  public constructor( model: VariabilityModel, numberLineWidth: number, providedOptions?: CAVPlotOptions ) {
    super( model, numberLineWidth, providedOptions );

    // TODO: Combine into a single node
    // TODO: Rename if we continue to use it here like this
    const rangeTextReadout = new Text( '', {
      font: new PhetFont( 13 )
    } );
    const rangeBars = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );
    const rangeRectangle = new Rectangle( 0, 50, 100, 70, {
      fill: '#c3fdb9',
      stroke: 'lightGray'
    } );
    this.addChild( rangeBars );
    this.addChild( rangeRectangle );
    this.addChild( rangeTextReadout );

    const modelViewTransform = this.modelViewTransform;

    const updateRangeNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( leftmostDot && model.isShowingRangeProperty.value && model.selectedVariabilityProperty.value === VariabilityType.RANGE ) {

        // assumes all of the dots have the same radius
        const rightmostDot = sortedDots[ sortedDots.length - 1 ];
        const left = modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );

        const floor = modelViewTransform.modelToViewY( 0 );
        rangeRectangle.rectWidth = right - left;
        rangeRectangle.left = left;
        rangeRectangle.bottom = floor;
        rangeRectangle.visible = true;
        rangeBars.setMedianBarShape( rangeRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, rangeRectangle.left, 0, rangeRectangle.right, false );

        // TODO: The design doc called for a decimal point, but I think we should omit it because it is always an integer
        rangeTextReadout.string = Utils.toFixed( rightmostDot.valueProperty.value! - leftmostDot.valueProperty.value!, 1 );
        rangeTextReadout.centerX = rangeRectangle.centerX;
        rangeTextReadout.bottom = rangeBars.top - 5;
        rangeBars.visible = true;
        rangeTextReadout.visible = true;
      }
      else {
        rangeRectangle.visible = false;
        rangeBars.visible = false;
        rangeTextReadout.visible = false;
      }
    };
    model.objectChangedEmitter.addListener( updateRangeNode );
    model.isShowingRangeProperty.link( updateRangeNode );
    model.selectedVariabilityProperty.link( updateRangeNode );

    rangeRectangle.moveToBack();
  }
}

centerAndVariability.register( 'VariabilityPlotNode', VariabilityPlotNode );