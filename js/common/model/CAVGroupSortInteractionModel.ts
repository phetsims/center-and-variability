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
import GroupSortInteractionModel, { GroupSortInteractionModelOptions } from '../../../../soccer-common/js/model/GroupSortInteractionModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';

// TODO: use this again, https://github.com/phetsims/scenery-phet/issues/815
export default class CAVGroupSortInteractionModel extends GroupSortInteractionModel<SoccerBall> {

  public constructor( private readonly selectedSceneModelProperty: TProperty<CAVSoccerSceneModel>,
                      private readonly selectedSceneStackedSoccerBallCountProperty: TProperty<number>,
                      private readonly selectedSceneMaxKicksProperty: TProperty<number>,
                      sortEnabledProperty: TReadOnlyProperty<boolean>, providedOptions: GroupSortInteractionModelOptions ) {
    super( sortEnabledProperty, providedOptions );
  }

  // This is an algorithm that can be used to get the best guess about where the sort indicator should be set to based
  // on the current state of the soccer balls.
  public override updateSortIndicator(): void {

    const soccerBallCount = this.selectedSceneStackedSoccerBallCountProperty.value;
    const maxKicks = this.selectedSceneMaxKicksProperty.value;
    const sceneModel = this.selectedSceneModelProperty.value;

    //  If an object was sorted, objects are not input enabled, or the max number of balls haven't been kicked out
    //  don't show the sortIndicatorCue.
    this.sortIndicatorCueVisibleProperty.value = !this.hasGroupItemBeenSortedProperty.value &&
                                                 !this.isKeyboardFocusedProperty.value &&
                                                 soccerBallCount === maxKicks &&
                                                 this.sortEnabledProperty.value &&
                                                 _.every( sceneModel?.getActiveSoccerBalls(), soccerBall => soccerBall.valueProperty.value !== null );

    const reversedBalls = sceneModel.getActiveSoccerBalls().filter( soccerBall => soccerBall.valueProperty.value !== null ).reverse();

    // Show the sort indicator over the most recently landed ball
    this.sortIndicatorValueProperty.value = reversedBalls.length > 0 ? reversedBalls[ 0 ].valueProperty.value : null;

    // TODO: Should the above algorithm be in soccer-common? https://github.com/phetsims/scenery-phet/issues/815
    /////////////////

    // Empirically determined based on height of AccordionBox and play area. This may need to be adjusted if those change.
    const maxHeight = 8;

    if ( this.sortIndicatorValueProperty.value !== null ) {
      const stackHeight = sceneModel.getStackAtValue( this.sortIndicatorValueProperty.value ).length;
      if ( this.sortIndicatorValueProperty.value === sceneModel.medianValueProperty.value || stackHeight > maxHeight ) {

        // Order kicked, not order landed
        const topBallsInReversedOrder = sceneModel.getActiveSoccerBalls().reverse().filter(
          ball => sceneModel.getTopSoccerBalls().includes( ball )
        );

        // add the sortIndicatorArrowNode above the last object when it is added to the play area.
        // However, we also want to make sure that the dragIndicator is not in the same position as the Median Indicator, if possible
        // Note the drag indicator only shows up after 15 soccer balls have landed, and it would be impossibly likely for
        // all 15 to be the same value unless using the ?sameSpot query parameter, which is not a public query parameter.
        const allEqualToMedian = topBallsInReversedOrder.every( soccerBall => soccerBall.valueProperty.value === sceneModel.medianValueProperty.value );

        if ( !allEqualToMedian ) {

          // Show it over a recently landed ball that is not in the median stack
          this.sortIndicatorValueProperty.value = topBallsInReversedOrder
            .find( soccerBall => soccerBall.valueProperty.value !== sceneModel.medianValueProperty.value &&
                                 sceneModel.getStackAtValue( soccerBall.valueProperty.value! ).length <= maxHeight )!
            .valueProperty.value!;
        }
      }
    }

    // A focused group item will overwrite any heuristic from above.
    this.moveSortIndicatorToFocusedGroupItem();
  }
}

centerAndVariability.register( 'CAVGroupSortInteractionModel', CAVGroupSortInteractionModel );