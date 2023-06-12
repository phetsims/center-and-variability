// Copyright 2023, University of Colorado Boulder

/**
 * A model that tracks whether soccerBalls have been dragged or not.
 * Will also determine if the dragIndicator needs to be visible.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 *
 */

import soccerCommon from '../soccerCommon.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import CAVSceneModel from './CAVSceneModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class DragIndicatorModel {
  public readonly isDragIndicatorVisibleProperty: Property<boolean>; // Screens 1-3
  public readonly dragIndicatorValueProperty: Property<number | null>;
  public readonly objectNodesInputEnabledProperty: Property<boolean>; // Screens 1-3
  public readonly soccerBallHasBeenDraggedProperty: Property<boolean>;

  public constructor( options: { tandem: Tandem } ) {

    this.soccerBallHasBeenDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'soccerBallHasBeenDraggedProperty' )
    } );

    const objectNodeGroupTandem = options.tandem.createTandem( 'soccerBallNodeGroup' );

    this.objectNodesInputEnabledProperty = new BooleanProperty( true, {
      tandem: objectNodeGroupTandem.createTandem( 'inputEnabledProperty' )
    } );

    this.isDragIndicatorVisibleProperty = new BooleanProperty( false, { tandem: options.tandem.createTandem( 'isDragIndicatorVisibleProperty' ) } );

    // Cannot take a range, since it is nullable
    this.dragIndicatorValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'dragIndicatorValueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );
  }

  public updateDragIndicator( sceneModel: CAVSceneModel, soccerBallHasBeenDragged: boolean, soccerBallCount: number, maxKicks: number ): void {

    //  if an object was moved, objects are not input enabled, or the max number of balls haven't been kicked out
    //  don't show the dragIndicatorArrowNode
    const indicatorVisible = !soccerBallHasBeenDragged &&
                             soccerBallCount === maxKicks &&
                             this.objectNodesInputEnabledProperty.value &&
                             _.every( sceneModel?.getActiveSoccerBalls(), soccerBall => soccerBall.valueProperty.value !== null );
    this.isDragIndicatorVisibleProperty.value = indicatorVisible;

    if ( indicatorVisible ) {
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
        const value = reversedBalls
          .find( soccerBall => soccerBall.valueProperty.value !== sceneModel.medianValueProperty.value )!
          .valueProperty.value!;

        this.dragIndicatorValueProperty.value = value;
      }
    }
  }

  public reset(): void {
    this.soccerBallHasBeenDraggedProperty.reset();
  }
}

soccerCommon.register( 'DragIndicatorModel', DragIndicatorModel );