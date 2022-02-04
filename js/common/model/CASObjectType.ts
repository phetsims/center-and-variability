// Copyright 2022, University of Colorado Boulder

/**
 * Object types for this sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndSpread from '../../centerAndSpread.js';

class CASObjectType extends EnumerationValue {
  static DATA_POINT = new CASObjectType();
  static SOCCER_BALL = new CASObjectType();

  static enumeration = new Enumeration( CASObjectType );
}

centerAndSpread.register( 'CASObjectType', CASObjectType );
export default CASObjectType;