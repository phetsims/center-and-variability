// Copyright 2023, University of Colorado Boulder

/**
 * The model for the "Center and Variability" simulation. Contains 1+ sceneModels which contains the data itself.
 * Also includes settings, like selections for checkboxes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVConstants from '../CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import CAVSceneModel from './CAVSceneModel.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import NumberTone from './NumberTone.js';

type SelfOptions = {
  tandem: Tandem;
  instrumentMeanPredictionProperty: boolean;
};
export type CAVModelOptions = SelfOptions;

export default class CAVModel {

  public readonly isDragIndicatorVisibleProperty: Property<boolean>; // Screens 1-3
  public readonly dragIndicatorValueProperty: Property<number | null>;
  public readonly objectNodesInputEnabledProperty: Property<boolean>; // Screens 1-3

  public readonly isPlayAreaMedianVisibleProperty: BooleanProperty; // Screens 1-3
  public readonly isPlayAreaMeanVisibleProperty: BooleanProperty;  // Screens 2-3
  public readonly isMedianPredictionVisibleProperty: BooleanProperty; // Screens 1-2
  public readonly medianPredictionProperty: NumberProperty; // Screens 1-2

  public readonly selectedSceneModelProperty: Property<CAVSceneModel>;
  public readonly soccerBallHasBeenDraggedProperty: Property<boolean>;

  public constructor( public readonly maxKicksProperty: Property<number>, public readonly sceneModels: CAVSceneModel[], options: CAVModelOptions ) {

    this.isPlayAreaMeanVisibleProperty = new BooleanProperty( false, {
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'isPlayAreaMeanVisibleProperty' ) : Tandem.OPT_OUT
    } );
    this.isPlayAreaMedianVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isPlayAreaMedianVisibleProperty' )
    } );

    this.isMedianPredictionVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMedianPredictionVisibleProperty' )
    } );

    this.medianPredictionProperty = new NumberProperty( 1, {

      // Assumes all physical ranges are the same
      range: CAVConstants.PHYSICAL_RANGE,
      tandem: options.tandem.createTandem( 'medianPredictionProperty' )
    } );


    this.medianPredictionProperty.link( median => {
      NumberTone.play( median );
    } );

    this.selectedSceneModelProperty = new Property( sceneModels[ 0 ], {
      validValues: sceneModels,
      tandem: options.tandem.createTandem( 'selectedSceneModelProperty' ),
      phetioValueType: ReferenceIO( IOType.ObjectIO )
    } );

    this.selectedSceneModelProperty.link( selectedScene => {
      this.sceneModels.forEach( sceneModel => {
        sceneModel.isVisibleProperty.value = sceneModel === selectedScene;
      } );
    } );

    this.soccerBallHasBeenDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'soccerBallHasBeenDraggedProperty' )
    } );

    const objectNodeGroupTandem = options.tandem.createTandem( 'soccerBallNodeGroup' );

    this.objectNodesInputEnabledProperty = new BooleanProperty( true, {
      tandem: objectNodeGroupTandem.createTandem( 'inputEnabledProperty' )
    } );

    // These DynamicProperties allow us to track all the necessary scenes Properties for dragIndicator update, and not
    // just the first selectedScene
    const selectedSceneSoccerBallCountProperty = new DynamicProperty<number, number, CAVSceneModel>( this.selectedSceneModelProperty, {
      derive: 'soccerBallCountProperty'
    } );
    const selectedSceneMaxKicksProperty = new DynamicProperty<number, number, CAVSceneModel>( this.selectedSceneModelProperty, {
      derive: 'maxKicksProperty'
    } );

    this.isDragIndicatorVisibleProperty = new BooleanProperty( false, { tandem: options.tandem.createTandem( 'isDragIndicatorVisibleProperty' ) } );

    // Cannot take a range, since it is nullable
    this.dragIndicatorValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'dragIndicatorValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );

    const allValueProperties = sceneModels.flatMap( sceneModel => sceneModel.soccerBalls.map( soccerBall => soccerBall.valueProperty ) );

    // It is important to link to the values of all the soccer balls in the screen, so that the dragIndicator can be
    // updated after all the balls have landed, and not just after they have been kicked.
    Multilink.multilinkAny( [ ...allValueProperties, this.selectedSceneModelProperty,
      this.soccerBallHasBeenDraggedProperty, selectedSceneSoccerBallCountProperty,
      selectedSceneMaxKicksProperty
    ], () => {
      this.updateDragIndicator( this.selectedSceneModelProperty.value, this.soccerBallHasBeenDraggedProperty.value,
        selectedSceneSoccerBallCountProperty.value, selectedSceneMaxKicksProperty.value );
    } );
  }

  private updateDragIndicator( selectedSceneModel: CAVSceneModel, soccerBallHasBeenDragged: boolean, soccerBallCount: number, maxKicks: number ): void {

    //  if an object was moved, objects are not input enabled, or the max number of balls haven't been kicked out
    //  don't show the dragIndicatorArrowNode
    const indicatorVisible = !soccerBallHasBeenDragged &&
                             soccerBallCount === maxKicks &&
                             this.objectNodesInputEnabledProperty.value &&
                             _.every( selectedSceneModel?.getActiveSoccerBalls(), soccerBall => soccerBall.valueProperty.value !== null );
    this.isDragIndicatorVisibleProperty.value = indicatorVisible;

    if ( indicatorVisible ) {
      const selectedSceneModel = this.selectedSceneModelProperty.value;
      const reversedBalls = selectedSceneModel.getActiveSoccerBalls().reverse();

      // add the dragIndicatorArrowNode above the last object when it is added to the play area.
      // However, we also want to make sure that the dragIndicator is not in the same position as the Median Indicator, if possible
      const allEqualToMedian = reversedBalls.every( soccerBall => soccerBall.valueProperty.value === selectedSceneModel.medianValueProperty.value );

      if ( allEqualToMedian ) {

        // If all soccer balls are in the same stack, show the dragIndicator above that stack
        this.dragIndicatorValueProperty.value = selectedSceneModel.medianValueProperty.value;
      }
      else {

        // Otherwise, show it over a recently landed ball that is not in the median stack
        const value = reversedBalls
          .find( soccerBall => soccerBall.valueProperty.value !== selectedSceneModel.medianValueProperty.value )!
          .valueProperty.value!;

        this.dragIndicatorValueProperty.value = value;
      }
    }
  }

  public step( dt: number ): void {
    // Override in subclasses

    this.selectedSceneModelProperty.value.step( dt );
  }

  public reset(): void {
    this.medianPredictionProperty.reset();

    this.isPlayAreaMeanVisibleProperty.reset();
    this.isPlayAreaMedianVisibleProperty.reset();

    this.isMedianPredictionVisibleProperty.reset();

    this.sceneModels.forEach( sceneModel => sceneModel.reset() );
    this.selectedSceneModelProperty.reset();
    this.soccerBallHasBeenDraggedProperty.reset();

    this.maxKicksProperty.reset();
  }
}

centerAndVariability.register( 'CAVModel', CAVModel );