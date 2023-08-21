// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Variability" class.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import Property from '../../../../axon/js/Property.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VariabilityMeasure from './VariabilityMeasure.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import VariabilitySceneModel from './VariabilitySceneModel.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import NumberTone from '../../common/model/NumberTone.js';
import Utils from '../../../../dot/js/Utils.js';
import SoccerCommonPreferencesModel from '../../../../soccer-common/js/model/SoccerCommonPreferencesModel.js';

type SelfOptions = EmptySelfOptions;
type VariabilityModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

export default class VariabilityModel extends CAVModel {

  //REVIEW document fields
  public readonly selectedVariabilityMeasureProperty: Property<VariabilityMeasure>;
  public readonly isRangeVisibleProperty: Property<boolean>;
  public readonly isIQRVisibleProperty: Property<boolean>;
  public readonly isMADVisibleProperty: Property<boolean>;

  public readonly isPointerVisibleProperty: Property<boolean>;
  public readonly pointerValueProperty: Property<number>;
  public readonly isPointerKeyboardDraggingProperty: Property<boolean>;

  public readonly isIntervalToolVisibleProperty: Property<boolean>;
  public readonly isIntervalToolInputEnabledProperty: Property<boolean>;
  public readonly intervalTool1ValueProperty: NumberProperty;
  public readonly intervalTool2ValueProperty: NumberProperty;

  // The absolute value of the distance between the interval tool handles in meters. To work around inconsistent
  // intermediate values in the axon library, update this value once at the end of each step.
  // Used in sonification.
  public readonly intervalToolDeltaStableProperty: Property<number>;

  public readonly variabilityModelResetInProgressProperty = new BooleanProperty( false );
  public readonly resetEmitter = new Emitter();
  public readonly variabilitySceneModels: VariabilitySceneModel[];

  public constructor( preferencesModel: SoccerCommonPreferencesModel, providedOptions: VariabilityModelOptions ) {

    const sceneModels = [
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, { type: 'probabilityByDistance', values: [ 0, 0, 0, 1, 3, 12, 20, 32, 20, 12, 3, 1, 0, 0, 0 ], skewType: null }, preferencesModel.kickerCharacterSetProperty, providedOptions.tandem.createTandem( 'sceneKicker1Model' ) ),
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, { type: 'probabilityByDistance', values: [ 3, 5, 10, 10, 25, 32, 45, 65, 45, 32, 25, 10, 10, 5, 3 ], skewType: null }, preferencesModel.kickerCharacterSetProperty, providedOptions.tandem.createTandem( 'sceneKicker2Model' ) ),
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, { type: 'skew', values: null, skewType: 'right' }, preferencesModel.kickerCharacterSetProperty, providedOptions.tandem.createTandem( 'sceneKicker3Model' ) ),
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, { type: 'skew', values: null, skewType: 'left' }, preferencesModel.kickerCharacterSetProperty, providedOptions.tandem.createTandem( 'sceneKicker4Model' ) )
    ];

    const accordionBoxTandem = providedOptions.tandem.createTandem( 'variabilityMeasureAccordionBox' );

    const options = optionize<VariabilityModelOptions, SelfOptions, CAVModelOptions>()( {
      accordionBoxTandem: accordionBoxTandem,
      instrumentMeanProperty: true,
      instrumentDataPointVisibilityProperty: true
    }, providedOptions );

    super( MAX_KICKS_PROPERTY, sceneModels, options );

    this.variabilitySceneModels = sceneModels;

    this.selectedVariabilityMeasureProperty = new EnumerationProperty( VariabilityMeasure.RANGE, {
      tandem: accordionBoxTandem.createTandem( 'selectedVariabilityMeasureProperty' ),
      phetioFeatured: true
    } );

    this.isRangeVisibleProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isRangeVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Sets the visibility of the range. Only relevant when the range radio button is active.'
    } );

    this.isIQRVisibleProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isIQRVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Sets the visibility of the IQR. Only relevant when the IQR radio button is active.'
    } );

    this.isMADVisibleProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isMADVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Sets the visibility of the MAD. Only relevant when the MAD radio button is active.'
    } );

    const pointerTandem = this.playAreaTandem.createTandem( 'pointer' );

    this.isPointerVisibleProperty = new BooleanProperty( false, {
      tandem: pointerTandem.createTandem( 'isPointerVisibleProperty' ),
      phetioFeatured: true
    } );

    this.pointerValueProperty = new NumberProperty( 5, {
      tandem: pointerTandem.createTandem( 'pointerValueProperty' ),
      phetioFeatured: true
    } );

    this.isPointerKeyboardDraggingProperty = new BooleanProperty( false );

    const intervalToolTandem = this.playAreaTandem.createTandem( 'intervalTool' );

    this.isIntervalToolVisibleProperty = new BooleanProperty( false, {
      tandem: intervalToolTandem.createTandem( 'isVisibleProperty' ),
      phetioFeatured: true
    } );

    this.isIntervalToolInputEnabledProperty = new BooleanProperty( true, {
      tandem: intervalToolTandem.createTandem( 'isInputEnabledProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'When false, the interval cannot be translated left/right, but the handles are still moveable/interactive.'
    } );

    this.intervalTool1ValueProperty = new NumberProperty( 1.7, {
      range: CAVConstants.VARIABILITY_DRAG_RANGE,
      tandem: intervalToolTandem.createTandem( 'handle1ValueProperty' ),
      phetioFeatured: true
    } );
    this.intervalTool2ValueProperty = new NumberProperty( 3.4, {
      range: CAVConstants.VARIABILITY_DRAG_RANGE,
      tandem: intervalToolTandem.createTandem( 'handle2ValueProperty' ),
      phetioFeatured: true
    } );

    this.intervalToolDeltaStableProperty = new NumberProperty( this.getIntervalToolWidth() );

    this.pointerValueProperty.lazyLink( ( value, oldValue ) => {
      if ( this.isPointerKeyboardDraggingProperty.value ) {
        NumberTone.playMean( value );
      }
      else if ( this.crossedCheckpoint( value, oldValue ) ) {
        NumberTone.playMean( Utils.roundToInterval( value, 0.5 ) );
      }
    } );
  }

  /**
   * Gets the distance (a non-negative number) between the interval tool handles
   */
  private getIntervalToolWidth(): number {
    return Math.abs( this.intervalTool2ValueProperty.value - this.intervalTool1ValueProperty.value );
  }

  public override step( dt: number ): void {
    super.step( dt );

    this.intervalToolDeltaStableProperty.value = this.getIntervalToolWidth();
  }

  public override reset(): void {
    this.variabilityModelResetInProgressProperty.value = true;
    super.reset();

    this.selectedVariabilityMeasureProperty.reset();
    this.isRangeVisibleProperty.reset();
    this.isIQRVisibleProperty.reset();
    this.isMADVisibleProperty.reset();

    this.isIntervalToolVisibleProperty.reset();
    this.intervalTool1ValueProperty.reset();
    this.intervalTool2ValueProperty.reset();
    this.intervalToolDeltaStableProperty.reset();

    this.pointerValueProperty.reset();
    this.isPointerVisibleProperty.reset();

    this.resetEmitter.emit();

    this.variabilityModelResetInProgressProperty.value = false;
  }
}

centerAndVariability.register( 'VariabilityModel', VariabilityModel );