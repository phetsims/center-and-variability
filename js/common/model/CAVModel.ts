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
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberTone from '../../soccer-common/model/NumberTone.js';
import CAVSoccerSceneModel from './CAVSoccerSceneModel.js';
import CAVDragIndicatorModel from './CAVDragIndicatorModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectLiteralIO from '../../../../tandem/js/types/ObjectLiteralIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  instrumentPredictMeanProperty: boolean;
  instrumentDataPointVisibilityProperty: boolean;
} & PickRequired<PhetioObjectOptions, 'tandem'>;
export type CAVModelOptions = SelfOptions;

export default class CAVModel extends PhetioObject {

  public readonly dragIndicatorModel: CAVDragIndicatorModel;

  public readonly isPlayAreaMedianVisibleProperty: BooleanProperty; // Screens 1-3
  public readonly isPlayAreaMeanVisibleProperty: BooleanProperty;  // Screens 2-3
  public readonly isPredictMedianVisibleProperty: BooleanProperty; // Screens 1-2
  public readonly predictMedianValueProperty: NumberProperty; // Screens 1-2

  public readonly selectedSceneModelProperty: Property<CAVSoccerSceneModel>;

  public readonly isAccordionBoxExpandedProperty: Property<boolean>;
  public readonly soccerBallsInputEnabledProperty: Property<boolean>;
  public readonly isDataPointLayerVisibleProperty: Property<boolean>;

  public readonly isInfoVisibleProperty: Property<boolean>;

  public constructor( public readonly maxKicksProperty: TReadOnlyProperty<number>, public readonly sceneModels: CAVSoccerSceneModel[], providedOptions: CAVModelOptions ) {

    const options = optionize<CAVModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: CAVModelIO,
      phetioState: false,
      phetioDocumentation: 'The model for the "Center and Variability" simulation. Contains 1+ sceneModels which contains the data itself. Also includes settings, like selections for checkboxes.'
    }, providedOptions );

    super( options );

    this.isAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isAccordionBoxExpandedProperty' )
    } );

    this.isDataPointLayerVisibleProperty = new BooleanProperty( true, {
      tandem: options.instrumentDataPointVisibilityProperty ? options.tandem.createTandem( 'isDataPointLayerVisibleProperty' ) : Tandem.OPT_OUT
    } );

    this.isPlayAreaMeanVisibleProperty = new BooleanProperty( false, {
      tandem: options.instrumentPredictMeanProperty ? options.tandem.createTandem( 'isPlayAreaMeanVisibleProperty' ) : Tandem.OPT_OUT
    } );
    this.isPlayAreaMedianVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isPlayAreaMedianVisibleProperty' )
    } );

    this.isPredictMedianVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isPredictMedianVisibleProperty' )
    } );

    this.predictMedianValueProperty = new NumberProperty( 1, {

      // Assumes all physical ranges are the same
      range: CAVConstants.PHYSICAL_RANGE,
      tandem: options.tandem.createTandem( 'predictMedianValueProperty' )
    } );

    this.predictMedianValueProperty.lazyLink( median => {
      NumberTone.playMedian( median );
    } );

    this.selectedSceneModelProperty = new Property( sceneModels[ 0 ], {
      validValues: sceneModels,
      tandem: sceneModels.length === 1 ? Tandem.OPT_OUT : options.tandem.createTandem( 'selectedSceneModelProperty' ),
      phetioValueType: ReferenceIO( IOType.ObjectIO )
    } );

    this.selectedSceneModelProperty.link( selectedScene => {
      this.sceneModels.forEach( sceneModel => {
        sceneModel.isVisibleProperty.value = sceneModel === selectedScene;
      } );
    } );

    this.isInfoVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isInfoVisibleProperty' )
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
      tandem: options.tandem.createTandem( 'soccerBallsInputEnabledProperty' ),
      phetioDocumentation: 'Enable or disable input on the entire set of soccer balls.'
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

  // This function determines whether a value has crossed an integer or half-integer boundary, or lands exactly on an
  // integer or half-integer. It's used to trigger sound effects when a value moves past these boundaries or hits them
  // exactly. This is important for applications where the input method is discrete, such as keyboard input.
  public crossedCheckpoint( value1: number, value2: number ): boolean {

    // Check if both values are on opposite sides of an integer or land exactly on an integer
    const integerCheck = Math.floor( value1 ) !== Math.floor( value2 ) || value1 === Math.floor( value1 ) || value2 === Math.floor( value2 );

    // Check if both values are on opposite sides of a half integer or land exactly on a half integer
    const halfIntegerCheck = Math.floor( value1 * 2 ) !== Math.floor( value2 * 2 ) || value1 * 2 === Math.floor( value1 * 2 ) || value2 * 2 === Math.floor( value2 * 2 );

    return integerCheck || halfIntegerCheck;
  }


  public step( dt: number ): void {
    // Override in subclasses

    this.selectedSceneModelProperty.value.step( dt );
  }

  public reset(): void {
    this.predictMedianValueProperty.reset();

    this.isPlayAreaMeanVisibleProperty.reset();
    this.isPlayAreaMedianVisibleProperty.reset();

    this.isPredictMedianVisibleProperty.reset();

    this.sceneModels.forEach( sceneModel => sceneModel.reset() );
    this.selectedSceneModelProperty.reset();
    this.dragIndicatorModel.reset();
    this.isAccordionBoxExpandedProperty.reset();
  }
}

const CAVModelIO = new IOType( 'CAVModelIO', {
  valueType: CAVModel,
  methods: {
    setDataPoints: {
      returnType: VoidIO,
      parameterTypes: [ ArrayIO( NumberIO ) ],
      implementation: function( this: CAVModel, dataPoints: number[] ) {
        this.selectedSceneModelProperty.value.setDataPoints( dataPoints );
      },
      documentation: 'Sets the data points for the currently selected scene model.'
    },

    getDataPoints: {
      returnType: ArrayIO( NumberIO ),
      parameterTypes: [],
      implementation: function( this: CAVModel ) {
        return this.selectedSceneModelProperty.value.getSortedStackedObjects().map( soccerBall => soccerBall.valueProperty.value );
      },
      documentation: 'Gets the data points for the currently selected scene model.'
    },

    getCurrentSceneData: {
      returnType: ObjectLiteralIO,
      parameterTypes: [],
      implementation: function( this: CAVModel ) {
        return phet.phetio.phetioEngine.phetioStateEngine.getState( this.selectedSceneModelProperty.value );
      },
      documentation: 'Gets the PhET-iO state for the currently selected scene model.'
    }
  }
} );


centerAndVariability.register( 'CAVModel', CAVModel );