// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Variability" class.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import SoccerModel, { SoccerModelOptions } from '../../common/model/SoccerModel.js';
import DistributionType from './DistributionType.js';
import Property from '../../../../axon/js/Property.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VariabilityMeasure from './VariabilityMeasure.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVConstants from '../../common/CAVConstants.js';

type SelfOptions = EmptySelfOptions;
type VariabilityModelOptions = SelfOptions & SoccerModelOptions;

export default class VariabilityModel extends SoccerModel {
  public readonly selectedDistributionProperty: Property<DistributionType>;
  public readonly selectedVariabilityProperty: Property<VariabilityMeasure>;
  public readonly isShowingRangeProperty: Property<boolean>;
  public readonly isShowingIQRProperty: Property<boolean>;
  public readonly isShowingMADProperty: Property<boolean>;
  public readonly isInfoShowingProperty: Property<boolean>;

  public constructor( options: VariabilityModelOptions ) {
    super( options );
    this.selectedDistributionProperty = new EnumerationProperty( DistributionType.UNIFORM, {
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

    function gaussian( x: number, mu: number, sigma: number ): number {
      const coefficient = 1.0 / Math.sqrt( 2.0 * Math.PI * Math.pow( sigma, 2 ) );
      const exponent = Math.exp( -Math.pow( x - mu, 2 ) / ( 2 * Math.pow( sigma, 2 ) ) );
      return coefficient * exponent;
    }

    // TODO-design: Decide on sigma?
    const GAUSSIAN = _.range( 1, 16 ).map( x => gaussian( x, 8, 2 ) );

    this.selectedDistributionProperty.link( distribution => {

      // TODO: the parent class sets this incorrectly on reset
      this.distributionProperty.value =
        distribution === DistributionType.UNIFORM ? [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] :
        distribution === DistributionType.GAUSSIAN ? GAUSSIAN :

          // TODO-design - is this the right distribution, or should it be left or switch between them?
        distribution === DistributionType.SKEWED ? CAVConstants.RIGHT_SKEWED_DATA :

          // Bimodal
          // TODO-design: want to choose this distribution?
          [ 1, 3, 5, 7, 4, 1, 1, 1, 1, 1, 4, 7, 5, 3, 1 ];
    } );
  }

  public override reset(): void {
    super.reset();
    this.selectedDistributionProperty.reset();
    this.selectedVariabilityProperty.reset();
    this.isShowingRangeProperty.reset();
    this.isShowingIQRProperty.reset();
    this.isShowingMADProperty.reset();
    this.isInfoShowingProperty.reset();
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