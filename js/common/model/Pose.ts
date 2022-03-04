// Copyright 2022, University of Colorado Boulder

/**
 * Ways a SoccerPlayer can be posed as part of the animation lifecycle.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndSpread from '../../centerAndSpread.js';

class Pose extends EnumerationValue {
  static STANDING = new Pose();
  static POISED_TO_KICK = new Pose();
  static KICKING = new Pose();

  static enumeration = new Enumeration( Pose );
}

centerAndSpread.register( 'Pose', Pose );
export default Pose;