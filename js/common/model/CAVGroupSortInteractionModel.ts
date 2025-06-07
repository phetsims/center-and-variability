// Copyright 2023-2024, University of Colorado Boulder

/**
 * CAVGroupSortInteractionModel is a subclass that adds logic to place the drag cue in a
 * spot that is not the median. Its role is to minimize the occurrence of drag cue and median indicator overlap by
 * default. This logic is ignored if there is a specific selection made by the groupSortInteraction (not just a default
 * heuristic).
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TProperty from '../../../../axon/js/TProperty.js';
import { GroupSelectModelOptions } from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSelectModel.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import SoccerCommonGroupSortInteractionModel from '../../../../soccer-common/js/model/SoccerCommonGroupSortInteractionModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVSoccerSceneModel from './CAVSoccerSceneModel.js';

// Empirically determined based on height of AccordionBox and play area. This may need to be adjusted if those change.
const MAX_HEIGHT = 8;

export default class CAVGroupSortInteractionModel<T extends CAVSoccerSceneModel = CAVSoccerSceneModel> extends SoccerCommonGroupSortInteractionModel<T> {

  public constructor( selectedSceneModelProperty: TProperty<T>,
                      selectedSceneStackedSoccerBallCountProperty: TProperty<number>,
                      selectedSceneMaxKicksProperty: TProperty<number>,
                      sceneModels: T[],
                      providedOptions?: GroupSelectModelOptions<SoccerBall> ) {
    super(
      selectedSceneModelProperty,
      selectedSceneStackedSoccerBallCountProperty,
      selectedSceneMaxKicksProperty,
      sceneModels,
      providedOptions
    );

    // The median is queried in the subclass implementation, so needs to trigger an update
    Multilink.multilinkAny( [
      ...sceneModels.map( sceneModel => sceneModel.medianValueProperty )
    ], () => this.updateSelectedGroupItem( this.selectedSceneModelProperty.value ) );
  }

  // This is an algorithm that can be used to get the best guess about where the sort indicator should be set to based
  // on the current state of the soccer balls. This selection will apply both to the mouse cue location and the group sort selection.
  public override updateSelectedGroupItem( sceneModel: T ): void {
    super.updateSelectedGroupItem( sceneModel );

    const selectedValue = this.selectedGroupItemProperty.value?.valueProperty.value ?? null;

    if ( !this.isKeyboardFocusedProperty.value &&
         !this.hasKeyboardSelectedGroupItemProperty.value &&
         selectedValue !== null ) {

      const stackHeight = sceneModel.getStackAtValue( selectedValue ).length;
      if ( selectedValue === sceneModel.medianValueProperty.value || stackHeight > MAX_HEIGHT ) {

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
          this.selectedGroupItemProperty.value = topBallsInReversedOrder
            .find( soccerBall => soccerBall.valueProperty.value !== sceneModel.medianValueProperty.value &&
                                 sceneModel.getStackAtValue( soccerBall.valueProperty.value! ).length <= MAX_HEIGHT )!;
        }
      }
    }
  }
}

centerAndVariability.register( 'CAVGroupSortInteractionModel', CAVGroupSortInteractionModel );