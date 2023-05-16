// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Circle, Line, ManualConstraint, Node, ProfileColorProperty, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import CAVConstants from '../../common/CAVConstants.js';

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

    const needAtLeastFiveKicksText = new Text( CenterAndVariabilityStrings.needAtLeastFiveKicksStringProperty, {
      fontSize: 18,
      top: 100,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH
    } );
    ManualConstraint.create( this, [ needAtLeastFiveKicksText ], textProxy => {
      needAtLeastFiveKicksText.center = this.modelViewTransform.modelToViewXY( 8, 2 );
    } );
    this.addChild( needAtLeastFiveKicksText );

    const BOX_WHISKER_OFFSET_Y = options.parentContext === 'info' ? 5 : 3;
    const BOX_HEIGHT = 25;
    const END_CAP_HEIGHT = 15;
    const BOX_STROKE_WIDTH = 2;

    const boxWhiskerNode = new Node();
    boxWhiskerNode.y = this.modelViewTransform.modelToViewY( BOX_WHISKER_OFFSET_Y );

    const iqrBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );
    const iqrBarLabel = new Text( '', {
      font: new PhetFont( 13 )
    } );
    const iqrRectangle = new Rectangle( 0, 0, 0, 0, {
      fill: CAVColors.iqrColorProperty
    } );

    const createBoxWhiskerLabelArrow = ( fillColor: ProfileColorProperty ) => {
      return new ArrowNode( 0, 0, 0, 24, {
        fill: fillColor,
        stroke: null,
        headHeight: 12,
        headWidth: 15,
        tailWidth: 4,
        maxHeight: 18
      } );
    };

    const createBoxWhiskerLabelText = ( fillColor: ProfileColorProperty, labelTextProperty: TReadOnlyProperty<string>, isQuartile: boolean ) => {
      const textNodeChildren = [ ...( isQuartile ? [ new Circle( 12, { fill: CAVColors.iqrColorProperty } ) ] : [] ),
        new Text( labelTextProperty, {
        fontSize: 16,
        fill: fillColor,
        centerX: 0,
        centerY: 0
      } ) ];

      return new Node( { children: textNodeChildren, centerY: isQuartile ? -14 : -10 } );
    };

    const boxWhiskerLabel = ( fillColor: ProfileColorProperty, labelTextProperty: TReadOnlyProperty<string>, isQuartile: boolean ) => {
      const arrowNode = createBoxWhiskerLabelArrow( fillColor );
      const textNode = createBoxWhiskerLabelText( fillColor, labelTextProperty, isQuartile );
      return new Node( { children: [ textNode, arrowNode ] } );
    };

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

    const medianArrowNode = createBoxWhiskerLabelArrow( CAVColors.medianColorProperty );

    const minLabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.minStringProperty, false );
    const maxLabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.maxStringProperty, false );
    const q1LabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.q1StringProperty, true );
    const q3LabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.q3StringProperty, true );

    minLabelNode.y = maxLabelNode.y = -28;
    medianArrowNode.y = q1LabelNode.y = q3LabelNode.y = -31;

    boxWhiskerNode.addChild( boxWhiskerMedianLine );
    boxWhiskerNode.addChild( boxWhiskerBox );
    boxWhiskerNode.addChild( boxWhiskerLineLeft );
    boxWhiskerNode.addChild( boxWhiskerLineRight );
    boxWhiskerNode.addChild( boxWhiskerEndCapLeft );
    boxWhiskerNode.addChild( boxWhiskerEndCapRight );
    boxWhiskerNode.addChild( q1LabelNode );
    boxWhiskerNode.addChild( q3LabelNode );
    boxWhiskerNode.addChild( minLabelNode );
    boxWhiskerNode.addChild( maxLabelNode );
    boxWhiskerNode.addChild( medianArrowNode );

    this.addChild( iqrBar );
    this.addChild( iqrBarLabel );
    this.addChild( iqrRectangle );
    this.addChild( boxWhiskerNode );

    iqrRectangle.moveToBack();

    const updateIQRNode = () => {
      const floor = this.modelViewTransform.modelToViewY( 0 );

      const sortedDots = _.sortBy( sceneModel.getActiveSoccerBalls().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];
      const rightmostDot = sortedDots[ sortedDots.length - 1 ];

      const boxLeft = this.modelViewTransform.modelToViewX( sceneModel.q1ValueProperty.value! );
      const boxRight = this.modelViewTransform.modelToViewX( sceneModel.q3ValueProperty.value! );

      const medianPositionX = this.modelViewTransform.modelToViewX( sceneModel.medianValueProperty.value! );
      medianArrowNode.x = boxWhiskerMedianLine.x1 = boxWhiskerMedianLine.x2 = medianPositionX;

      boxWhiskerBox.left = boxLeft - 0.5 * BOX_STROKE_WIDTH;
      boxWhiskerBox.rectWidth = boxRight - boxLeft;

      if ( leftmostDot && rightmostDot ) {
        const min = leftmostDot.valueProperty.value!;
        const max = rightmostDot.valueProperty.value!;
        const minPositionX = this.modelViewTransform.modelToViewX( min );
        const maxPositionX = this.modelViewTransform.modelToViewX( max );

        boxWhiskerLineLeft.x1 = boxWhiskerEndCapLeft.x1 = boxWhiskerEndCapLeft.x2 = minLabelNode.x = minPositionX;
        boxWhiskerLineLeft.x2 = q1LabelNode.x = boxLeft;

        boxWhiskerLineRight.x1 = q3LabelNode.x = boxRight;
        boxWhiskerLineRight.x2 = boxWhiskerEndCapRight.x1 = boxWhiskerEndCapRight.x2 = maxLabelNode.x = maxPositionX;

        boxWhiskerEndCapLeft.visible = boxLeft !== minPositionX;
        boxWhiskerEndCapRight.visible = boxRight !== maxPositionX;
      }

      const enoughDataForMedian = sceneModel.numberOfDataPointsProperty.value >= 1;
      const enoughDataForIQR = sceneModel.numberOfDataPointsProperty.value >= 5;
      const showHighlightRectangle = enoughDataForIQR && ( options.parentContext === 'info' || model.isIQRVisibleProperty.value );
      const showBoxWhiskerLabels = options.parentContext === 'info' && enoughDataForIQR;

      medianArrowNode.visible = enoughDataForMedian;
      boxWhiskerNode.visible = enoughDataForIQR;
      iqrRectangle.visible = iqrBar.visible = iqrBarLabel.visible = showHighlightRectangle;
      minLabelNode.visible = maxLabelNode.visible = q1LabelNode.visible = q3LabelNode.visible = showBoxWhiskerLabels;

      needAtLeastFiveKicksText.visible = !enoughDataForIQR && ( model.isIQRVisibleProperty.value || options.parentContext === 'info' );

      if ( showHighlightRectangle ) {
        iqrRectangle.rectHeight = floor - boxWhiskerNode.y + 0.5 * BOX_HEIGHT;
        iqrRectangle.rectWidth = boxRight - boxLeft;
        iqrRectangle.left = boxLeft;
        iqrRectangle.bottom = floor;

        iqrBar.setMedianBarShape( iqrRectangle.top - MedianBarNode.NOTCH_HEIGHT - 14, iqrRectangle.left, 0, iqrRectangle.right, false );
        iqrBarLabel.string = sceneModel.iqrValueProperty.value!;
        iqrBarLabel.centerX = iqrRectangle.centerX;
        iqrBarLabel.bottom = iqrBar.top - 2;
      }
    };

    sceneModel.objectChangedEmitter.addListener( updateIQRNode );
    model.isIQRVisibleProperty.link( updateIQRNode );
    model.selectedVariabilityMeasureProperty.link( updateIQRNode );
    sceneModel.numberOfDataPointsProperty.link( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );