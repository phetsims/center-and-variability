// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Rectangle, Text, Node, Line } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVConstants from '../../common/CAVConstants.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type IQRNodeOptions = SelfOptions & StrictOmit<CAVPlotOptions, 'dataPointFill'>;

export default class IQRNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, providedOptions: IQRNodeOptions ) {

    const options = providedOptions;

    super( model, {
      dataPointFill: CAVConstants.GRAY_DATA_POINT_FILL,
      ...options
    } );

    const needAtLeastFiveKicks = new Text( CenterAndVariabilityStrings.needAtLeastFiveKicksStringProperty, {
      fontSize: 18,
      top: 100
    } );
    this.addChild( needAtLeastFiveKicks );

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
      fill: '#99ffff',

      // TODO: I wasn't sure whether to make this transparent or moveToBack on the boxWhiskerNode.
      // TODO: Or do we want it fully opaque but in a background layer?
      opacity: 0.5
    } );

    const BOX_CENTER_Y = 78;
    const BOX_HEIGHT = 25;
    const END_CAP_HEIGHT = 15;

    const boxWhiskerNode = new Node();

    const boxWhiskerMedianLine = new Line( 0, BOX_CENTER_Y - BOX_HEIGHT / 2, 0, BOX_CENTER_Y + BOX_HEIGHT / 2, {
      stroke: 'red',
      lineWidth: 3
    } );

    const boxWhiskerBox = new Rectangle( 0, BOX_CENTER_Y - BOX_HEIGHT / 2, 100, BOX_HEIGHT, {
      stroke: 'black',
      lineWidth: 2
    } );

    const boxWhiskerLineLeft = new Line( 0, BOX_CENTER_Y, 0, BOX_CENTER_Y, {
      stroke: 'black',
      lineWidth: 2
    } );

    const boxWhiskerLineRight = new Line( 0, BOX_CENTER_Y, 0, BOX_CENTER_Y, {
      stroke: 'black',
      lineWidth: 2
    } );

    const boxWhiskerEndCapLeft = new Line( 0, BOX_CENTER_Y - END_CAP_HEIGHT / 2, 0, BOX_CENTER_Y + END_CAP_HEIGHT / 2, {
      stroke: 'black',
      lineWidth: 2
    } );

    const boxWhiskerEndCapRight = new Line( 0, BOX_CENTER_Y - END_CAP_HEIGHT / 2, 0, BOX_CENTER_Y + END_CAP_HEIGHT / 2, {
      stroke: 'black',
      lineWidth: 2
    } );

    boxWhiskerNode.addChild( iqrBar );
    boxWhiskerNode.addChild( iqrRectangle );
    boxWhiskerNode.addChild( iqrTextReadout );
    boxWhiskerNode.addChild( boxWhiskerMedianLine );
    boxWhiskerNode.addChild( boxWhiskerBox );
    boxWhiskerNode.addChild( boxWhiskerLineLeft );
    boxWhiskerNode.addChild( boxWhiskerLineRight );
    boxWhiskerNode.addChild( boxWhiskerEndCapLeft );
    boxWhiskerNode.addChild( boxWhiskerEndCapRight );
    this.addChild( boxWhiskerNode );

    const updateIQRNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];
      const rightmostDot = sortedDots[ sortedDots.length - 1 ];

      // TODO: switch to 'info' and update the rest of the file accordingly, https://github.com/phetsims/center-and-variability/issues/153
      const interestedInIQR = options.parentContext === 'accordion' || (
        model.isShowingIQRProperty.value &&
        model.selectedVariabilityProperty.value === VariabilityMeasure.IQR
      );

      boxWhiskerMedianLine.x1 = boxWhiskerMedianLine.x2 = this.modelViewTransform.modelToViewX( model.medianValueProperty.value! );

      const boxLeft = this.modelViewTransform.modelToViewX( model.q1ValueProperty.value! );
      const boxRight = this.modelViewTransform.modelToViewX( model.q3ValueProperty.value! );

      boxWhiskerBox.left = boxLeft;
      boxWhiskerBox.rectWidth = boxRight - boxLeft;

      if ( leftmostDot && rightmostDot ) {
        const minValue = this.modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        const maxValue = this.modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );

        boxWhiskerLineLeft.x1 = boxWhiskerEndCapLeft.x1 = boxWhiskerEndCapLeft.x2 = minValue;
        boxWhiskerLineLeft.x2 = boxLeft;

        boxWhiskerLineRight.x1 = boxRight;
        boxWhiskerLineRight.x2 = boxWhiskerEndCapRight.x1 = boxWhiskerEndCapRight.x2 = maxValue;

        boxWhiskerEndCapLeft.visible = boxLeft !== minValue;
        boxWhiskerEndCapRight.visible = boxRight !== maxValue;
      }

      if ( interestedInIQR ) {

        if ( boxLeft !== boxRight ) {
          const floor = this.modelViewTransform.modelToViewY( 0 );
          iqrRectangle.rectWidth = boxRight - boxLeft;
          iqrRectangle.left = boxLeft;
          iqrRectangle.bottom = floor;

          // TODO: In the info dialog, this should be above the topmost data point (in the accordion box it's ok to overlap)
          iqrBar.setMedianBarShape( iqrRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, iqrRectangle.left, 0, iqrRectangle.right, false );

          // TODO: How to simplify this logic? Or will it help when things are combined?
          iqrTextReadout.string = model.q3ValueProperty.value! - model.q1ValueProperty.value!;
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

      const enoughData = model.numberOfDataPointsProperty.value >= 5;
      const showBoxAndWhiskerPlot = model.selectedVariabilityProperty.value === VariabilityMeasure.IQR && enoughData;

      boxWhiskerNode.visible = showBoxAndWhiskerPlot;

      needAtLeastFiveKicks.center = this.modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastFiveKicks.visible = model.selectedVariabilityProperty.value === VariabilityMeasure.IQR && !enoughData;
    };
    model.objectChangedEmitter.addListener( updateIQRNode );
    model.isShowingIQRProperty.link( updateIQRNode );
    model.selectedVariabilityProperty.link( updateIQRNode );
    model.numberOfDataPointsProperty.link( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );