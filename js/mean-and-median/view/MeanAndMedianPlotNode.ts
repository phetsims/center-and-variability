// Copyright 2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import SoccerSceneModel from '../../soccer-common/model/SoccerSceneModel.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVPlotNode, { CAVPlotNodeOptions } from '../../common/view/CAVPlotNode.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import { SoccerBallPhase } from '../../soccer-common/model/SoccerBallPhase.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianPlotNodeOptions = SelfOptions & CAVPlotNodeOptions & PickRequired<CAVPlotNodeOptions, 'tandem'>;

export default class MeanAndMedianPlotNode extends CAVPlotNode {

  private readonly medianBarNode = new MedianBarNode( {
    notchDirection: 'down',
    barStyle: 'continuous'
  } );

  public constructor( model: MeanAndMedianModel, sceneModel: SoccerSceneModel, playAreaNumberLineNode: NumberLineNode, options: MeanAndMedianPlotNodeOptions ) {
    super( model, sceneModel, playAreaNumberLineNode, options );

    this.addChild( this.medianBarNode );

    const modelViewTransform = this.modelViewTransform;

    const updateMedianBarNode = () => {

      const soccerBalls = sceneModel.getSortedLandedObjects();

      // For the purposes of showing the median bar, do not consider the vertical position of STACKING soccer balls.
      const tallestStack = sceneModel.getTallestStack( soccerBall => soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED );
      const leftmostSoccerBall = soccerBalls[ 0 ];

      const medianValue = sceneModel.medianValueProperty.value;

      const MARGIN_Y = 5;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( model.isTopMedianVisibleProperty.value && leftmostSoccerBall && medianValue !== null ) {

        // No matter how high the stack of dots or x's is, we only want the median bar to go up to 5.
        // Assumes all the dots have the same radius. Also move up based on the notch height.

        const rightmostSoccerBall = soccerBalls[ soccerBalls.length - 1 ];
        const left = modelViewTransform.modelToViewX( leftmostSoccerBall.valueProperty.value! );
        const right = modelViewTransform.modelToViewX( rightmostSoccerBall.valueProperty.value! );

        assert && assert( leftmostSoccerBall.valueProperty.value !== null );
        assert && assert( rightmostSoccerBall.valueProperty.value !== null );
        assert && assert( medianValue !== null );

        const medianPositionX = modelViewTransform.modelToViewX( medianValue );

        this.medianBarNode.setMedianBarShape( 0, left, medianPositionX, right, model.isMedianAnimationCompleteProperty.value );

        const topDotToIndicate = tallestStack[ Math.min( tallestStack.length - 1, 4 ) ];
        this.medianBarNode.bottom = modelViewTransform.modelToViewY( topDotToIndicate.positionProperty.value.y ) - MARGIN_Y;
      }
      else {
        this.medianBarNode.clear();
      }
    };
    sceneModel.objectChangedEmitter.addListener( updateMedianBarNode );
    sceneModel.medianValueProperty.link( updateMedianBarNode );
    model.isTopMedianVisibleProperty.link( updateMedianBarNode );
    if ( model instanceof MeanAndMedianModel ) {
      model.isMedianAnimationCompleteProperty.link( updateMedianBarNode );
    }
  }
}

centerAndVariability.register( 'MeanAndMedianPlotNode', MeanAndMedianPlotNode );