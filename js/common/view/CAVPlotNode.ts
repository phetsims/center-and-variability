// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { ManualConstraint, Node, NodeOptions, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CAVModel from '../model/CAVModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import DataPointNode from './DataPointNode.js';

type SelfOptions = {
  dataPointFill: TColor;
};
export type CAVPlotOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class CAVPlotNode extends Node {

  private readonly dotLayer = new Node();
  protected readonly modelViewTransform: ModelViewTransform2;

  public constructor( model: CAVModel, providedOptions?: CAVPlotOptions ) {

    const options = optionize<CAVPlotOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    super( options );

    const backgroundNode = new Rectangle( 0, 0, CAVConstants.CHART_VIEW_WIDTH, 180 );
    this.addChild( backgroundNode );

    const numberLinePositionY = 127;

    // Empirically determined
    const dataPointHeight = 17;

    // Coordinates here are somewhat unusual, since x dimension is based off of meters, and y dimension is based off of
    // number of objects.
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( model.physicalRange.min, 0, model.physicalRange.max, 1 ),
      new Bounds2( 0, numberLinePositionY - dataPointHeight, CAVConstants.CHART_VIEW_WIDTH, numberLinePositionY )
    );
    this.modelViewTransform = modelViewTransform;

    const numberLineNode = new NumberLineNode(
      model.physicalRange,
      model.meanValueProperty,
      model.isShowingTopMeanProperty,
      model.dataRangeProperty, {
        color: 'black',
        includeXAxis: true,
        includeMeanStroke: false,
        tandem: options.tandem.createTandem( 'numberLineNode' ),
        y: numberLinePositionY
      } );
    backgroundNode.addChild( numberLineNode );

    const distanceInMetersText = new Text( CenterAndVariabilityStrings.distanceInMetersStringProperty, {
      top: numberLineNode.bottom + 2,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH
    } );
    backgroundNode.addChild( distanceInMetersText );

    ManualConstraint.create( this, [ numberLineNode, distanceInMetersText ], ( numberLineProxy, textProxy ) => {

      // TODO-UX: This may be asymmetrical if it accounts for edge labels. Maybe use NumberLineNode.tickMarks (not the labels)
      textProxy.centerX = numberLineProxy.centerX;
    } );

    backgroundNode.addChild( this.dotLayer );

    model.soccerBalls.forEach( ( soccerBall, index ) => {

      const dotNode = new DataPointNode( soccerBall, model.isShowingTopMedianProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'dotNodeGroup' ).createTandem( 'dataPoint' + index ),
        fill: options.dataPointFill
      } );

      this.dotLayer.addChild( dotNode );
    } );
  }

  public reset(): void {
    // No implementation because this node is powered by the model. Reset needed for uniformity with CardNodeContainer.
  }
}

centerAndVariability.register( 'CAVPlotNode', CAVPlotNode );