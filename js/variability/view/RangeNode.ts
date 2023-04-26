// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Rectangle, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';
import CAVObjectType from '../../common/model/CAVObjectType.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type RangeNodeOptions = SelfOptions & CAVPlotOptions;

export default class RangeNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, providedOptions: RangeNodeOptions ) {

    const options = providedOptions;

    super( model, options );

    const needAtLeastOneKick = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      top: 100
    } );
    this.addChild( needAtLeastOneKick );

    // TODO: Combine into a single node?
    const rangeTextReadout = new Text( '', {
      font: new PhetFont( 13 )
    } );

    // TODO: Rename if we continue to use it here like this
    const rangeBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );
    const rectangleHeight = 70;
    const rangeRectangle = new Rectangle( 0, 50, 100, rectangleHeight, {
      fill: '#c3fdb9',
      stroke: 'lightGray'
    } );
    this.addChild( rangeBar );
    this.addChild( rangeRectangle );
    this.addChild( rangeTextReadout );

    const updateRangeNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];
      const rightmostDot = sortedDots[ sortedDots.length - 1 ];

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      const hasNonZeroRange = leftmostDot &&
                              rightmostDot &&
                              leftmostDot.valueProperty.value !== rightmostDot.valueProperty.value;
      if ( hasNonZeroRange ) {
        const left = this.modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        const right = this.modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );
        const highestYValue = this.modelViewTransform.modelToViewY(
          _.maxBy( sortedDots, dot => dot.positionProperty.value.y )!.positionProperty.value.y );


        const floor = this.modelViewTransform.modelToViewY( 0 );

        if ( options.parentContext === 'info' ) {
          rangeRectangle.rectHeight = Math.max( floor - highestYValue + this.modelViewTransform.modelToViewDeltaX( CAVObjectType.DATA_POINT.radius ),
            rectangleHeight );
        }
        rangeRectangle.rectWidth = right - left;
        rangeRectangle.left = left;
        rangeRectangle.bottom = floor;

        rangeBar.setMedianBarShape( rangeRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, rangeRectangle.left, 0, rangeRectangle.right, false );

        // TODO: How to simplify this logic? Or will it help when things are combined?
        rangeTextReadout.string = rightmostDot.valueProperty.value! - leftmostDot.valueProperty.value!;
        rangeTextReadout.centerX = rangeRectangle.centerX;
        rangeTextReadout.bottom = rangeBar.top - 5;
      }
      const rangeVisibility = ( options.parentContext === 'info' && hasNonZeroRange ) ||
                              ( options.parentContext === 'accordion' && hasNonZeroRange && model.isShowingRangeProperty.value );
      rangeRectangle.visible = rangeVisibility;
      rangeBar.visible = rangeVisibility;
      rangeTextReadout.visible = rangeVisibility;
      needAtLeastOneKick.center = this.modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastOneKick.visible = model.numberOfDataPointsProperty.value === 0 && ( options.parentContext === 'info' ||
                                                                                     ( options.parentContext === 'accordion' && model.isShowingRangeProperty.value ) );
    };
    model.objectChangedEmitter.addListener( updateRangeNode );
    model.isShowingRangeProperty.link( updateRangeNode );
    model.selectedVariabilityProperty.link( updateRangeNode );
    model.numberOfDataPointsProperty.link( updateRangeNode );
    rangeRectangle.moveToBack();
  }
}

centerAndVariability.register( 'RangeNode', RangeNode );