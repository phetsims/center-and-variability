// Copyright 2021-2022, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * Different distributions for the soccer screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

// Right skewed means most of the data is on the left, see https://github.com/phetsims/center-and-variability/issues/112
const RIGHT_SKEWED_DATA = [
  6, 9, 11, 14, 11,
  8, 6, 5, 5, 5,
  5, 5, 5, 5, 5
];
const LEFT_SKEWED_DATA = RIGHT_SKEWED_DATA.slice().reverse();

export class DistributionType extends EnumerationValue {
  static LEFT_SKEWED = new DistributionType( LEFT_SKEWED_DATA );
  static RIGHT_SKEWED = new DistributionType( RIGHT_SKEWED_DATA );
  static enumeration = new Enumeration( DistributionType );
  readonly data: ReadonlyArray<number>;

  constructor( data: ReadonlyArray<number> ) {
    super();
    this.data = data;
  }
}

centerAndVariability.register( 'DistributionType', DistributionType );