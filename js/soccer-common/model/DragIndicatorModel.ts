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
import SoccerSceneModel from './SoccerSceneModel.js';
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

  public updateDragIndicator( sceneModel: SoccerSceneModel, soccerBallHasBeenDragged: boolean, soccerBallCount: number, maxKicks: number ): void {

    //  if an object was moved, objects are not input enabled, or the max number of balls haven't been kicked out
    //  don't show the dragIndicatorArrowNode
    this.isDragIndicatorVisibleProperty.value = !soccerBallHasBeenDragged &&
                                                soccerBallCount === maxKicks &&
                                                this.objectNodesInputEnabledProperty.value &&
                                                _.every( sceneModel?.getActiveSoccerBalls(), soccerBall => soccerBall.valueProperty.value !== null );

    if ( this.isDragIndicatorVisibleProperty.value ) {
      const reversedBalls = sceneModel.getActiveSoccerBalls().reverse();

      // Show the drag indicator over the most recently landed ball
      this.dragIndicatorValueProperty.value = reversedBalls[ 0 ].valueProperty.value;
    }
  }

  public reset(): void {
    this.soccerBallHasBeenDraggedProperty.reset();
  }
}

soccerCommon.register( 'DragIndicatorModel', DragIndicatorModel );