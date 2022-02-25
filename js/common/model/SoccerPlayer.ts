// Copyright 2022, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioObject, { PhetioObjectOptions, RequiredTandem } from '../../../../tandem/js/PhetioObject.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SoccerPlayerSelfOptions = {};
type SoccerPlayerOptions =
  SoccerPlayerSelfOptions
  & PhetioObjectOptions
  & RequiredTandem;

class SoccerPlayer extends PhetioObject {
  readonly isKickingProperty: BooleanProperty;
  readonly placeInLineProperty: NumberProperty;
  static SoccerPlayerIO: IOType;
  readonly initialPlaceInLine: number; // For debugging with ?dev

  constructor( placeInLine: number, providedOptions: SoccerPlayerOptions ) {

    const options = optionize<SoccerPlayerOptions, SoccerPlayerSelfOptions, PhetioObjectOptions>( {
      phetioType: SoccerPlayer.SoccerPlayerIO,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    // TODO: Instrument for state
    this.placeInLineProperty = new NumberProperty( placeInLine );
    this.isKickingProperty = new BooleanProperty( false );

    // For debugging with ?dev
    this.initialPlaceInLine = placeInLine;
  }

  reset() {
    this.isKickingProperty.reset();
  }
}

SoccerPlayer.SoccerPlayerIO = new IOType( 'SoccerPlayerIO', {
  valueType: SoccerPlayer,
  toStateObject: ( soccerPlayer: SoccerPlayer ) => ( { placeInLine: soccerPlayer.placeInLineProperty.value } ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ stateObject.placeInLine ];
  },
  stateSchema: {
    placeInLine: NumberIO
  }
} );

centerAndSpread.register( 'SoccerPlayer', SoccerPlayer );
export default SoccerPlayer;