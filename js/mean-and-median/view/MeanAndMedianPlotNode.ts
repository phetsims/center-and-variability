// Copyright 2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVSceneModel from '../../common/model/CAVSceneModel.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVPlotNode, { CAVPlotNodeOptions } from '../../common/view/CAVPlotNode.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CAVObjectType from '../../common/model/CAVObjectType.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberLineNode from '../../common/view/NumberLineNode.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianPlotNodeOptions = SelfOptions & CAVPlotNodeOptions & PickRequired<CAVPlotNodeOptions, 'tandem'>;

export default class MeanAndMedianPlotNode extends CAVPlotNode {

  private readonly medianBarNode = new MedianBarNode( {
    notchDirection: 'down',
    barStyle: 'continuous'
  } );

  public constructor( model: MeanAndMedianModel, sceneModel: CAVSceneModel, playAreaNumberLineNode: NumberLineNode, options: MeanAndMedianPlotNodeOptions ) {
    super( model, sceneModel, playAreaNumberLineNode, options );

    this.addChild( this.medianBarNode );

    const modelViewTransform = this.modelViewTransform;

    const updateMedianBarNode = () => {

      const sortedDots = _.sortBy( sceneModel.getActiveSoccerBalls().filter( soccerBall => soccerBall.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostSoccerBall = sortedDots[ 0 ];

      const medianValue = sceneModel.medianValueProperty.value;

      const MARGIN_Y = 5;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( model.isTopMedianVisibleProperty.value && leftmostSoccerBall && medianValue !== null ) {
        const highestDot = _.maxBy( sortedDots, object => object.positionProperty.value.y );
        const dotRadius = Math.abs( modelViewTransform.modelToViewDeltaY( CAVObjectType.SOCCER_BALL.radius ) );

        // No matter how high the stack of dots or x's is, we only want the median bar to go up to 5.
        // Assumes all the dots have the same radius. Also move up based on the notch height.
        // The model y-values are in meters, even for the data points. This helps us animate the line plot in sync with the play area.
        const barY = modelViewTransform.modelToViewY( Math.min( highestDot!.positionProperty.value.y, 5 * 2 * CAVObjectType.SOCCER_BALL.radius ) )
                     - dotRadius - MARGIN_Y - MedianBarNode.NOTCH_HEIGHT;

        const rightmostDot = sortedDots[ sortedDots.length - 1 ];
        assert && assert( leftmostSoccerBall.valueProperty.value !== null );
        const left = modelViewTransform.modelToViewX( leftmostSoccerBall.valueProperty.value! );
        assert && assert( rightmostDot.valueProperty.value !== null );
        const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );
        assert && assert( medianValue !== null );
        const medianPositionX = modelViewTransform.modelToViewX( medianValue );

        this.medianBarNode.setMedianBarShape( barY, left, medianPositionX, right, model.isMedianAnimationCompleteProperty.value );
      }
      else {
        this.medianBarNode.clear();
      }
    };
    sceneModel.objectChangedEmitter.addListener( updateMedianBarNode );
    model.isTopMedianVisibleProperty.link( updateMedianBarNode );
    if ( model instanceof MeanAndMedianModel ) {
      model.isMedianAnimationCompleteProperty.link( updateMedianBarNode );
    }
  }
}

centerAndVariability.register( 'MeanAndMedianPlotNode', MeanAndMedianPlotNode );