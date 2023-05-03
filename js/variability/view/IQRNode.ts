// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Line, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VariabilityReadoutText from './VariabilityReadoutText.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type IQRNodeOptions = SelfOptions & StrictOmit<CAVPlotOptions, 'dataPointFill'>;

export default class IQRNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, providedOptions: IQRNodeOptions ) {

    const options = providedOptions;

    super( model, sceneModel, {
      dataPointFill: CAVColors.grayDataPointFill,
      ...options
    } );


    if ( providedOptions.parentContext === 'accordion' ) {
      const iqrReadoutValueProperty = new DerivedProperty( [ sceneModel.iqrValueProperty ], iqrValue => {
        return iqrValue ? `${iqrValue}` : '?';
      } );

      const iqrReadoutText = new VariabilityReadoutText( iqrReadoutValueProperty, CenterAndVariabilityStrings.iqrEqualsValuePatternStringProperty, {
        fill: CAVColors.meanColorProperty,
        visibleProperty: model.isShowingIQRProperty,
        right: this.left,
        y: this.centerY,
        tandem: options.tandem.createTandem( 'iqrReadoutText' )
      } );
      this.addChild( iqrReadoutText );
    }

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

    const iqrInfoBar = new MedianBarNode( {
      notchDirection: 'up',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );

    const iqrRectangle = new Rectangle( 0, 50, 100, 70, {
      fill: '#99ffff'
    } );

    const INFO_ARROW_LENGTH = 25;
    const MEDIAN_ARROW_OFFSET_Y = -90;

    const medianTextLabel = new Text( '', { fontSize: 18, fill: 'red' } );
    const medianArrowNode = new ArrowNode( 0, 0, 0, 0, { fill: 'red', stroke: 'white' } );
    this.addChild( medianTextLabel );
    this.addChild( medianArrowNode );


    const BOX_CENTER_Y = options.parentContext === 'info' ? -20 : 78;
    const BOX_HEIGHT = 25;
    const END_CAP_HEIGHT = 15;
    const BOX_STROKE_WIDTH = 2;
    const MEDIAN_STROKE_WIDTH = 3;
    const BOX_STROKE_COLOR = 'black';
    const MEDIAN_STROKE_COLOR = 'red';

    const boxWhiskerNode = new Node();
    boxWhiskerNode.y = BOX_CENTER_Y;

    const boxWhiskerMedianLine = new Line( 0, -BOX_HEIGHT / 2, 0, BOX_HEIGHT / 2, {
      stroke: MEDIAN_STROKE_COLOR,
      lineWidth: MEDIAN_STROKE_WIDTH
    } );

    const boxWhiskerBox = new Rectangle( 0, -BOX_HEIGHT / 2, 100, BOX_HEIGHT, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerLineLeft = new Line( 0, 0, 0, 0, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerLineRight = new Line( 0, 0, 0, 0, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerEndCapLeft = new Line( 0, -END_CAP_HEIGHT / 2, 0, END_CAP_HEIGHT / 2, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerEndCapRight = new Line( 0, -END_CAP_HEIGHT / 2, 0, END_CAP_HEIGHT / 2, {
      stroke: BOX_STROKE_COLOR,
      lineWidth: BOX_STROKE_WIDTH
    } );

    boxWhiskerNode.addChild( iqrTextReadout );
    boxWhiskerNode.addChild( iqrBar );
    boxWhiskerNode.addChild( iqrInfoBar );
    boxWhiskerNode.addChild( boxWhiskerMedianLine );
    boxWhiskerNode.addChild( boxWhiskerBox );
    boxWhiskerNode.addChild( boxWhiskerLineLeft );
    boxWhiskerNode.addChild( boxWhiskerLineRight );
    boxWhiskerNode.addChild( boxWhiskerEndCapLeft );
    boxWhiskerNode.addChild( boxWhiskerEndCapRight );

    this.addChild( iqrRectangle );
    this.addChild( boxWhiskerNode );

    iqrRectangle.moveToBack();

    const infoNumberLabels = new Node();

    infoNumberLabels.y = -40;

    const minTextLabel = new Text( '', { fontSize: 18 } );
    const maxTextLabel = new Text( '', { fontSize: 18 } );
    const q1TextLabel = new Text( '', { fontSize: 18 } );
    const q3TextLabel = new Text( '', { fontSize: 18 } );

    infoNumberLabels.addChild( minTextLabel );
    infoNumberLabels.addChild( maxTextLabel );
    infoNumberLabels.addChild( q1TextLabel );
    infoNumberLabels.addChild( q3TextLabel );

    this.addChild( infoNumberLabels );

    const updateIQRNode = () => {

      const sortedDots = _.sortBy( sceneModel.getActiveSoccerBalls().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];
      const rightmostDot = sortedDots[ sortedDots.length - 1 ];

      const q1 = sceneModel.q1ValueProperty.value!;
      const q3 = sceneModel.q3ValueProperty.value!;

      const boxLeft = this.modelViewTransform.modelToViewX( q1 );
      const boxRight = this.modelViewTransform.modelToViewX( q3 );

      const medianPositionX = this.modelViewTransform.modelToViewX( sceneModel.medianValueProperty.value! );
      boxWhiskerMedianLine.x1 = boxWhiskerMedianLine.x2 = medianPositionX;

      medianArrowNode.setTailAndTip( medianPositionX, MEDIAN_ARROW_OFFSET_Y, medianPositionX, MEDIAN_ARROW_OFFSET_Y + INFO_ARROW_LENGTH );
      medianTextLabel.string = 'median = ' + sceneModel.medianValueProperty.value!;
      medianTextLabel.centerX = medianPositionX;
      medianTextLabel.bottom = medianArrowNode.tailY - 6;

      boxWhiskerBox.left = boxLeft - 0.5 * BOX_STROKE_WIDTH;
      boxWhiskerBox.rectWidth = boxRight - boxLeft;

      if ( leftmostDot && rightmostDot ) {
        const min = leftmostDot.valueProperty.value!;
        const max = rightmostDot.valueProperty.value!;
        const minPositionX = this.modelViewTransform.modelToViewX( min );
        const maxPositionX = this.modelViewTransform.modelToViewX( max );

        boxWhiskerLineLeft.x1 = boxWhiskerEndCapLeft.x1 = boxWhiskerEndCapLeft.x2 = minPositionX;
        boxWhiskerLineLeft.x2 = boxLeft;

        boxWhiskerLineRight.x1 = boxRight;
        boxWhiskerLineRight.x2 = boxWhiskerEndCapRight.x1 = boxWhiskerEndCapRight.x2 = maxPositionX;

        boxWhiskerEndCapLeft.visible = boxLeft !== minPositionX;
        boxWhiskerEndCapRight.visible = boxRight !== maxPositionX;

        minTextLabel.string = min;
        maxTextLabel.string = max;
        minTextLabel.centerX = minPositionX;
        maxTextLabel.centerX = maxPositionX;
      }

      const enoughData = sceneModel.numberOfDataPointsProperty.value >= 5;

      const iqrVisibility = ( options.parentContext === 'accordion' && enoughData && model.isShowingIQRProperty.value );

      iqrRectangle.visible = iqrVisibility;
      iqrBar.visible = iqrVisibility || options.parentContext === 'info';
      iqrTextReadout.visible = iqrVisibility || options.parentContext === 'info';

      if ( iqrVisibility ) {
        const floor = this.modelViewTransform.modelToViewY( 0 );
        iqrRectangle.rectWidth = boxRight - boxLeft;
        iqrRectangle.left = boxLeft;
        iqrRectangle.bottom = floor;

        // TODO: In the info dialog, this should be above the topmost data point (in the accordion box it's ok to overlap)
        iqrBar.setMedianBarShape( iqrRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, iqrRectangle.left, 0, iqrRectangle.right, false );

        iqrTextReadout.string = sceneModel.iqrValueProperty.value!;
        iqrTextReadout.centerX = iqrRectangle.centerX;
        iqrTextReadout.bottom = iqrBar.top - 5;
      }

      boxWhiskerNode.visible = model.selectedVariabilityProperty.value === VariabilityMeasure.IQR && enoughData;

      needAtLeastFiveKicks.center = this.modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastFiveKicks.visible = !enoughData && ( options.parentContext === 'info' ||
                                                      ( options.parentContext === 'accordion' && model.isShowingIQRProperty.value ) );

      infoNumberLabels.visible = options.parentContext === 'info';
      iqrInfoBar.visible = options.parentContext === 'info';
      medianTextLabel.visible = options.parentContext === 'info';
      medianArrowNode.visible = options.parentContext === 'info';

      if ( options.parentContext === 'info' && q1 && q3 ) {
        q1TextLabel.centerX = boxLeft;
        q3TextLabel.centerX = boxRight;
        q1TextLabel.string = q1;
        q3TextLabel.string = q3;

        iqrInfoBar.setMedianBarShape( boxWhiskerNode.y + BOX_HEIGHT + MedianBarNode.NOTCH_HEIGHT + 20, boxLeft, 0, boxRight, false );
        iqrTextReadout.string = 'IQR = ' + sceneModel.iqrValueProperty.value!;
        iqrTextReadout.centerX = ( boxLeft + boxRight ) / 2;
        iqrTextReadout.top = iqrInfoBar.bottom + 5;
      }
    };

    sceneModel.objectChangedEmitter.addListener( updateIQRNode );
    model.isShowingIQRProperty.link( updateIQRNode );
    model.selectedVariabilityProperty.link( updateIQRNode );
    sceneModel.numberOfDataPointsProperty.link( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );