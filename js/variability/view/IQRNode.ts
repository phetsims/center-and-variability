// Copyright 2023, University of Colorado Boulder

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Circle, Line, Node, ProfileColorProperty, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
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

      // TODO: Look for a way to achieve this layout with fewer magic numbers
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
      font: new PhetFont( 16 )
    } );
    const iqrBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );

    const iqrRectangle = new Rectangle( 0, 0, 0, 0, {
      fill: CAVColors.quartileColorProperty
    } );

    const boxWhiskerArrowNode = ( fillColor: ProfileColorProperty ) => {
      return new ArrowNode( 0, 0, 0, 26, {
        fill: fillColor,
        stroke: null,
        lineWidth: 0.2,
        headHeight: 12,
        headWidth: 15,
        maxHeight: 18
      } );
    };

    const boxWhiskerTextNode = ( fillColor: ProfileColorProperty, labelTextProperty: TReadOnlyProperty<string>, isQuartile: boolean ) => {
      const textNodeChildren: Node[] = [ new Text( labelTextProperty, {
        fontSize: 16,
        fill: fillColor,
        centerX: 0,
        centerY: 0
      } ) ];
      if ( isQuartile ) {
        textNodeChildren.unshift( new Circle( 12, { fill: CAVColors.quartileColorProperty } ) );
      }
      return new Node( { children: textNodeChildren, centerY: isQuartile ? -12 : -10 } );
    };

    const boxWhiskerLabelNode = ( fillColor: ProfileColorProperty, labelTextProperty: TReadOnlyProperty<string>, isQuartile: boolean ) => {
      const arrowNode = boxWhiskerArrowNode( fillColor );
      const textNode = boxWhiskerTextNode( fillColor, labelTextProperty, isQuartile );
      return new Node( { children: [ textNode, arrowNode ] } );
    };

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

    const medianArrowNode = boxWhiskerArrowNode( CAVColors.medianColorProperty );
    const medianTextNode = boxWhiskerTextNode( CAVColors.medianColorProperty, CenterAndVariabilityStrings.medianStringProperty, false );
    const medianLabelNode = new Node( { children: [ medianArrowNode, medianTextNode ], y: -32 } );

    const minLabelNode = boxWhiskerLabelNode( CAVColors.iqrColorProperty, CenterAndVariabilityStrings.minStringProperty, false );
    const maxLabelNode = boxWhiskerLabelNode( CAVColors.iqrColorProperty, CenterAndVariabilityStrings.maxStringProperty, false );
    const q1LabelNode = boxWhiskerLabelNode( CAVColors.iqrColorProperty, CenterAndVariabilityStrings.q1StringProperty, true );
    const q3LabelNode = boxWhiskerLabelNode( CAVColors.iqrColorProperty, CenterAndVariabilityStrings.q3StringProperty, true );

    minLabelNode.y = maxLabelNode.y = -28;
    q1LabelNode.y = q3LabelNode.y = -33;

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
    boxWhiskerNode.addChild( medianLabelNode );

    this.addChild( iqrRectangle );
    this.addChild( boxWhiskerNode );
    this.addChild( iqrTextReadout );
    this.addChild( iqrBar );

    iqrRectangle.moveToBack();

    const updateIQRNode = () => {
      const floor = this.modelViewTransform.modelToViewY( 0 );

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

      medianLabelNode.x = medianPositionX;

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

        minLabelNode.x = minPositionX;
        maxLabelNode.x = maxPositionX;
        q1LabelNode.x = boxLeft;
        q3LabelNode.x = boxRight;
      }

      const enoughDataForMedian = sceneModel.numberOfDataPointsProperty.value >= 1;
      const enoughDataForIQR = sceneModel.numberOfDataPointsProperty.value >= 5;
      const iqrHighlightVisibility = enoughDataForIQR && ( options.parentContext === 'info' || model.isShowingIQRProperty.value );

      boxWhiskerNode.visible = enoughDataForIQR;
      iqrRectangle.visible = iqrHighlightVisibility;

      medianArrowNode.visible = enoughDataForMedian;

      const showBoxWhiskerLabels = options.parentContext === 'info' && enoughDataForIQR;
      medianTextNode.visible = minLabelNode.visible = maxLabelNode.visible = q1LabelNode.visible = q3LabelNode.visible = showBoxWhiskerLabels;

      needAtLeastFiveKicks.center = this.modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastFiveKicks.visible = !enoughDataForIQR && ( options.parentContext === 'info' ||
                                                            ( options.parentContext === 'accordion' && model.isShowingIQRProperty.value ) );

      if ( iqrHighlightVisibility ) {
        iqrRectangle.rectHeight = floor - BOX_CENTER_Y + 0.5 * BOX_HEIGHT;
        iqrRectangle.rectWidth = boxRight - boxLeft;
        iqrRectangle.left = boxLeft;
        iqrRectangle.bottom = floor;
      }

      iqrBar.visible = iqrHighlightVisibility;
      iqrTextReadout.visible = iqrHighlightVisibility;

      if ( iqrHighlightVisibility ) {
        const IQR_BAR_OFFSET_Y = options.parentContext === 'info' ? 50 : 22;
        iqrBar.setMedianBarShape( iqrRectangle.top - MedianBarNode.NOTCH_HEIGHT - IQR_BAR_OFFSET_Y, iqrRectangle.left, 0, iqrRectangle.right, false );

        iqrTextReadout.string = sceneModel.iqrValueProperty.value!;
        iqrTextReadout.centerX = iqrRectangle.centerX;
        iqrTextReadout.bottom = iqrBar.top - 2;
      }
    };

    sceneModel.objectChangedEmitter.addListener( updateIQRNode );
    model.isShowingIQRProperty.link( updateIQRNode );
    model.selectedVariabilityProperty.link( updateIQRNode );
    sceneModel.numberOfDataPointsProperty.link( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );