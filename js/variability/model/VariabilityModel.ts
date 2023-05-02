// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Variability" class.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import DistributionType from './DistributionType.js';
import Property from '../../../../axon/js/Property.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VariabilityMeasure from './VariabilityMeasure.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';

type SelfOptions = EmptySelfOptions;
type VariabilityModelOptions = SelfOptions & CAVModelOptions;

export default class VariabilityModel extends CAVModel {
  private readonly initialized: boolean = false;

  public readonly selectedDistributionProperty: Property<DistributionType>;
  public readonly selectedVariabilityProperty: Property<VariabilityMeasure>;
  public readonly isShowingRangeProperty: Property<boolean>;
  public readonly isShowingIQRProperty: Property<boolean>;
  public readonly isShowingMADProperty: Property<boolean>;
  public readonly isInfoShowingProperty: Property<boolean>;
  public readonly isShowingPlayAreaVariabilityProperty: BooleanProperty;

  public readonly maxValueProperty: TReadOnlyProperty<number | null>;
  public readonly minValueProperty: TReadOnlyProperty<number | null>;
  public readonly rangeValueProperty: TReadOnlyProperty<number | null>;
  public readonly q1ValueProperty: Property<number | null>;
  public readonly q3ValueProperty: Property<number | null>;
  public readonly iqrValueProperty: TReadOnlyProperty<number | null>;
  public readonly madValueProperty: Property<number | null>;

  public constructor( options: VariabilityModelOptions ) {
    super( options );

    this.initialized = true;

    this.selectedDistributionProperty = new EnumerationProperty( DistributionType.KICKER_1, {
      tandem: options.tandem.createTandem( 'selectedDistributionProperty' )
    } );

    this.selectedVariabilityProperty = new EnumerationProperty( VariabilityMeasure.RANGE, {
      tandem: options.tandem.createTandem( 'selectedVariabilityProperty' )
    } );

    this.isShowingRangeProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingRangeProperty' )
    } );

    this.isShowingIQRProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingIQRProperty' )
    } );

    this.isShowingMADProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMADProperty' )
    } );

    this.isInfoShowingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isInfoShowingProperty' )
    } );

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
      return q3! - q1!;
    } );

    this.madValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'madValueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.isShowingPlayAreaVariabilityProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPlayAreaVariabilityProperty' )
    } );

    this.selectedDistributionProperty.link( distribution => {

      // TODO: the parent class sets this incorrectly on reset.
      // TODO: PhET-iO wants to be able to set these values. Maybe in the preferences, we would also add a "custom"
      //  option that would allow the user to specify the distribution parameters. Or for PhET-iO, and query parameters
      this.distributionProperty.value =
        distribution === DistributionType.KICKER_1 ? [ 0, 0, 0, 1, 3, 10, 18, 20, 18, 10, 3, 1, 0, 0, 0 ] :
        distribution === DistributionType.KICKER_2 ? [ 5, 5, 10, 10, 25, 30, 40, 50, 40, 30, 25, 10, 10, 5, 5 ] :
        distribution === DistributionType.KICKER_3 ? [ 6, 9, 11, 14, 11, 8, 6, 5, 5, 5, 5, 5, 5, 5, 5 ] :
          /*KICKER_4*/ [ 5, 5, 5, 5, 5, 5, 5, 5, 6, 8, 11, 14, 11, 9, 6 ];
    } );

    this.updateDataMeasures();
  }

  public override reset(): void {
    super.reset();
    this.selectedDistributionProperty.reset();
    this.selectedVariabilityProperty.reset();
    this.isShowingRangeProperty.reset();
    this.isShowingIQRProperty.reset();
    this.isShowingMADProperty.reset();
    this.isInfoShowingProperty.reset();
    this.madValueProperty.reset();

    this.updateDataMeasures();
  }

  protected override updateDataMeasures(): void {
    super.updateDataMeasures();

    if ( this.initialized ) {
      const sortedObjects = this.getSortedLandedObjects();

      // if there is enough data to calculate quartiles
      if ( sortedObjects.length >= 5 ) {

        // Split the array into lower and upper halves, ignoring the median value if there are an odd number of objects
        const splitIndex = Math.floor( sortedObjects.length / 2 );
        const lowerHalf = sortedObjects.slice( 0, splitIndex );
        const upperHalf = sortedObjects.slice( sortedObjects.length % 2 !== 0 ? splitIndex + 1 : splitIndex );

        // take the average to account for cases where there is more than one object contributing to the median
        this.q1ValueProperty.value = _.mean( CAVModel.getMedianObjectsFromSortedArray( lowerHalf ).map( obj => obj.valueProperty.value! ) );
        this.q3ValueProperty.value = _.mean( CAVModel.getMedianObjectsFromSortedArray( upperHalf ).map( obj => obj.valueProperty.value! ) );

        assert && assert( !isNaN( this.q1ValueProperty.value ) );
        assert && assert( !isNaN( this.q3ValueProperty.value ) );
      }
      else {
        this.q1ValueProperty.value = null;
        this.q3ValueProperty.value = null;
      }

      // Support call from superclass constructor
      if ( this.madValueProperty ) {
        this.madValueProperty.value = sortedObjects.length === 0 ? null :
                                      VariabilityModel.meanAbsoluteDeviation( sortedObjects.map( object => object.valueProperty.value! ) );
      }
    }
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