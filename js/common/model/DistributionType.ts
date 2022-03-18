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

const SKEWED_LEFT_DATA = [
  6, 9, 11, 14, 11,
  8, 6, 5, 5, 5,
  5, 5, 5, 5, 5
];
const SKEWED_RIGHT_DATA = SKEWED_LEFT_DATA.slice().reverse();

export class DistributionType extends EnumerationValue {
  static SKEWED_LEFT = new DistributionType( SKEWED_LEFT_DATA );
  static SKEWED_RIGHT = new DistributionType( SKEWED_RIGHT_DATA );
  static enumeration = new Enumeration( DistributionType );
  readonly data: ReadonlyArray<number>;

  constructor( data: ReadonlyArray<number> ) {
    super();
    this.data = data;
  }
}

centerAndVariability.register( 'DistributionType', DistributionType );