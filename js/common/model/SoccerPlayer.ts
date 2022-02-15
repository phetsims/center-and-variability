// Copyright 2022, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

type SoccerPlayerSelfOptions = {};
type SoccerPlayerOptions = SoccerPlayerSelfOptions & PhetioObjectOptions & Required<Pick<PhetioObjectOptions, 'tandem'>>;

class SoccerPlayer extends PhetioObject {
  readonly isKickingProperty: BooleanProperty;

  constructor( options: SoccerPlayerOptions ) {
    super( options );

    this.isKickingProperty = new BooleanProperty( false );
  }

  reset() {
    this.isKickingProperty.reset();
  }
}

centerAndSpread.register( 'SoccerPlayer', SoccerPlayer );
export default SoccerPlayer;