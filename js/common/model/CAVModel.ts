// Copyright 2023, University of Colorado Boulder

/**
 * The model for the "Center and Variability" simulation. Contains 1+ sceneModels which contains the data itself.
 * Also includes settings, like selections for checkboxes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */


// TODO: I think we'll want base class SoccerContextModel that CAV Model can extend from, see: https://github.com/phetsims/center-and-variability/issues/222
// If not, then we will at least want a DragIndicatorModel that can be generalized.
// The properties that we want: isDragIndicatorVisibleProperty, dragIndicatorValueProperty, objectNodesInputEnabledProperty
// soccerBallHasBeenDraggedProperty.
// The methods that we want: updateDragIndicator, reset
import centerAndVariability from '../../centerAndVariability.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVConstants from '../CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberTone from '../../soccer-common/model/NumberTone.js';
import CAVSoccerSceneModel from './CAVSoccerSceneModel.js';
import CAVDragIndicatorModel from './CAVDragIndicatorModel.js';

type SelfOptions = {
  tandem: Tandem;
  instrumentMeanPredictionProperty: boolean;
};
export type CAVModelOptions = SelfOptions;

export default class CAVModel {

  public readonly dragIndicatorModel: CAVDragIndicatorModel;

  public readonly isPlayAreaMedianVisibleProperty: BooleanProperty; // Screens 1-3
  public readonly isPlayAreaMeanVisibleProperty: BooleanProperty;  // Screens 2-3
  public readonly isMedianPredictionVisibleProperty: BooleanProperty; // Screens 1-2
  public readonly medianPredictionProperty: NumberProperty; // Screens 1-2

  public readonly selectedSceneModelProperty: Property<CAVSoccerSceneModel>;

  public readonly isAccordionBoxExpandedProperty: Property<boolean>;
  public readonly soccerBallsInputEnabledProperty: Property<boolean>;

  public constructor( public readonly maxKicksProperty: Property<number>, public readonly sceneModels: CAVSoccerSceneModel[], options: CAVModelOptions ) {

    this.isAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isAccordionBoxExpandedProperty' )
    } );

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
      NumberTone.playMedian( median );
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


    // These DynamicProperties allow us to track all the necessary scenes Properties for dragIndicator update, and not
    // just the first selectedScene
    const selectedSceneStackedSoccerBallCountProperty = new DynamicProperty<number, number, CAVSoccerSceneModel>( this.selectedSceneModelProperty, {
      derive: 'stackedSoccerBallCountProperty'
    } );
    const selectedSceneMaxKicksProperty = new DynamicProperty<number, number, CAVSoccerSceneModel>( this.selectedSceneModelProperty, {
      derive: 'maxKicksProperty'
    } );

    const allValueProperties = sceneModels.flatMap( sceneModel => sceneModel.soccerBalls.map( soccerBall => soccerBall.valueProperty ) );

    this.soccerBallsInputEnabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'soccerBallsInputEnabledProperty' )
    } );

    this.dragIndicatorModel = new CAVDragIndicatorModel( this.soccerBallsInputEnabledProperty, { tandem: options.tandem.createTandem( 'dragIndicatorModel' ) } );

    // It is important to link to the values of all the soccer balls in the screen, so that the dragIndicator can be
    // updated after all the balls have landed, and not just after they have been kicked.
    Multilink.multilinkAny( [ ...allValueProperties, this.selectedSceneModelProperty,
      this.dragIndicatorModel.soccerBallHasBeenDraggedProperty, selectedSceneStackedSoccerBallCountProperty,
      selectedSceneMaxKicksProperty
    ], () => {
      this.dragIndicatorModel.updateDragIndicator( this.selectedSceneModelProperty.value, this.dragIndicatorModel.soccerBallHasBeenDraggedProperty.value,
        selectedSceneStackedSoccerBallCountProperty.value, selectedSceneMaxKicksProperty.value );
    } );
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
    this.dragIndicatorModel.reset();

    this.maxKicksProperty.reset();

    this.isAccordionBoxExpandedProperty.reset();
  }
}

centerAndVariability.register( 'CAVModel', CAVModel );