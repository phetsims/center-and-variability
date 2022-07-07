// Copyright 2022, University of Colorado Boulder

/**
 * Ways a SoccerPlayer can be posed as part of the animation lifecycle.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

class Pose extends EnumerationValue {
  public static STANDING = new Pose();
  public static POISED_TO_KICK = new Pose();
  public static KICKING = new Pose();

  private static enumeration = new Enumeration( Pose );
}

centerAndVariability.register( 'Pose', Pose );
export default Pose;