// Copyright 2023-2024, University of Colorado Boulder

/**
 * The `IQRNode` class extends the plot node visuals to display specifics of the Interquartile Range (IQR).
 * It features a box-whisker plot, an IQR label, and a rectangle highlighting the IQR span. Data points like
 * median, min, max, and quartiles are emphasized. Outliers are marked with diamond nodes. The node dynamically
 * adjusts label positions to avoid overlaps and prompts when there's insufficient data for IQR calculations.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants, { SHOW_OUTLIERS_PROPERTY } from '../../common/CAVConstants.js';
import RepresentationContext from '../../common/model/RepresentationContext.js';
import CAVPlotNode, { CAVPlotNodeOptions, MIN_KICKS_TEXT_OFFSET } from '../../common/view/CAVPlotNode.js';
import IntervalBarNode from '../../common/view/IntervalBarNode.js';
import NeedAtLeastNKicksText from '../../common/view/NeedAtLeastNKicksText.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import BoxWhiskerLabelNode from './BoxWhiskerLabelNode.js';

type SelfOptions = {
  representationContext: RepresentationContext;
};
type IQRNodeOptions = SelfOptions & StrictOmit<CAVPlotNodeOptions, 'dataPointFill'>;

export const ARROW_LABEL_TEXT_OFFSET_DEFAULT = -11;

export default class IQRNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, isDataPointLayerVisibleProperty: TProperty<boolean>, providedOptions: IQRNodeOptions ) {

    const options = optionize<IQRNodeOptions, SelfOptions, CAVPlotNodeOptions>()( {
      dataPointFill: CAVColors.variabilityDataPointFill
    }, providedOptions );

    super( false, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, DerivedProperty.valueEqualsConstant( model.selectedVariabilityMeasureProperty, VariabilityMeasure.MAD ), options );

    const needAtLeastFiveKicksText = new NeedAtLeastNKicksText( CenterAndVariabilityStrings.needAtLeastFiveKicksStringProperty );
    ManualConstraint.create( this, [ needAtLeastFiveKicksText ], () => {
      needAtLeastFiveKicksText.center = this.modelViewTransform.modelToViewXY( CAVConstants.PHYSICAL_RANGE.getCenter(),
        MIN_KICKS_TEXT_OFFSET );
    } );
    this.addChild( needAtLeastFiveKicksText );

    const BOX_WHISKER_OFFSET_Y = 4;
    const BOX_HEIGHT = 25;
    const END_CAP_HEIGHT = 20;
    const BOX_STROKE_WIDTH = 2;

    const boxWhiskerNode = new Node();
    boxWhiskerNode.y = this.modelViewTransform.modelToViewY( BOX_WHISKER_OFFSET_Y );

    const iqrBar = new IntervalBarNode();
    const iqrBarLabel = new Text( '', {
      font: CAVConstants.VARIABILITY_MEASURE_NUMBER_READOUT_FONT
    } );

    const iqrRectHeight = options.representationContext === 'info' ? BOX_HEIGHT : CAVConstants.VARIABILITY_PLOT_RECT_HEIGHT;
    const iqrRectangle = new Rectangle( 0, 0, 0, iqrRectHeight, {
      fill: CAVColors.iqrColorProperty
    } );

    const boxWhiskerMedianLine = new Line( 0, -BOX_HEIGHT / 2, 0, BOX_HEIGHT / 2, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerBox = new Rectangle( 0, -BOX_HEIGHT / 2, 100, BOX_HEIGHT, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const createBoxWhiskerLine = () => new Line( 0, 0, 0, 0, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerLineLeft = createBoxWhiskerLine();
    const boxWhiskerLineRight = createBoxWhiskerLine();

    const createBoxWhiskerEndCap = () => new Line( 0, -END_CAP_HEIGHT / 2, 0, END_CAP_HEIGHT / 2, {
      stroke: CAVColors.boxWhiskerStrokeColorProperty,
      lineWidth: BOX_STROKE_WIDTH
    } );

    const boxWhiskerEndCapLeft = createBoxWhiskerEndCap();
    const boxWhiskerEndCapRight = createBoxWhiskerEndCap();

    boxWhiskerNode.addChild( boxWhiskerMedianLine );
    boxWhiskerNode.addChild( boxWhiskerBox );
    boxWhiskerNode.addChild( boxWhiskerLineLeft );
    boxWhiskerNode.addChild( boxWhiskerLineRight );
    boxWhiskerNode.addChild( boxWhiskerEndCapLeft );
    boxWhiskerNode.addChild( boxWhiskerEndCapRight );

    const medianLabelNode = new BoxWhiskerLabelNode( CenterAndVariabilityStrings.minStringProperty, false, CAVColors.medianColorProperty, true );
    const minLabelNode = new BoxWhiskerLabelNode( CenterAndVariabilityStrings.minStringProperty, false, CAVColors.iqrLabelColorProperty );
    const maxLabelNode = new BoxWhiskerLabelNode( CenterAndVariabilityStrings.maxStringProperty, false, CAVColors.iqrLabelColorProperty );
    const q1LabelNode = new BoxWhiskerLabelNode( CenterAndVariabilityStrings.q1StringProperty, true, CAVColors.iqrLabelColorProperty );
    const q3LabelNode = new BoxWhiskerLabelNode( CenterAndVariabilityStrings.q3StringProperty, true, CAVColors.iqrLabelColorProperty );

    // Used for resolving label overlaps and repositioning IQR bar on label position/size updates
    const nonMedianLabelNodes = [ minLabelNode, q1LabelNode, q3LabelNode, maxLabelNode ];

    medianLabelNode.y = -31;
    q1LabelNode.y = q3LabelNode.y = minLabelNode.y = maxLabelNode.y = -35;

    boxWhiskerNode.addChild( minLabelNode );
    boxWhiskerNode.addChild( maxLabelNode );
    boxWhiskerNode.addChild( q1LabelNode );
    boxWhiskerNode.addChild( q3LabelNode );
    boxWhiskerNode.addChild( medianLabelNode );

    const outlierDisplay = new Node();
    boxWhiskerNode.addChild( outlierDisplay );

    this.addChild( iqrBar );
    this.addChild( iqrBarLabel );
    this.addChild( iqrRectangle );
    this.addChild( boxWhiskerNode );

    iqrRectangle.moveToBack();

    // Ensures that the BoxWhiskerLabelNodes don't overlap one another
    const resolveTextLabelOverlaps = () => {
      const widthTolerance = 1;
      const intersectionTolerance = 10;
      const offsetY = -20;
      const elementsToCheck = [ ...nonMedianLabelNodes ];
      const verticalOffsets = [
        ARROW_LABEL_TEXT_OFFSET_DEFAULT,
        ARROW_LABEL_TEXT_OFFSET_DEFAULT,
        ARROW_LABEL_TEXT_OFFSET_DEFAULT,
        ARROW_LABEL_TEXT_OFFSET_DEFAULT
      ];

      const quartileLabelsOverlap = Math.abs( q1LabelNode.x - q3LabelNode.x ) < widthTolerance;

      if ( quartileLabelsOverlap ) {
        elementsToCheck.splice( 2, 0, medianLabelNode );
        verticalOffsets.push( ARROW_LABEL_TEXT_OFFSET_DEFAULT );
        medianLabelNode.x = q1LabelNode.x;
      }

      for ( let i = 0; i < elementsToCheck.length; i++ ) {
        for ( let j = i + 1; j < elementsToCheck.length; j++ ) {
          const intersection = elementsToCheck[ i ].bounds.intersection( elementsToCheck[ j ].bounds );
          const isIntersectionValid = intersection.isValid();

          if ( isIntersectionValid && intersection.width > intersectionTolerance ) {
            verticalOffsets[ j ] += offsetY;
          }
        }
      }

      const elementsToResolve = nonMedianLabelNodes.map( nonMedianLabelNode => {
        return nonMedianLabelNode.labelContainer;
      } );
      if ( quartileLabelsOverlap ) {
        elementsToResolve.splice( 2, 0, medianLabelNode );

        //offset the median arrow additionally since it has a different anchor point than the text labels
        verticalOffsets[ 2 ] -= 44;
      }
      else {
        medianLabelNode.y = -31;
      }

      for ( let i = 0; i < elementsToResolve.length; i++ ) {
        elementsToResolve[ i ].y = verticalOffsets[ i ];
      }

      const q1OverlapsMin = Math.abs( q1LabelNode.x - minLabelNode.x ) < widthTolerance;

      // if q1 is in the same place as the min but the quartiles don't overlap, put the quartile labels on the same level
      if ( q1OverlapsMin && !quartileLabelsOverlap ) {
        const q1LabelTextY = q1LabelNode.labelContainer.y;
        q1LabelNode.labelContainer.y = minLabelNode.labelContainer.y;
        minLabelNode.labelContainer.y = q1LabelTextY;
      }
    };

    const isOutlier = ( value: number ) => {
      const deltaForOutlier = 1.5 * sceneModel.iqrValueProperty.value!;
      return sceneModel.q1ValueProperty.value! - value > deltaForOutlier || value - sceneModel.q3ValueProperty.value! > deltaForOutlier;
    };

    const diamondOutlierNode = ( centerX: number ) => {
      const WIDTH = 12;
      const HEIGHT = 8;
      return new Path(
        new Shape().moveTo( -WIDTH / 2, 0 )
          .lineTo( 0, HEIGHT / 2 ).lineTo( WIDTH / 2, 0 ).lineTo( 0, -HEIGHT / 2 ).close(),
        {
          stroke: 'black',
          lineWidth: 2,
          lineCap: 'round',
          centerX: centerX
        }
      );
    };

    const updateIntervalBar = () => {
      const minLabelNodeY = Math.min( ...nonMedianLabelNodes.map( nonMedianLabelNode => nonMedianLabelNode.labelContainer.y ) );

      iqrBar.setIntervalBarNodeWidth( iqrRectangle.rectWidth );
      iqrBar.bottom = options.representationContext === 'accordion' ? iqrRectangle.top + CAVConstants.VARIABILITY_PLOT_BAR_OFFSET_Y : minLabelNodeY + 12;
      iqrBar.centerX = iqrRectangle.centerX;

      // Gracefully handle transient intermediate states during phet-io set state
      iqrBarLabel.string = sceneModel.iqrValueProperty.value === null ? '' : sceneModel.iqrValueProperty.value;
      iqrBarLabel.centerBottom = iqrBar.centerTop;
    };

    const updateIQRNode = () => {
      // Avoid inconsistent intermediate states during a clear, but note that this will be called immediately
      // after clearing, see https://github.com/phetsims/center-and-variability/issues/240
      if ( sceneModel.isClearingData ) {
        return;
      }

      const sortedValues = sceneModel.getSortedStackedObjects().map( object => object.valueProperty.value! );

      const outlierValues = SHOW_OUTLIERS_PROPERTY.value ? _.uniq( sortedValues.filter( isOutlier ) ) : [];
      const dataPointsWithoutOutliers = sortedValues.filter( value => !outlierValues.includes( value ) );

      // Note these min and max do not account for outliers, since it is for drawing the box and whisker
      const min = dataPointsWithoutOutliers[ 0 ];
      const max = dataPointsWithoutOutliers[ dataPointsWithoutOutliers.length - 1 ];

      const boxLeft = this.modelViewTransform.modelToViewX( sceneModel.q1ValueProperty.value! );
      const boxRight = this.modelViewTransform.modelToViewX( sceneModel.q3ValueProperty.value! );

      const medianPositionX = this.modelViewTransform.modelToViewX( sceneModel.medianValueProperty.value! );
      medianLabelNode.x = boxWhiskerMedianLine.x1 = boxWhiskerMedianLine.x2 = medianPositionX;

      boxWhiskerBox.left = boxLeft - 0.5 * BOX_STROKE_WIDTH;
      boxWhiskerBox.rectWidth = boxRight - boxLeft;

      if ( min && max ) {
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
      const showHighlightRectangle = enoughDataForIQR && ( options.representationContext === 'info' || model.isIQRVisibleProperty.value );
      const showBoxWhiskerLabels = options.representationContext === 'info' && enoughDataForIQR;

      medianLabelNode.visible = enoughDataForMedian;
      boxWhiskerNode.visible = enoughDataForIQR;
      iqrRectangle.visible = iqrBar.visible = iqrBarLabel.visible = showHighlightRectangle;
      minLabelNode.visible = maxLabelNode.visible = q1LabelNode.visible = q3LabelNode.visible = showBoxWhiskerLabels;

      needAtLeastFiveKicksText.visible = !enoughDataForIQR && ( model.isIQRVisibleProperty.value || options.representationContext === 'info' );

      if ( options.representationContext === 'info' ) {
        resolveTextLabelOverlaps();
      }

      if ( showHighlightRectangle ) {
        const floor = this.modelViewTransform.modelToViewY( 0 );
        iqrRectangle.rectWidth = boxRight - boxLeft;
        iqrRectangle.left = boxLeft;
        iqrRectangle.bottom = options.representationContext === 'info' ? boxWhiskerNode.y + 0.5 * BOX_HEIGHT : floor;

        updateIntervalBar();
      }

      let outlierDisplayChildren: Path[] = [];
      if ( enoughDataForIQR && SHOW_OUTLIERS_PROPERTY.value ) {
        outlierDisplayChildren = outlierValues.map( value => diamondOutlierNode( this.modelViewTransform.modelToViewX( value ) ) );
      }
      outlierDisplay.setChildren( outlierDisplayChildren );
    };

    model.isIQRVisibleProperty.link( updateIQRNode );
    model.selectedVariabilityMeasureProperty.link( updateIQRNode );
    SHOW_OUTLIERS_PROPERTY.link( updateIQRNode );
    sceneModel.iqrValueProperty.lazyLink( updateIQRNode );

    // We want to ensure that label overlaps and plotNode layout are handled with dynamic text as well.
    Multilink.multilink( [ minLabelNode.boundsProperty, q1LabelNode.boundsProperty, q3LabelNode.boundsProperty, maxLabelNode.boundsProperty ],
      () => {
        resolveTextLabelOverlaps();
        updateIntervalBar();
      } );

    // It's important to avoid inconsistent intermediate states during the updateDataMeasures calculation, so we
    // only update once it's complete
    sceneModel.variabilityDataMeasuresUpdatedEmitter.addListener( updateIQRNode );
  }
}

centerAndVariability.register( 'IQRNode', IQRNode );