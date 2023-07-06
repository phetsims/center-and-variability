// Copyright 2023, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import soccerCommon from '../soccerCommon.js';

/**
 * SoccerPlayerPhase is used to identify what part of the kicking phase a SoccerPlayer is currently in
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

export class SoccerPlayerPhase extends EnumerationValue {
  public static readonly INACTIVE = new SoccerPlayerPhase();
  public static readonly READY = new SoccerPlayerPhase();
  public static readonly POISED = new SoccerPlayerPhase();
  public static readonly KICKING = new SoccerPlayerPhase();
  private static readonly enumeration = new Enumeration( SoccerPlayerPhase );
}

soccerCommon.register( 'SoccerPlayerPhase', SoccerPlayerPhase );