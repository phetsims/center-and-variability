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
import CAVNumberLineNode from './CAVNumberLineNode.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import TProperty from '../../../../axon/js/TProperty.js';
import RepresentationContext from '../model/RepresentationContext.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {

  // The fill color of the data points
  dataPointFill: TColor;

  // Whether the plot is part of the accordion box or the info display
  parentContext: RepresentationContext;

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
    if ( options.parentContext === 'accordion' ) {
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
        includeRangeOnXAxis: includeRangeOnXAxisInAccordionBox && options.parentContext === 'accordion'
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

soccerCommon.register( 'CAVPlotNode', CAVPlotNode );