// Copyright 2023, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * SoccerBallPhase is used to identify what type of animation a SoccerBall is undergoing.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

// TODO: This needs to move to the common repo, see: https://github.com/phetsims/center-and-variability/issues/222

export class SoccerBallPhase extends EnumerationValue {
  public static readonly INACTIVE = new SoccerBallPhase();
  public static readonly READY = new SoccerBallPhase();
  public static readonly FLYING = new SoccerBallPhase();
  public static readonly STACKING = new SoccerBallPhase();
  public static readonly STACKED = new SoccerBallPhase();
  private static readonly enumeration = new Enumeration( SoccerBallPhase );
}

centerAndVariability.register( 'SoccerBallPhase', SoccerBallPhase );