// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen. The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from '../../../../soccer-common/js/soccerCommon.js';
import { ManualConstraint, MatrixBetweenProperty, Node, NodeOptions, TColor, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import DataPointNode from './DataPointNode.js';
import CAVModel from '../model/CAVModel.js';
import MeanAndMedianModel from '../../mean-and-median/model/MeanAndMedianModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VariabilityModel from '../../variability/model/VariabilityModel.js';
import VariabilityMeasure from '../../variability/model/VariabilityMeasure.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import CAVNumberLineNode from './CAVNumberLineNode.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import TProperty from '../../../../axon/js/TProperty.js';
import RepresentationContext from '../model/RepresentationContext.js';

//REVIEW document options
type SelfOptions = {
  dataPointFill: TColor;
  parentContext: RepresentationContext;
  isMeanAndMedianInfoPlot?: boolean;
};

export type CAVPlotNodeOptions = SelfOptions & NodeOptions;
export const MIN_KICKS_TEXT_OFFSET = 2;
export const PLOT_NODE_TOP_MARGIN = 25;

export default class CAVPlotNode extends Node {

  private readonly dataPointLayer; //REVIEW document
  public readonly modelViewTransform = CAVConstants.PLOT_NODE_TRANSFORM;
  private readonly numberLineNode: NumberLineNode;

  public constructor( model: CAVModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLineNode: NumberLineNode, isDataPointLayerVisibleProperty: TProperty<boolean>, providedOptions?: CAVPlotNodeOptions ) {

    const options = optionize<CAVPlotNodeOptions, SelfOptions, NodeOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      isMeanAndMedianInfoPlot: false,
      isDisposable: false
    }, providedOptions );

    super( options );

    this.dataPointLayer = new Node();
    if ( options.parentContext === 'accordion' ) {
      this.dataPointLayer.visibleProperty = isDataPointLayerVisibleProperty;
    }

    const backgroundNode = new Node();
    this.addChild( backgroundNode );

    const includeRangeOnXAxis = !( model instanceof VariabilityModel ) && options.parentContext === 'accordion';
    const visibleProperty = model instanceof MeanAndMedianModel && options.parentContext === 'accordion' ? model.isMeanVisibleProperty :
                            model instanceof VariabilityModel ? DerivedProperty.valueEqualsConstant( model.selectedVariabilityMeasureProperty, VariabilityMeasure.MAD ) :
                            new BooleanProperty( true );

    this.numberLineNode = new CAVNumberLineNode(
      sceneModel.meanValueProperty,
      this.modelViewTransform,
      visibleProperty,
      sceneModel.dataRangeProperty,
      CAVConstants.CHART_VIEW_WIDTH,
      CAVConstants.PHYSICAL_RANGE, {
        color: 'black',
        includeXAxis: true,
        includeMeanStroke: false,
        y: CAVConstants.NUMBER_LINE_POSITION_Y,
        includeRangeOnXAxis: includeRangeOnXAxis
      } );
    backgroundNode.addChild( this.numberLineNode );

    const distanceInMetersText = new Text( CenterAndVariabilityStrings.distanceInMetersChartLabelStringProperty, {
      top: this.numberLineNode.bottom + 2,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
      fontSize: 14
    } );
    backgroundNode.addChild( distanceInMetersText );

    ManualConstraint.create( this, [ this.numberLineNode.tickMarkSet, distanceInMetersText ], ( tickMarkSetProxy, textProxy ) => {
      textProxy.centerX = tickMarkSetProxy.centerX;
    } );

    backgroundNode.addChild( this.dataPointLayer );

    const dataPointLayer = new Node( {
      visibleProperty: sceneModel.isVisibleProperty,
      excludeInvisibleChildrenFromBounds: true
    } );

    // Create the data points for that sceneModel
    sceneModel.soccerBalls.forEach( soccerBall => {

      const dotNode = new DataPointNode( soccerBall,
        this.modelViewTransform, {
          isMeanAndMedianInfoNode: options.isMeanAndMedianInfoPlot,
          fill: options.dataPointFill
        } );

      dataPointLayer.addChild( dotNode );
    } );

    this.dataPointLayer.addChild( dataPointLayer );

    // Align with the play are number line node, based on the tick mark locations
    const matrixBetweenProperty = new MatrixBetweenProperty( playAreaNumberLineNode.tickMarkSet, this.numberLineNode.tickMarkSet );

    matrixBetweenProperty.link( matrix => {

      if ( matrix ) {

        const deltaX = matrix.getTranslation().x;
        if ( deltaX !== 0 ) {

          // Convert to the this.parent coordinate frame
          const localDeltaX = this.numberLineNode.tickMarkSet.getUniqueTrailTo( this ).getTransform().transformDeltaX( deltaX );
          this.x += localDeltaX;
        }
      }
    } );
  }

  public reset(): void {
    // No implementation because this node is powered by the model. Reset needed for uniformity with CardNodeContainer.
  }
}

soccerCommon.register( 'CAVPlotNode', CAVPlotNode );