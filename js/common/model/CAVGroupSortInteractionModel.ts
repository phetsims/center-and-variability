// Copyright 2023, University of Colorado Boulder

/**
 * CAVDragIndicatorModel is a subclass of the DragIndicatorModel that adds logic to place the drag indicator in a
 * spot that is not the median. Its role is to minimize the occurrence of drag indicator and median indicator overlap.
 * TODO: https://github.com/phetsims/scenery-phet/issues/815
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVSoccerSceneModel from './CAVSoccerSceneModel.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import GroupSortInteractionModel from '../../../../soccer-common/js/model/GroupSortInteractionModel.js';

// TODO: use this again, https://github.com/phetsims/scenery-phet/issues/815
export default class CAVGroupSortInteractionModel extends GroupSortInteractionModel<SoccerBall> {

  public override updateDragIndicator( sceneModel: Pick<CAVSoccerSceneModel, 'getSortedStackedObjects' | 'getStackAtValue' | 'medianValueProperty' | 'getTopSoccerBalls' | 'getActiveSoccerBalls'>, soccerBallCount: number, maxKicks: number ): void {
    super.updateDragIndicator( sceneModel, soccerBallCount, maxKicks );

    // Empirically determined based on height of AccordionBox and play area. This may need to be adjusted if those change.
    const maxHeight = 8;

    if ( this.dragIndicatorValueProperty.value !== null ) {
      const stackHeight = sceneModel.getStackAtValue( this.dragIndicatorValueProperty.value ).length;
      if ( this.dragIndicatorValueProperty.value === sceneModel.medianValueProperty.value || stackHeight > maxHeight ) {

        // Order kicked, not order landed
        const topBallsInReversedOrder = sceneModel.getActiveSoccerBalls().reverse().filter(
          ball => sceneModel.getTopSoccerBalls().includes( ball )
        );

        // add the dragIndicatorArrowNode above the last object when it is added to the play area.
        // However, we also want to make sure that the dragIndicator is not in the same position as the Median Indicator, if possible
        // Note the drag indicator only shows up after 15 soccer balls have landed, and it would be impossibly likely for
        // all 15 to be the same value unless using the ?sameSpot query parameter, which is not a public query parameter.
        const allEqualToMedian = topBallsInReversedOrder.every( soccerBall => soccerBall.valueProperty.value === sceneModel.medianValueProperty.value );

        if ( !allEqualToMedian ) {

          // Show it over a recently landed ball that is not in the median stack
          this.dragIndicatorValueProperty.value = topBallsInReversedOrder
            .find( soccerBall => soccerBall.valueProperty.value !== sceneModel.medianValueProperty.value &&
                                 sceneModel.getStackAtValue( soccerBall.valueProperty.value! ).length <= maxHeight )!
            .valueProperty.value!;
        }
      }
    }
  }

  public override moveToFocus( focusedSoccerBall: SoccerBall | null ): void {
    if ( focusedSoccerBall !== null ) {
      // If there is a focused soccer ball, i.e. a soccer ball that has been selected or tabbed to via the keyboard,
      // that takes precedence for indication.
      this.dragIndicatorValueProperty.value = focusedSoccerBall.valueProperty.value;
    }
  }
}

centerAndVariability.register( 'CAVGroupSortInteractionModel', CAVGroupSortInteractionModel );