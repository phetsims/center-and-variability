// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of the DragIndicatorModel that adds logic to place the drag indicator in some other spot that
 * is not the median. This is to minimize occurrence of drag indicator and median indicator overlap.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DragIndicatorModel from '../../soccer-common/model/DragIndicatorModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVSoccerSceneModel from './CAVSoccerSceneModel.js';

export default class CAVDragIndicatorModel extends DragIndicatorModel {

  public override updateDragIndicator( sceneModel: CAVSoccerSceneModel, soccerBallHasBeenDragged: boolean, soccerBallCount: number, maxKicks: number ): void {
    super.updateDragIndicator( sceneModel, soccerBallHasBeenDragged, soccerBallCount, maxKicks );

    // Empirically determined based on height of AccordionBox and play area. This may need to be adjusted if those change.
    const maxHeight = 8;

    if ( this.dragIndicatorValueProperty.value !== null ) {
      const stackHeight = sceneModel.getStackAtLocation( this.dragIndicatorValueProperty.value ).length;
      if ( this.isDragIndicatorVisibleProperty.value && ( this.dragIndicatorValueProperty.value === sceneModel.medianValueProperty.value || stackHeight > maxHeight ) ) {
        const reversedBalls = sceneModel.getActiveSoccerBalls().reverse();

        // add the dragIndicatorArrowNode above the last object when it is added to the play area.
        // However, we also want to make sure that the dragIndicator is not in the same position as the Median Indicator, if possible
        // Note the drag indicator only shows up after 15 soccer balls have landed, and it would be impossibly likely for
        // all 15 to be the same value unless using the ?sameSpot query parameter, which is not a public query parameter.
        const allEqualToMedian = reversedBalls.every( soccerBall => soccerBall.valueProperty.value === sceneModel.medianValueProperty.value );

        if ( !allEqualToMedian ) {

          // Show it over a recently landed ball that is not in the median stack
          this.dragIndicatorValueProperty.value = reversedBalls
            .find( soccerBall => soccerBall.valueProperty.value !== sceneModel.medianValueProperty.value &&
                                 sceneModel.getStackAtLocation( soccerBall.valueProperty.value! ).length <= maxHeight )!
            .valueProperty.value!;
        }
      }
    }
  }

}

centerAndVariability.register( 'CAVDragIndicatorModel', CAVDragIndicatorModel );