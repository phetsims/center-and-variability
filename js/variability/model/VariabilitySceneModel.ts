// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Variability" screen. This has 4 scene models with different distributions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import SoccerSceneModel from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CAVConstants from '../../common/CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Utils from '../../../../dot/js/Utils.js';
import Emitter from '../../../../axon/js/Emitter.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import VariabilitySoccerBall from './VariabilitySoccerBall.js';
import CharacterSet from '../../../../joist/js/preferences/CharacterSet.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { KickDistributionStrategySpecification } from '../../../../soccer-common/js/model/KickDistributionStrategy.js';

export default class VariabilitySceneModel extends CAVSoccerSceneModel<VariabilitySoccerBall> {

  public readonly maxValueProperty: TReadOnlyProperty<number | null>;
  public readonly minValueProperty: TReadOnlyProperty<number | null>;
  public readonly rangeValueProperty: TReadOnlyProperty<number | null>;
  public readonly q1ValueProperty: Property<number | null>;
  public readonly q3ValueProperty: Property<number | null>;
  public readonly iqrValueProperty: TReadOnlyProperty<number | null>;
  public readonly madValueProperty: Property<number | null>;

  private readonly initialized: boolean = false;
  public readonly variabilityDataMeasuresUpdatedEmitter: Emitter = new Emitter();

  public constructor( maxKicksProperty: TReadOnlyProperty<number>, kickDistributionStrategySpecification: KickDistributionStrategySpecification,
                      regionAndCultureProperty: Property<CharacterSet | null>, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {
    super(
      maxKicksProperty,
      CAVConstants.MAX_KICKS_VALUES,
      kickDistributionStrategySpecification,
      true,
      CAVConstants.PHYSICAL_RANGE,
      VariabilitySoccerBall.createSoccerBall,
      regionAndCultureProperty,
      options
    );

    this.maxValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.max;
    }, {
      tandem: options.tandem.createTandem( 'maxValueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.minValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.min;
    }, {
      tandem: options.tandem.createTandem( 'minValueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.rangeValueProperty = new DerivedProperty( [ this.maxValueProperty, this.minValueProperty ], ( max, min ) => {
      return ( max === null || min === null ) ? null : max - min;
    }, {
      tandem: options.tandem.createTandem( 'rangeValueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.q1ValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'q1ValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );
    this.q3ValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'q3ValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );
    this.iqrValueProperty = new DerivedProperty( [ this.q1ValueProperty, this.q3ValueProperty ], ( q1, q3 ) => {
      if ( q1 === null || q3 === null ) {
        return null;
      }
      else {
        return q3 - q1;
      }
    } );

    this.madValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'madValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
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