// Copyright 2022, University of Colorado Boulder

/**
 * Object types for this sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

class CAVObjectType extends EnumerationValue {
  radius: number;
  static DATA_POINT = new CAVObjectType( 1 );
  static SOCCER_BALL = new CAVObjectType( 0.3 );

  // TODO: This term is confusing because sometimes these are rendered as 'x' marks
  static DOT = new CAVObjectType( 0.127 );

  static enumeration = new Enumeration( CAVObjectType );

  constructor( radius: number ) {
    super();
    this.radius = radius;
  }
}

centerAndVariability.register( 'CAVObjectType', CAVObjectType );
export default CAVObjectType;