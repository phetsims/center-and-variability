// Copyright 2023, University of Colorado Boulder

import MedianBarNode from '../../common/view/MedianBarNode.js';
import { Line, ManualConstraint, Node, ProfileColorProperty, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotNodeOptions, MIN_KICKS_TEXT_OFFSET, MIN_KICKS_TEXT_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import CAVConstants from '../../common/CAVConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type IQRNodeOptions = SelfOptions & StrictOmit<CAVPlotNodeOptions, 'dataPointFill'>;

export default class IQRNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, providedOptions: IQRNodeOptions ) {

    const options = optionize<IQRNodeOptions, SelfOptions, CAVPlotNodeOptions>()( {
      dataPointFill: CAVColors.grayDataPointFill
    }, providedOptions );

    super( model, sceneModel, options );

    const needAtLeastFiveKicksText = new Text( CenterAndVariabilityStrings.needAtLeastFiveKicksStringProperty, {
      fontSize: 18,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
      layoutOptions: { topMargin: MIN_KICKS_TEXT_TOP_MARGIN }
    } );
    ManualConstraint.create( this, [ needAtLeastFiveKicksText ], textProxy => {
      needAtLeastFiveKicksText.center = this.modelViewTransform.modelToViewXY( CAVConstants.PHYSICAL_RANGE.getCenter(),
        MIN_KICKS_TEXT_OFFSET );
    } );
    this.addChild( needAtLeastFiveKicksText );

    // This adds a top margin to the text, separating it from the info dialog subheading
    needAtLeastFiveKicksText.localBounds = needAtLeastFiveKicksText.localBounds.dilatedY( MIN_KICKS_TEXT_TOP_MARGIN );

    const BOX_WHISKER_OFFSET_Y = options.parentContext === 'info' ? 3.5 : 3;
    const BOX_HEIGHT = 25;
    const END_CAP_HEIGHT = 20;
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
      font: CAVConstants.VARIABILITY_MEASURE_NUMBER_READOUT_FONT
    } );
    const iqrRectangle = new Rectangle( 0, 0, 0, 0, {
      fill: CAVColors.iqrColorProperty
    } );

    const ARROW_LABEL_TEXT_OFFSET_DEFAULT = -11;

    const boxWhiskerLabelArrow = ( fillColor: ProfileColorProperty ) => {
      return new ArrowNode( 0, 0, 0, 24, {
        fill: fillColor,
        stroke: null,
        headHeight: 12,
        headWidth: 15,
        tailWidth: 4,
        maxHeight: 18
      } );
    };

    const boxWhiskerLabelText = ( fillColor: ProfileColorProperty, labelTextProperty: TReadOnlyProperty<string>, isQuartile: boolean ) => {
      const backgroundRectWidth = 28;
      const backgroundRectHeight = 20;
      const textNodeChildren = [ ...( isQuartile ?
        [ new Rectangle( -0.5 * backgroundRectWidth, -0.5 * backgroundRectHeight, backgroundRectWidth, backgroundRectHeight,
          { fill: CAVColors.iqrColorProperty, cornerRadius: 5 } ) ] : [] ),
        new Text( labelTextProperty, {
          fontSize: 16,
          fill: fillColor,
          centerX: 0,
          centerY: 0
        } )
      ];

      return new Node( { children: textNodeChildren, centerY: ARROW_LABEL_TEXT_OFFSET_DEFAULT } );
    };

    const boxWhiskerLabel = ( fillColor: ProfileColorProperty, textNode: Node ) => {
      const arrowNode = boxWhiskerLabelArrow( fillColor );
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

    const medianArrowNode = boxWhiskerLabelArrow( CAVColors.medianColorProperty );

    const minLabelTextNode = boxWhiskerLabelText( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.minStringProperty, false );
    const maxLabelTextNode = boxWhiskerLabelText( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.maxStringProperty, false );
    const q1LabelTextNode = boxWhiskerLabelText( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.q1StringProperty, true );
    const q3LabelTextNode = boxWhiskerLabelText( CAVColors.iqrLabelColorProperty, CenterAndVariabilityStrings.q3StringProperty, true );

    const minLabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, minLabelTextNode );
    const maxLabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, maxLabelTextNode );
    const q1LabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, q1LabelTextNode );
    const q3LabelNode = boxWhiskerLabel( CAVColors.iqrLabelColorProperty, q3LabelTextNode );

    medianArrowNode.y = -31;
    q1LabelNode.y = q3LabelNode.y = minLabelNode.y = maxLabelNode.y = -35;

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

    const resolveTextLabelOverlaps = () => {
      const widthTolerance = 1;
      const offsetY = -22;
      const elementsToCheck = [ minLabelNode, q1LabelNode, q3LabelNode, maxLabelNode ];
      const verticalOffsets = [
        ARROW_LABEL_TEXT_OFFSET_DEFAULT,
        ARROW_LABEL_TEXT_OFFSET_DEFAULT,
        ARROW_LABEL_TEXT_OFFSET_DEFAULT,
        ARROW_LABEL_TEXT_OFFSET_DEFAULT
      ];

      for ( let i = 0; i < elementsToCheck.length; i++ ) {
        for ( let j = i + 1; j < elementsToCheck.length; j++ ) {
          if ( Math.abs( elementsToCheck[ i ].x - elementsToCheck[ j ].x ) < widthTolerance ) {
            verticalOffsets[ j ] += offsetY;
          }
        }
      }

      const elementsToResolve = [ minLabelTextNode, q1LabelTextNode, q3LabelTextNode, maxLabelTextNode ];
      for ( let i = 0; i < elementsToResolve.length; i++ ) {
        elementsToResolve[ i ].y = verticalOffsets[ i ];
      }
    };

    const updateIQRNode = () => {
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

      if ( options.parentContext === 'info' ) {
        resolveTextLabelOverlaps();
      }

      if ( showHighlightRectangle ) {
        const floor = this.modelViewTransform.modelToViewY( 0 );
        iqrRectangle.rectHeight = options.parentContext === 'info' ? BOX_HEIGHT : floor - boxWhiskerNode.y + 0.5 * BOX_HEIGHT;
        iqrRectangle.rectWidth = boxRight - boxLeft;
        iqrRectangle.left = boxLeft;
        iqrRectangle.bottom = options.parentContext === 'info' ? boxWhiskerNode.y + 0.5 * BOX_HEIGHT : floor;

        const iqrBarY = options.parentContext === 'info' ?
                        Math.min( minLabelTextNode.y, q1LabelTextNode.y, q3LabelTextNode.y, maxLabelTextNode.y ) + 8
                                                         : iqrRectangle.top - MedianBarNode.NOTCH_HEIGHT - 14;

        iqrBar.setMedianBarShape( iqrBarY, iqrRectangle.left, 0, iqrRectangle.right, false );
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