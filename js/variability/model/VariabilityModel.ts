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
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VariabilityMeasure from './VariabilityMeasure.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import VariabilitySceneModel from './VariabilitySceneModel.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import { DistributionStrategy } from '../../soccer-common/model/TKickDistanceStrategy.js';
import NumberTone from '../../soccer-common/model/NumberTone.js';

type SelfOptions = EmptySelfOptions;
type VariabilityModelOptions = SelfOptions & CAVModelOptions;

export default class VariabilityModel extends CAVModel {
  private readonly initialized: boolean = false;

  public readonly selectedVariabilityMeasureProperty: Property<VariabilityMeasure>;
  public readonly isRangeVisibleProperty: Property<boolean>;
  public readonly isIQRVisibleProperty: Property<boolean>;
  public readonly isMADVisibleProperty: Property<boolean>;
  public readonly isIntervalToolVisibleProperty: BooleanProperty;
  public readonly intervalTool1ValueProperty: NumberProperty;
  public readonly intervalTool2ValueProperty: NumberProperty;

  // The absolute value of the distance between the interval tool handles in meters. To work around inconsistent
  // intermediate values in the axon library, update this value once at the end of each step.
  // Used in sonification.
  public readonly intervalToolDeltaStableProperty: NumberProperty;

  public readonly variabilityModelResetInProgressProperty = new BooleanProperty( false );
  public readonly resetEmitter = new Emitter();
  public readonly variabilitySceneModels: VariabilitySceneModel[];

  public constructor( options: VariabilityModelOptions ) {

    const sceneModels = [
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, new DistributionStrategy( [ 0, 0, 0, 1, 3, 12, 20, 32, 20, 12, 3, 1, 0, 0, 0 ] ), { tandem: options.tandem.createTandem( 'sceneModel1' ) } ),
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, new DistributionStrategy( [ 3, 5, 10, 10, 25, 32, 45, 65, 45, 32, 25, 10, 10, 5, 3 ] ), { tandem: options.tandem.createTandem( 'sceneModel2' ) } ),
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, new DistributionStrategy( [ 10, 18, 30, 45, 26, 18, 10, 5, 4, 4, 4, 4, 4, 4, 4 ] ), { tandem: options.tandem.createTandem( 'sceneModel3' ) } ),
      new VariabilitySceneModel( MAX_KICKS_PROPERTY, new DistributionStrategy( [ 4, 4, 4, 4, 4, 4, 4, 5, 10, 18, 26, 45, 30, 18, 10 ] ), { tandem: options.tandem.createTandem( 'sceneModel4' ) } )
    ];

    sceneModels.forEach( sceneModel => {
      sceneModel.soccerBalls.forEach( soccerBall => {
        soccerBall.toneEmitter.addListener( value => {
          NumberTone.play( this, sceneModel, value );
        } );
      } );
    } );

    super( MAX_KICKS_PROPERTY, sceneModels, options );

    this.initialized = true;

    this.variabilitySceneModels = sceneModels;

    this.selectedVariabilityMeasureProperty = new EnumerationProperty( VariabilityMeasure.RANGE, {
      tandem: options.tandem.createTandem( 'selectedVariabilityMeasureProperty' )
    } );

    this.isRangeVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRangeVisibleProperty' )
    } );

    this.isIQRVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isIQRVisibleProperty' )
    } );

    this.isMADVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMADVisibleProperty' )
    } );

    this.isIntervalToolVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isIntervalToolVisibleProperty' )
    } );

    this.intervalTool1ValueProperty = new NumberProperty( 2, {
      range: CAVConstants.VARIABILITY_DRAG_RANGE,
      tandem: options.tandem.createTandem( 'intervalTool1ValueProperty' )
    } );
    this.intervalTool2ValueProperty = new NumberProperty( 3.4, {
      range: CAVConstants.VARIABILITY_DRAG_RANGE,
      tandem: options.tandem.createTandem( 'intervalTool2ValueProperty' )
    } );

    this.intervalToolDeltaStableProperty = new NumberProperty( Math.abs( this.intervalTool2ValueProperty.value - this.intervalTool1ValueProperty.value ), {} );
  }

  public override step( dt: number ): void {
    super.step( dt );

    this.intervalToolDeltaStableProperty.value = Math.abs( this.intervalTool2ValueProperty.value - this.intervalTool1ValueProperty.value );
  }

  public override reset(): void {
    this.variabilityModelResetInProgressProperty.value = true;
    super.reset();

    this.selectedVariabilityMeasureProperty.reset();
    this.isRangeVisibleProperty.reset();
    this.isIQRVisibleProperty.reset();
    this.isMADVisibleProperty.reset();
    this.isInfoVisibleProperty.reset();

    this.isIntervalToolVisibleProperty.reset();
    this.intervalTool1ValueProperty.reset();
    this.intervalTool2ValueProperty.reset();
    this.intervalToolDeltaStableProperty.reset();

    this.resetEmitter.emit();

    this.variabilityModelResetInProgressProperty.value = false;
  }

  public static meanAbsoluteDeviation( data: number[] ): number {

    // Calculate the mean
    const mean = data.reduce( ( sum, value ) => sum + value, 0 ) / data.length;

    // Calculate the absolute deviations
    const absoluteDeviations = data.map( value => Math.abs( value - mean ) );

    // Calculate the sum of absolute deviations
    const sumOfAbsoluteDeviations = absoluteDeviations.reduce( ( sum, value ) => sum + value, 0 );

    // Calculate the MAD
    const mad = sumOfAbsoluteDeviations / data.length;

    return mad;
  }
}

centerAndVariability.register( 'VariabilityModel', VariabilityModel );