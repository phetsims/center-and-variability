// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Variability" class.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import SoccerModel from '../../common/model/SoccerModel.js';

class VariabilityModel extends SoccerModel {

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
export default VariabilityModel;