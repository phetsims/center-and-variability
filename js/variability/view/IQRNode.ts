// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Line, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import CAVConstants from '../../common/CAVConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VariabilityReadoutText from './VariabilityReadoutText.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type IQRNodeOptions = SelfOptions & StrictOmit<CAVPlotOptions, 'dataPointFill'>;

export default class IQRNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, providedOptions: IQRNodeOptions ) {

    const options = providedOptions;

    super( model, {
      dataPointFill: CAVColors.grayDataPointFill,
      ...options
    } );
    const iqrReadoutValueProperty = new DerivedProperty( [ model.rangeValueProperty ], rangeValue => {
      return rangeValue ? `${rangeValue}` : '?';
    } );

    // TODO: I think we need one of these in MadNode?
    const iqrReadoutText = new VariabilityReadoutText( iqrReadoutValueProperty, CenterAndVariabilityStrings.iqrEqualsValuePatternStringProperty,
      { fill: CAVColors.meanColorProperty, tandem: options.tandem.createTandem( 'iqrReadoutText' ), visibleProperty: model.isShowingIQRProperty } );
    this.addChild( iqrReadoutText );
    const iqrCheckbox = new Checkbox( model.isShowingIQRProperty, new Text( CenterAndVariabilityStrings.iqrStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ), {
      tandem: options.tandem.createTandem( 'iqrCheckbox' )
    } );
    this.addChild( iqrCheckbox );
    const needAtLeastFiveKicks = new Text( CenterAndVariabilityStrings.needAtLeastFiveKicksStringProperty, {
      fontSize: 18,
      top: 100
    } );
    this.addChild( needAtLeastFiveKicks );

    const iqrTextReadout = new Text( '', {
      font: new PhetFont( 13 )
    } );

    const iqrBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );
    const iqrRectangle = new Rectangle( 0, 50, 100, 70, {
      fill: '#99ffff'
    } );

    const BOX_CENTER_Y = 78;
    const BOX_HEIGHT = 25;
    const END_CAP_HEIGHT = 15;
    const BOX_STROKE_WIDTH = 2;
    const MEDIAN_STROKE_WIDTH = 3;
    const BOX_STROKE_COLOR = 'black';
    const MEDIAN_STROKE_COLOR = 'red';

    const boxWhiskerNode = new Node();

    const boxWhiskerMedianLine = new Line( 0, BOX_CENTER_Y - BOX_HEIGHT / 2, 0, BOX_CENTER_Y + BOX_HEIGHT / 2, {
      stroke: MEDIAN_STROKE_COLOR,
      lineWidth: MEDIAN_STROKE_WIDTH
    } );

    const boxWhiskerBox = new Rectangle( 0, BOX_CENTER_Y - BOX_HEIGHT / 2, 100, BOX_HEIGHT, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerLineLeft = new Line( 0, BOX_CENTER_Y, 0, BOX_CENTER_Y, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerLineRight = new Line( 0, BOX_CENTER_Y, 0, BOX_CENTER_Y, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerEndCapLeft = new Line( 0, BOX_CENTER_Y - END_CAP_HEIGHT / 2, 0, BOX_CENTER_Y + END_CAP_HEIGHT / 2, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerEndCapRight = new Line( 0, BOX_CENTER_Y - END_CAP_HEIGHT / 2, 0, BOX_CENTER_Y + END_CAP_HEIGHT / 2, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    boxWhiskerNode.addChild( boxWhiskerMedianLine );
    boxWhiskerNode.addChild( boxWhiskerBox );
    boxWhiskerNode.addChild( boxWhiskerLineLeft );
    boxWhiskerNode.addChild( boxWhiskerLineRight );
    boxWhiskerNode.addChild( boxWhiskerEndCapLeft );
    boxWhiskerNode.addChild( boxWhiskerEndCapRight );

    this.addChild( iqrBar );
    this.addChild( iqrRectangle );
    this.addChild( iqrTextReadout );
    this.addChild( boxWhiskerNode );

    iqrRectangle.moveToBack();

    const updateIQRNode = () => {

      const sortedDots = _.sortBy( model.getActiveSoccerBalls().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];
      const rightmostDot = sortedDots[ sortedDots.length - 1 ];

      const boxLeft = this.modelViewTransform.modelToViewX( model.q1ValueProperty.value! );
      const boxRight = this.modelViewTransform.modelToViewX( model.q3ValueProperty.value! );

      boxWhiskerMedianLine.x1 = boxWhiskerMedianLine.x2 = this.modelViewTransform.modelToViewX( model.medianValueProperty.value! );

      boxWhiskerBox.left = boxLeft - 0.5 * BOX_STROKE_WIDTH;
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

      const enoughData = model.numberOfDataPointsProperty.value >= 5;

      const iqrVisibility = true;// ( options.parentContext === 'info' && enoughData ) ||
      // ( options.parentContext === 'accordion' && enoughData && model.isShowingIQRProperty.value );

      iqrRectangle.visible = iqrVisibility;
      iqrBar.visible = iqrVisibility;
      iqrTextReadout.visible = iqrVisibility;

      if ( iqrVisibility ) {
        const floor = this.modelViewTransform.modelToViewY( 0 );
        iqrRectangle.rectWidth = boxRight - boxLeft;
        iqrRectangle.left = boxLeft;
        iqrRectangle.bottom = floor;

        // TODO: In the info dialog, this should be above the topmost data point (in the accordion box it's ok to overlap)
        iqrBar.setMedianBarShape( iqrRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, iqrRectangle.left, 0, iqrRectangle.right, false );

        // TODO: Should we have model.iqrValueProperty?
        iqrTextReadout.string = model.q3ValueProperty.value! - model.q1ValueProperty.value!;
        iqrTextReadout.centerX = iqrRectangle.centerX;
        iqrTextReadout.bottom = iqrBar.top - 5;
      }

      boxWhiskerNode.visible = model.selectedVariabilityProperty.value === VariabilityMeasure.IQR && enoughData;

      needAtLeastFiveKicks.center = this.modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastFiveKicks.visible = !enoughData && ( options.parentContext === 'info' ||
                                                      ( options.parentContext === 'accordion' && model.isShowingIQRProperty.value ) );
    };
    model.objectChangedEmitter.addListener( updateIQRNode );
    model.isShowingIQRProperty.link( updateIQRNode );
    model.selectedVariabilityProperty.link( updateIQRNode );
    model.numberOfDataPointsProperty.link( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );