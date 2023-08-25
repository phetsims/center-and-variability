// Copyright 2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import CAVPlotNode, { CAVPlotNodeOptions, MIN_KICKS_TEXT_OFFSET } from '../../common/view/CAVPlotNode.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../../common/CAVConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TProperty from '../../../../axon/js/TProperty.js';
import NeedAtLeastNKicksText from '../../common/view/NeedAtLeastNKicksText.js';
import RepresentationContext from '../../common/model/RepresentationContext.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = {
  parentContext: RepresentationContext;
};
export type MeanAndMedianPlotNodeOptions = SelfOptions & WithRequired<CAVPlotNodeOptions, 'dataPointFill'>;

export default class MeanAndMedianPlotNode extends CAVPlotNode {

  private readonly medianBarNode = new MedianBarNode( {
    barStyle: 'continuous'
  } );

  public constructor( model: MeanAndMedianModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLineNode: NumberLineNode, isDataPointLayerVisibleProperty: TProperty<boolean>, providedOptions: MeanAndMedianPlotNodeOptions ) {

    const options = optionize<MeanAndMedianPlotNodeOptions, SelfOptions, CAVPlotNodeOptions>()( {}, providedOptions );
    super( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, options.parentContext === 'accordion' ? model.isMeanVisibleProperty : new BooleanProperty( true ), options );

    const needAtLeastOneKickText = new NeedAtLeastNKicksText( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty );
    ManualConstraint.create( this, [ needAtLeastOneKickText ], textProxy => {
      textProxy.center = this.modelViewTransform.modelToViewXY( CAVConstants.PHYSICAL_RANGE.getCenter(), MIN_KICKS_TEXT_OFFSET );
    } );
    this.addChild( needAtLeastOneKickText );

    this.addChild( this.medianBarNode );

    const modelViewTransform = this.modelViewTransform;

    const updateMedianBarNode = () => {

      const soccerBalls = sceneModel.getSortedLandedObjects();

      // For the purposes of showing the median bar, do not consider the vertical position of STACKING soccer balls.
      const tallestStack = sceneModel.getTallestStack( soccerBall => soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED );
      const leftmostSoccerBall = soccerBalls[ 0 ];

      const medianValue = sceneModel.medianValueProperty.value;

      // distance from the bottom of the median bar notches to the center of the topmost data point
      const MARGIN_Y = 10;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( options.parentContext === 'accordion' && model.isMedianVisibleProperty.value && leftmostSoccerBall && medianValue !== null ) {

        // No matter how high the stack of dots or x's is, we only want the median bar to go up to 5.
        // Assumes all the dots have the same radius. Also move up based on the notch height.

        const rightmostSoccerBall = soccerBalls[ soccerBalls.length - 1 ];
        const left = modelViewTransform.modelToViewX( leftmostSoccerBall.valueProperty.value! );
        const right = modelViewTransform.modelToViewX( rightmostSoccerBall.valueProperty.value! );

        assert && assert( leftmostSoccerBall.valueProperty.value !== null );
        assert && assert( rightmostSoccerBall.valueProperty.value !== null );
        assert && assert( medianValue !== null );

        const medianPositionX = modelViewTransform.modelToViewX( medianValue );

        this.medianBarNode.setMedianBarShape( 0, left, medianPositionX, right, model.showMedianBarArrowProperty.value );

        const topDotToIndicate = tallestStack[ Math.min( tallestStack.length - 1, 11 ) ];
        this.medianBarNode.top = modelViewTransform.modelToViewY( topDotToIndicate.positionProperty.value.y ) - MARGIN_Y - MedianBarNode.NOTCH_HEIGHT;
      }
      else {
        this.medianBarNode.clear();
      }
    };

    const updateOneKickTextVisibility = () => {
      needAtLeastOneKickText.visible = sceneModel.numberOfDataPointsProperty.value === 0 && ( options.parentContext === 'info' || model.isMedianVisibleProperty.value || model.isMeanVisibleProperty.value );
    };

    sceneModel.objectChangedEmitter.addListener( updateMedianBarNode );
    sceneModel.objectChangedEmitter.addListener( updateOneKickTextVisibility );
    sceneModel.medianValueProperty.link( updateMedianBarNode );
    model.isMedianVisibleProperty.link( updateMedianBarNode );
    model.showMedianBarArrowProperty.link( updateMedianBarNode );
    model.isMedianVisibleProperty.link( updateOneKickTextVisibility );
    model.isMeanVisibleProperty.link( updateOneKickTextVisibility );
  }
}

centerAndVariability.register( 'MeanAndMedianPlotNode', MeanAndMedianPlotNode );