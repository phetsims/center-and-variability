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
  radius: number;
  static DATA_POINT = new CASObjectType( 1 ); // TODO: What should this be?
  static SOCCER_BALL = new CASObjectType( 0.3 );

  static enumeration = new Enumeration( CASObjectType );

  constructor( radius: number ) {
    super();
    this.radius = radius;
  }
}

centerAndSpread.register( 'CASObjectType', CASObjectType );
export default CASObjectType;