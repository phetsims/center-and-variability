// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Rectangle, Text, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VariabilityModel from '../model/VariabilityModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

type SelfOptions = {
  staticDisplay?: VariabilityMeasure | null;
};
type RangeNodeOptions = SelfOptions & NodeOptions;

export default class RangeNode extends Node {
  public constructor( model: VariabilityModel, modelViewTransform: ModelViewTransform2, providedOptions?: RangeNodeOptions ) {

    const options = optionize<RangeNodeOptions, SelfOptions, NodeOptions>()( {
      staticDisplay: null
    }, providedOptions );

    super();

    const needAtLeastOneKick = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      top: 100
    } );
    this.addChild( needAtLeastOneKick );

    // TODO: Combine into a single node
    // TODO: Rename if we continue to use it here like this
    const rangeTextReadout = new Text( '', {
      font: new PhetFont( 13 )
    } );
    const rangeBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );
    const rangeRectangle = new Rectangle( 0, 50, 100, 70, {
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

      const interestedInRange = options.staticDisplay === VariabilityMeasure.RANGE || (
        model.isShowingRangeProperty.value &&
        model.selectedVariabilityProperty.value === VariabilityMeasure.RANGE
      );
      if ( interestedInRange ) {

        // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
        if ( leftmostDot &&
             rightmostDot &&
             leftmostDot.valueProperty.value !== rightmostDot.valueProperty.value
        ) {

          // assumes all of the dots have the same radius

          const left = modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
          const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );

          const floor = modelViewTransform.modelToViewY( 0 );
          rangeRectangle.rectWidth = right - left;
          rangeRectangle.left = left;
          rangeRectangle.bottom = floor;
          rangeRectangle.visible = true;

          // TODO: In the info dialog, this should be above the topmost data point (in the accordion box it's ok to overlap)
          rangeBar.setMedianBarShape( rangeRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, rangeRectangle.left, 0, rangeRectangle.right, false );

          // TODO: How to simplify this logic? Or will it help when things are combined?
          rangeTextReadout.string = rightmostDot.valueProperty.value! - leftmostDot.valueProperty.value!;
          rangeTextReadout.centerX = rangeRectangle.centerX;
          rangeTextReadout.bottom = rangeBar.top - 5;
          rangeBar.visible = true;
          rangeTextReadout.visible = true;
        }
        else {
          rangeRectangle.visible = false;
          rangeBar.visible = false;
          rangeTextReadout.visible = false;
        }
      }
      else {
        rangeRectangle.visible = false;
        rangeBar.visible = false;
        rangeTextReadout.visible = false;
      }

      needAtLeastOneKick.center = modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastOneKick.visible = model.numberOfDataPointsProperty.value === 0 && interestedInRange;
    };
    model.objectChangedEmitter.addListener( updateRangeNode );
    model.isShowingRangeProperty.link( updateRangeNode );
    model.selectedVariabilityProperty.link( updateRangeNode );
    model.numberOfDataPointsProperty.link( updateRangeNode );
  }
}

centerAndVariability.register( 'RangeNode', RangeNode );