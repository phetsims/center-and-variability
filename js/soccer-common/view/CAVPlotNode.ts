// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen. The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from '../soccerCommon.js';
import { ManualConstraint, MatrixBetweenProperty, Node, NodeOptions, TColor, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CAVSceneModel from '../model/CAVSceneModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../../common/CAVConstants.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import DataPointNode from './DataPointNode.js';
import CAVModel from '../../common/model/CAVModel.js';
import MeanAndMedianModel from '../../mean-and-median/model/MeanAndMedianModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VariabilityModel from '../../variability/model/VariabilityModel.js';
import VariabilityMeasure from '../../variability/model/VariabilityMeasure.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = {
  dataPointFill: TColor;
};

export type CAVPlotNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;
export const MIN_KICKS_TEXT_OFFSET = 2;
export const MIN_KICKS_TEXT_TOP_MARGIN = 20;

export default class CAVPlotNode extends Node {

  private readonly dotLayer = new Node();
  public readonly modelViewTransform: ModelViewTransform2;
  private readonly numberLineNode: NumberLineNode;

  public constructor( model: CAVModel, sceneModel: CAVSceneModel, playAreaNumberLineNode: NumberLineNode, providedOptions?: CAVPlotNodeOptions ) {

    const options = optionize<CAVPlotNodeOptions, SelfOptions, NodeOptions>()( {
      excludeInvisibleChildrenFromBounds: true
    }, providedOptions );

    super( options );

    const backgroundNode = new Node();
    this.addChild( backgroundNode );

    const numberLinePositionY = 127;

    // View size of a data point in the chart
    const dataPointHeight = 17;

    // Coordinates here are somewhat unusual, since x dimension is based off of meters, and y dimension is based off of
    // number of objects.
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( CAVConstants.PHYSICAL_RANGE.min, 0, CAVConstants.PHYSICAL_RANGE.max, 1 ),
      new Bounds2( 0, numberLinePositionY - dataPointHeight, CAVConstants.CHART_VIEW_WIDTH, numberLinePositionY )
    );
    this.modelViewTransform = modelViewTransform;

    this.numberLineNode = new NumberLineNode(
      sceneModel.meanValueProperty,
      modelViewTransform,
      model instanceof MeanAndMedianModel ? model.isTopMeanVisibleProperty :
      model instanceof VariabilityModel ? DerivedProperty.valueEqualsConstant( model.selectedVariabilityMeasureProperty, VariabilityMeasure.MAD ) :
      new BooleanProperty( true ),
      sceneModel.dataRangeProperty, {
        color: 'black',
        includeXAxis: true,
        includeMeanStroke: false,
        tandem: options.tandem.createTandem( 'numberLineNode' ),
        y: numberLinePositionY,
        includeRangeOnXAxis: !( model instanceof VariabilityModel )
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

    backgroundNode.addChild( this.dotLayer );

    model.sceneModels.forEach( ( scene, sceneIndex ) => {

      const dataPointLayer = new Node( {
        visibleProperty: scene.isVisibleProperty,
        excludeInvisibleChildrenFromBounds: true
      } );

      // Create the data points for that scene
      scene.soccerBalls.forEach( ( soccerBall, index ) => {

        const dotNode = new DataPointNode( soccerBall,
          modelViewTransform, {
            tandem: options.tandem.createTandem( `scene${sceneIndex + 1}` ).createTandem( 'dataPointNodes' ).createTandem( 'dataPointNode' + index ),
            fill: options.dataPointFill
          } );

        dataPointLayer.addChild( dotNode );
      } );

      this.dotLayer.addChild( dataPointLayer );
    } );

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