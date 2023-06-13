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
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVSoccerSceneModel from './CAVSoccerSceneModel.js';


export default class CAVDragIndicatorModel extends DragIndicatorModel {

  public constructor( options: { tandem: Tandem } ) {
   super( options );
  }

  public override updateDragIndicator( sceneModel: CAVSoccerSceneModel, soccerBallHasBeenDragged: boolean, soccerBallCount: number, maxKicks: number ): void {
    super.updateDragIndicator( sceneModel, soccerBallHasBeenDragged, soccerBallCount, maxKicks );

    if ( this.isDragIndicatorVisibleProperty.value && this.dragIndicatorValueProperty.value === sceneModel.medianValueProperty.value ) {
      const reversedBalls = sceneModel.getActiveSoccerBalls().reverse();

      // add the dragIndicatorArrowNode above the last object when it is added to the play area.
      // However, we also want to make sure that the dragIndicator is not in the same position as the Median Indicator, if possible
      const allEqualToMedian = reversedBalls.every( soccerBall => soccerBall.valueProperty.value === sceneModel.medianValueProperty.value );

      if ( allEqualToMedian ) {

        // If all soccer balls are in the same stack, show the dragIndicator above that stack
        this.dragIndicatorValueProperty.value = sceneModel.medianValueProperty.value;
      }
      else {

        // Otherwise, show it over a recently landed ball that is not in the median stack
        this.dragIndicatorValueProperty.value = reversedBalls
          .find( soccerBall => soccerBall.valueProperty.value !== sceneModel.medianValueProperty.value )!
          .valueProperty.value!;
      }
    }
  }
}

centerAndVariability.register( 'CAVDragIndicatorModel', CAVDragIndicatorModel );