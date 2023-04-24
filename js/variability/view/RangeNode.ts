// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Rectangle, Text, Node } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityType from '../model/VariabilityType.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VariabilityModel from '../model/VariabilityModel.js';

export default class RangeNode extends Node {
  public constructor( model: VariabilityModel, modelViewTransform: ModelViewTransform2 ) {
    super();
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


    const updateRangeNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];
      const rightmostDot = sortedDots[ sortedDots.length - 1 ];

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( leftmostDot &&
           rightmostDot &&
           leftmostDot.valueProperty.value !== rightmostDot.valueProperty.value &&
           model.isShowingRangeProperty.value &&
           model.selectedVariabilityProperty.value === VariabilityType.RANGE ) {

        // assumes all of the dots have the same radius

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

centerAndVariability.register( 'RangeNode', RangeNode );