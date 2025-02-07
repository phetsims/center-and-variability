// Copyright 2022-2024, University of Colorado Boulder

/**
 * CAVPlotNode visualizes data in the "Mean & Median" Screen of the simulation as either a dot plot or line plot.
 * This plot is designed to be purely illustrative and does not support interactivity. Various components, such as
 * a number line, mean indicator, and data points, are incorporated to provide clarity.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import MatrixBetweenProperty from '../../../../scenery/js/util/MatrixBetweenProperty.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import RepresentationContext from '../model/RepresentationContext.js';
import CAVNumberLineNode from './CAVNumberLineNode.js';
import DataPointNode from './DataPointNode.js';

type SelfOptions = {

  // The fill color of the data points
  dataPointFill: TColor;

  // Whether the plot is part of the accordion box or the info display
  representationContext: RepresentationContext;

  // Whether the plot is being shown in the info display of the 'Mean and Median' screen. Used for highlighting data points.
  isMeanAndMedianInfoPlot?: boolean;
};

export type CAVPlotNodeOptions = SelfOptions & NodeOptions;
export const MIN_KICKS_TEXT_OFFSET = 2;
export const PLOT_NODE_TOP_MARGIN = 25;

export default class CAVPlotNode extends Node {

  // The layer that contains the data points of the plot
  private readonly dataPointLayer;

  // The model view transform of the CAVPlotNode
  public readonly modelViewTransform = CAVConstants.PLOT_NODE_TRANSFORM;

  // The number line at the bottom of the plot
  private readonly numberLineNode: NumberLineNode;

  public constructor( includeRangeOnXAxisInAccordionBox: boolean,
                      sceneModel: CAVSoccerSceneModel,
                      playAreaNumberLineNode: NumberLineNode,
                      isDataPointLayerVisibleProperty: TProperty<boolean>,
                      isMeanIndicatorVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: CAVPlotNodeOptions ) {

    const options = optionize<CAVPlotNodeOptions, SelfOptions, NodeOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      isMeanAndMedianInfoPlot: false,
      isDisposable: false
    }, providedOptions );

    super( options );

    this.dataPointLayer = new Node();
    if ( options.representationContext === 'accordion' ) {
      this.dataPointLayer.visibleProperty = isDataPointLayerVisibleProperty;
    }

    const backgroundNode = new Node();
    this.addChild( backgroundNode );

    this.numberLineNode = new CAVNumberLineNode(
      sceneModel.meanValueProperty,
      this.modelViewTransform,
      isMeanIndicatorVisibleProperty,
      sceneModel.dataRangeProperty,
      CAVConstants.CHART_VIEW_WIDTH,
      CAVConstants.PHYSICAL_RANGE, {
        color: 'black',
        includeXAxis: true,
        includeMeanStroke: false,
        y: CAVConstants.NUMBER_LINE_POSITION_Y,
        includeRangeOnXAxis: includeRangeOnXAxisInAccordionBox && options.representationContext === 'accordion'
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

    // Align with the play are number line node, based on the tick mark values
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

centerAndVariability.register( 'CAVPlotNode', CAVPlotNode );