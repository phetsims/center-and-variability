// Copyright 2022-2025, University of Colorado Boulder

/**
 * VariabilitySceneModel represents an individual scene in the "Variability" screen. Each scene is characterized by
 * a specific distribution of soccer balls on the field. The model provides functionality for various measures
 * of variability, including the range, quartiles (Q1, Q3), interquartile range (IQR), and the mean absolute deviation (MAD).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import KickDistributionStrategy from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import SoccerSceneModel from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import VariabilitySoccerBall from './VariabilitySoccerBall.js';

export default class VariabilitySceneModel extends CAVSoccerSceneModel<VariabilitySoccerBall> {

  // The maximum value of the stacked soccer balls
  public readonly maxValueProperty: TReadOnlyProperty<number | null>;

  // The minimum value of the stacked soccer balls
  public readonly minValueProperty: TReadOnlyProperty<number | null>;

  // The range of the stacked soccer ball data (max - min)
  public readonly rangeValueProperty: TReadOnlyProperty<number | null>;

  // The value of the first quartile boundary for the stacked soccer balls
  public readonly q1ValueProperty: Property<number | null>;

  // The value of the third quartile boundary for the stacked soccer balls
  public readonly q3ValueProperty: Property<number | null>;

  // The value of the interquartile range (IQR) for the stacked soccer balls
  public readonly iqrValueProperty: TReadOnlyProperty<number | null>;

  // The value of the mean absolute deviation (MAD) for the stacked soccer balls
  public readonly madValueProperty: Property<number | null>;

  // Whether the constructor has completed for this scene
  private readonly initialized: boolean = false;

  // Fired when the data measures should be updated for the current set of stacked soccer balls
  public readonly variabilityDataMeasuresUpdatedEmitter: Emitter = new Emitter();

  public constructor( maxKicksProperty: TReadOnlyProperty<number>, kickDistributionStrategy: KickDistributionStrategy,
                      public readonly kickerSceneColor: TColor, public readonly accessibleName: TReadOnlyProperty<string>,
                      tandem: Tandem ) {
    super(
      maxKicksProperty,
      CAVConstants.MAX_KICKS_VALUES,
      kickDistributionStrategy,
      CAVConstants.PHYSICAL_RANGE,
      VariabilitySoccerBall.createSoccerBall,
      {
        tandem: tandem,
        isSingleKickerScene: true
      }
    );

    this.maxValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.max;
    }, {
      tandem: tandem.createTandem( 'maxValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: true,
      hasListenerOrderDependencies: true
    } );

    this.minValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.min;
    }, {
      tandem: tandem.createTandem( 'minValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: true,
      hasListenerOrderDependencies: true
    } );

    this.rangeValueProperty = new DerivedProperty( [ this.maxValueProperty, this.minValueProperty ], ( max, min ) => {
      return ( max === null || min === null ) ? null : max - min;
    }, {
      tandem: tandem.createTandem( 'rangeValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: true,
      hasListenerOrderDependencies: true
    } );

    this.q1ValueProperty = new Property<number | null>( null, {
      tandem: tandem.createTandem( 'q1ValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioFeatured: true,
      hasListenerOrderDependencies: true
    } );
    this.q3ValueProperty = new Property<number | null>( null, {
      tandem: tandem.createTandem( 'q3ValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioFeatured: true,
      hasListenerOrderDependencies: true
    } );
    this.iqrValueProperty = new DerivedProperty( [ this.q1ValueProperty, this.q3ValueProperty ], ( q1, q3 ) => {
      if ( q1 === null || q3 === null ) {
        return null;
      }
      else {
        return q3 - q1;
      }
    }, {
      hasListenerOrderDependencies: true,
      tandem: tandem.createTandem( 'iqrValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: true
    } );

    this.madValueProperty = new Property<number | null>( null, {
      tandem: tandem.createTandem( 'madValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioFeatured: true,
      hasListenerOrderDependencies: true
    } );

    this.updateDataMeasures();
    this.initialized = true;
  }

  public getDeviationForBallValue( value: number ): number {
    const deviation = Math.abs( value - this.meanValueProperty.value! );
    return Utils.roundToInterval( deviation, 0.1 );
  }

  public getDeviationTenths(): number[] {
    const values = this.getSortedStackedObjects().map( landedObject => landedObject.valueProperty.value! );
    return values.map( value => this.getDeviationForBallValue( value ) );
  }

  public getSumOfDeviationTenths(): number {
    return Utils.roundToInterval( this.getDeviationTenths().reduce( ( a, b ) => a + b, 0 ), 0.1 );
  }

  protected override updateDataMeasures(): void {
    super.updateDataMeasures();

    if ( this.isClearingData || isSettingPhetioStateProperty.value ) {
      return;
    }

    if ( this.initialized ) {
      const sortedObjects = this.getSortedStackedObjects();

      // if there is enough data to calculate quartiles
      if ( sortedObjects.length >= 5 ) {

        // Split the array into lower and upper halves, ignoring the median value if there are an odd number of objects
        const splitIndex = Math.floor( sortedObjects.length / 2 );
        const lowerHalf = sortedObjects.slice( 0, splitIndex );
        const upperHalf = sortedObjects.slice( sortedObjects.length % 2 !== 0 ? splitIndex + 1 : splitIndex );

        const q1Objects = SoccerSceneModel.getMedianObjectsFromSortedArray( lowerHalf );
        const q3Objects = SoccerSceneModel.getMedianObjectsFromSortedArray( upperHalf );

        // take the average to account for cases where there is more than one object contributing to the median
        const q1Values = q1Objects.map( obj => obj.valueProperty.value! );
        const q3Values = q3Objects.map( obj => obj.valueProperty.value! );

        const q1 = _.mean( q1Values );
        const q3 = _.mean( q3Values );

        assert && assert( q1 <= q3, 'q1 must be less than q3' );

        this.q1ValueProperty.value = q1;
        this.q3ValueProperty.value = q3;

        this.soccerBalls.forEach( object => {
          object.isQ1ObjectProperty.value = q1Objects.includes( object );
          object.isQ3ObjectProperty.value = q3Objects.includes( object );
        } );

        assert && assert( !isNaN( this.q1ValueProperty.value ) );
        assert && assert( !isNaN( this.q3ValueProperty.value ) );
      }
      else {
        this.q1ValueProperty.value = null;
        this.q3ValueProperty.value = null;
      }

      // Support call from superclass constructor
      if ( this.madValueProperty ) {

        // The calculation is rounded to tenths to match the values that are displayed on the scene
        this.madValueProperty.value = sortedObjects.length === 0 ? null : Utils.roundToInterval( this.getSumOfDeviationTenths() / sortedObjects.length, 0.1 );
      }

      this.variabilityDataMeasuresUpdatedEmitter.emit();
    }
  }

}

centerAndVariability.register( 'VariabilitySceneModel', VariabilitySceneModel );