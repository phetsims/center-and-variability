// Copyright 2023, University of Colorado Boulder

/**
 * CAVModel is the model for the "Center and Variability" simulation. It contains one or more sceneModels which
 * contain the data itself. It also includes settings, such as selections for checkboxes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVConstants from '../CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Multilink from '../../../../axon/js/Multilink.js';
import CAVSoccerSceneModel from './CAVSoccerSceneModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectLiteralIO from '../../../../tandem/js/types/ObjectLiteralIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import SoccerModel from '../../../../soccer-common/js/model/SoccerModel.js';
import NumberTone from '../../../../soccer-common/js/model/NumberTone.js';

type SelfOptions = {
  instrumentMeanProperty: boolean;
  instrumentDataPointVisibilityProperty: boolean;
  accordionBoxTandem: Tandem;
} & PickRequired<PhetioObjectOptions, 'tandem'>;
export type CAVModelOptions = SelfOptions;

export default class CAVModel extends SoccerModel<CAVSoccerSceneModel> {

  public readonly isPlayAreaMedianVisibleProperty: BooleanProperty; // Screens 1-3
  public readonly isPlayAreaMeanVisibleProperty: BooleanProperty;  // Screens 2-3
  public readonly isPredictMedianVisibleProperty: BooleanProperty; // Screens 1-2
  public readonly predictMedianValueProperty: NumberProperty; // Screens 1-2

  public readonly isAccordionBoxExpandedProperty: Property<boolean>;
  public readonly isDataPointLayerVisibleProperty: Property<boolean>;

  public readonly infoButtonPressedEmitter: Emitter;

  public constructor( public readonly maxKicksProperty: TReadOnlyProperty<number>, sceneModels: CAVSoccerSceneModel[], providedOptions: CAVModelOptions ) {

    const options = optionize<CAVModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: CAVModelIO,
      phetioState: false,
      phetioDocumentation: 'The model for the "Center and Variability" simulation. Contains 1+ sceneModels which contains the data itself. Also includes settings, like selections for checkboxes.'
    }, providedOptions );

    super( sceneModels, options );

    sceneModels.forEach( sceneModel => {
      sceneModel.soccerBalls.forEach( soccerBall => {
        soccerBall.toneEmitter.addListener( value => {
          NumberTone.play(
            this.isPlayAreaMedianVisibleProperty.value,
            this.isPlayAreaMeanVisibleProperty.value,
            sceneModel.medianValueProperty.value,
            sceneModel.meanValueProperty.value,
            value );
        } );
      } );
    } );

    this.isAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.accordionBoxTandem.createTandem( 'expandedProperty' ),
      phetioFeatured: true
    } );

    this.isDataPointLayerVisibleProperty = new BooleanProperty( true, {
      tandem: options.instrumentDataPointVisibilityProperty ? options.accordionBoxTandem.createTandem( 'isDataPointLayerVisibleProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'Sets the visibility of the entire set of data points in the accordion box.'
    } );

    this.isPlayAreaMeanVisibleProperty = new BooleanProperty( false, options.instrumentMeanProperty ? {
      tandem: this.soccerAreaTandem.createTandem( 'isMeanVisibleProperty' ),
      phetioFeatured: true
    } : {} );
    this.isPlayAreaMedianVisibleProperty = new BooleanProperty( false, {
      tandem: this.soccerAreaTandem.createTandem( 'isMedianVisibleProperty' ),
      phetioFeatured: true
    } );

    this.isPredictMedianVisibleProperty = new BooleanProperty( false, sceneModels.length === 1 ? {

      // Only the Median and Mean & Median screens have a predictMedian tool. They only have one scene model each.
      tandem: this.soccerAreaTandem.createTandem( 'isPredictMedianVisibleProperty' ),
      phetioFeatured: true
    } : {} );

    this.predictMedianValueProperty = new NumberProperty( 1, _.assignIn( {
      range: CAVConstants.PHYSICAL_RANGE
    }, sceneModels.length === 1 ? {
      tandem: this.soccerAreaTandem.createTandem( 'predictMedianValueProperty' ),
      phetioFeatured: true
    } : {} ) );

    this.predictMedianValueProperty.lazyLink( median => {
      NumberTone.playMedian( median );
    } );

    this.infoButtonPressedEmitter = new Emitter();

    const allValueProperties = sceneModels.flatMap( sceneModel => sceneModel.soccerBalls.map( soccerBall => soccerBall.valueProperty ) );

    // It is important to link to the values of all the soccer balls in the screen, so that the dragIndicator can be
    // updated after all the balls have landed, and not just after they have been kicked.
    Multilink.multilinkAny( [ ...allValueProperties, this.selectedSceneModelProperty,
      this.groupSortInteractionModel.groupItemHasBeenDraggedProperty, this.selectedSceneStackedSoccerBallCountProperty,
      this.selectedSceneMaxKicksProperty, this.groupSortInteractionModel.isKeyboardFocusedProperty,

      // The median is queried in the subclass implementation, so needs to trigger an update
      ...this.sceneModels.map( sceneModel => sceneModel.medianValueProperty )
    ], () => {
      this.groupSortInteractionModel.updateDragIndicator(
        this.selectedSceneModelProperty.value,
        this.selectedSceneStackedSoccerBallCountProperty.value,
        this.selectedSceneMaxKicksProperty.value
      );

      this.groupSortInteractionModel.moveToFocus( this.groupSortInteractionModel.focusedGroupItemProperty.value );
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

  public override reset(): void {
    super.reset();

    this.predictMedianValueProperty.reset();

    this.isPlayAreaMeanVisibleProperty.reset();
    this.isPlayAreaMedianVisibleProperty.reset();

    this.isPredictMedianVisibleProperty.reset();

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