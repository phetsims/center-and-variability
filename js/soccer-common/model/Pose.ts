// Copyright 2022-2023, University of Colorado Boulder

/**
 * Ways a Kicker can be posed as part of the animation lifecycle.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */


import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import soccerCommon from '../soccerCommon.js';

export default class Pose extends EnumerationValue {
  public static readonly STANDING = new Pose();
  public static readonly POISED_TO_KICK = new Pose();
  public static readonly KICKING = new Pose();

  private static readonly enumeration = new Enumeration( Pose );
}

soccerCommon.register( 'Pose', Pose );