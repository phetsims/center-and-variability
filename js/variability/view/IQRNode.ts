// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Line, Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
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

      const textReadoutGroup = new VBox( {
        x: -110,
        y: this.centerY - 20,
        align: 'left',
        spacing: 10
      } );
      this.addChild( textReadoutGroup );

      const medianReadoutValueProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty, sceneModel.medianValueProperty ],
        numberOfDataPoints => {
          return numberOfDataPoints >= 1 ? `${sceneModel.medianValueProperty.value}` : '?';
        } );
      const iqrReadoutValueProperty = new DerivedProperty( [ sceneModel.iqrValueProperty ], iqrValue => {
        return iqrValue ? `${iqrValue}` : '?';
      } );

      const medianReadoutText = new VariabilityReadoutText( medianReadoutValueProperty, CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty, {
        fill: CAVColors.medianColorProperty,
        tandem: options.tandem.createTandem( 'medianReadoutText' )
      } );
      const iqrReadoutText = new VariabilityReadoutText( iqrReadoutValueProperty, CenterAndVariabilityStrings.iqrEqualsValuePatternStringProperty, {
        fill: CAVColors.iqrColorProperty,
        visibleProperty: model.isShowingIQRProperty,
        tandem: options.tandem.createTandem( 'iqrReadoutText' )
      } );

      textReadoutGroup.addChild( medianReadoutText );
      textReadoutGroup.addChild( iqrReadoutText );
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

    const iqrRectangle = new Rectangle( 0, 0, 0, 80, {
      fill: '#99ffff'
    } );

    const BOX_CENTER_Y = options.parentContext === 'info' ? -20 : 78;
    const BOX_HEIGHT = 25;
    const END_CAP_HEIGHT = 15;
    const BOX_STROKE_WIDTH = 2;

    const boxWhiskerNode = new Node();
    boxWhiskerNode.y = BOX_CENTER_Y;

    const boxWhiskerMedianLine = new Line( 0, -BOX_HEIGHT / 2, 0, BOX_HEIGHT / 2, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerBox = new Rectangle( 0, -BOX_HEIGHT / 2, 100, BOX_HEIGHT, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerLineLeft = new Line( 0, 0, 0, 0, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerLineRight = new Line( 0, 0, 0, 0, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerEndCapLeft = new Line( 0, -END_CAP_HEIGHT / 2, 0, END_CAP_HEIGHT / 2, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerEndCapRight = new Line( 0, -END_CAP_HEIGHT / 2, 0, END_CAP_HEIGHT / 2, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const medianTextLabel = new Text( new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty,
      { value: sceneModel.medianValueProperty } ), { fontSize: 18, fill: CAVColors.medianColorProperty } );

    const medianArrowNode = new ArrowNode( 0, 0, 0, 23, {
      fill: CAVColors.medianColorProperty,
      stroke: null,
      lineWidth: 0.2,
      headHeight: 10,
      headWidth: 14,
      maxHeight: 18,
      y: -31
    } );

    boxWhiskerNode.addChild( boxWhiskerMedianLine );
    boxWhiskerNode.addChild( boxWhiskerBox );
    boxWhiskerNode.addChild( boxWhiskerLineLeft );
    boxWhiskerNode.addChild( boxWhiskerLineRight );
    boxWhiskerNode.addChild( boxWhiskerEndCapLeft );
    boxWhiskerNode.addChild( boxWhiskerEndCapRight );
    boxWhiskerNode.addChild( medianTextLabel );
    boxWhiskerNode.addChild( medianArrowNode );

    this.addChild( iqrRectangle );
    this.addChild( boxWhiskerNode );
    this.addChild( iqrTextReadout );
    this.addChild( iqrBar );

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

      medianArrowNode.x = medianPositionX;
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

      const enoughDataForMedian = sceneModel.numberOfDataPointsProperty.value >= 1;
      const enoughDataForIQR = sceneModel.numberOfDataPointsProperty.value >= 5;
      const iqrVisibility = ( options.parentContext === 'accordion' && enoughDataForIQR && model.isShowingIQRProperty.value );

      boxWhiskerNode.visible = model.selectedVariabilityProperty.value === VariabilityMeasure.IQR && enoughDataForIQR;
      medianTextLabel.visible = options.parentContext === 'info';
      medianArrowNode.visible = enoughDataForMedian;

      needAtLeastFiveKicks.center = this.modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastFiveKicks.visible = !enoughDataForIQR && ( options.parentContext === 'info' ||
                                                            ( options.parentContext === 'accordion' && model.isShowingIQRProperty.value ) );

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

        iqrTextReadout.string = sceneModel.iqrValueProperty.value!;
        iqrTextReadout.centerX = iqrRectangle.centerX;
        iqrTextReadout.bottom = iqrBar.top - 5;
      }

      infoNumberLabels.visible = options.parentContext === 'info';

      if ( options.parentContext === 'info' && q1 && q3 ) {
        q1TextLabel.centerX = boxLeft;
        q3TextLabel.centerX = boxRight;
        q1TextLabel.string = q1;
        q3TextLabel.string = q3;
      }
    };

    sceneModel.objectChangedEmitter.addListener( updateIQRNode );
    model.isShowingIQRProperty.link( updateIQRNode );
    model.selectedVariabilityProperty.link( updateIQRNode );
    sceneModel.numberOfDataPointsProperty.link( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );