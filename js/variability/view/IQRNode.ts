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
type IQRNodeOptions = SelfOptions & NodeOptions;

export default class IQRNode extends Node {
  public constructor( model: VariabilityModel, modelViewTransform: ModelViewTransform2, providedOptions?: IQRNodeOptions ) {

    const options = optionize<IQRNodeOptions, SelfOptions, NodeOptions>()( {
      staticDisplay: null
    }, providedOptions );

    super();

    const needAtLeastOneKick = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      top: 100
    } );
    this.addChild( needAtLeastOneKick );

    // TODO: Combine into a single node?
    const iqrTextReadout = new Text( '', {
      font: new PhetFont( 13 )
    } );

    // TODO: Rename if we continue to use it here like this
    const iqrBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );
    const iqrRectangle = new Rectangle( 0, 50, 100, 70, {
      fill: '#c3fdb9',
      stroke: 'lightGray'
    } );
    this.addChild( iqrBar );
    this.addChild( iqrRectangle );
    this.addChild( iqrTextReadout );

    const updateIQRNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];
      const rightmostDot = sortedDots[ sortedDots.length - 1 ];

      const interestedInIQR = options.staticDisplay === VariabilityMeasure.IQR || (
        model.isShowingIQRProperty.value &&
        model.selectedVariabilityProperty.value === VariabilityMeasure.IQR
      );
      if ( interestedInIQR ) {

        // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
        if ( leftmostDot &&
             rightmostDot &&
             leftmostDot.valueProperty.value !== rightmostDot.valueProperty.value
        ) {

          // assumes all of the dots have the same radius

          const left = modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
          const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );

          const floor = modelViewTransform.modelToViewY( 0 );
          iqrRectangle.rectWidth = right - left;
          iqrRectangle.left = left;
          iqrRectangle.bottom = floor;

          // TODO: In the info dialog, this should be above the topmost data point (in the accordion box it's ok to overlap)
          iqrBar.setMedianBarShape( iqrRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, iqrRectangle.left, 0, iqrRectangle.right, false );

          // TODO: How to simplify this logic? Or will it help when things are combined?
          iqrTextReadout.string = rightmostDot.valueProperty.value! - leftmostDot.valueProperty.value!;
          iqrTextReadout.centerX = iqrRectangle.centerX;
          iqrTextReadout.bottom = iqrBar.top - 5;

          iqrRectangle.visible = true;
          iqrBar.visible = true;
          iqrTextReadout.visible = true;
        }
        else {
          iqrRectangle.visible = false;
          iqrBar.visible = false;
          iqrTextReadout.visible = false;
        }
      }
      else {
        iqrRectangle.visible = false;
        iqrBar.visible = false;
        iqrTextReadout.visible = false;
      }

      needAtLeastOneKick.center = modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastOneKick.visible = model.numberOfDataPointsProperty.value === 0 && interestedInIQR;
    };
    model.objectChangedEmitter.addListener( updateIQRNode );
    model.isShowingIQRProperty.link( updateIQRNode );
    model.selectedVariabilityProperty.link( updateIQRNode );
    model.numberOfDataPointsProperty.link( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );