// Copyright 2022, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import Pose from './Pose.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {};
type SoccerPlayerOptions =
  SelfOptions
  & PhetioObjectOptions
  & PickRequired<PhetioObjectOptions, 'tandem'>;

class SoccerPlayer extends PhetioObject {
  readonly poseProperty: Property<Pose>;
  readonly placeInLineProperty: NumberProperty;
  static SoccerPlayerIO: IOType;

  // Also used to determine the artwork for rendering the SoccerPlayerNode
  readonly initialPlaceInLine: number;

  timestampWhenPoisedBegan: number;

  constructor( placeInLine: number, providedOptions: SoccerPlayerOptions ) {

    const options = optionize<SoccerPlayerOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: SoccerPlayer.SoccerPlayerIO,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.placeInLineProperty = new NumberProperty( placeInLine, {
      tandem: options.tandem.createTandem( 'placeInLineProperty' )
    } );
    this.poseProperty = new Property<Pose>( Pose.STANDING );

    this.initialPlaceInLine = placeInLine;

    this.timestampWhenPoisedBegan = -1;  // Not yet poised.  TODO: use null for this case?  See https://github.com/phetsims/center-and-variability/issues/59
  }

  reset() {
    this.poseProperty.reset();
  }

  override dispose() {
    this.placeInLineProperty.dispose();
    super.dispose();
  }
}

SoccerPlayer.SoccerPlayerIO = new IOType( 'SoccerPlayerIO', {
  valueType: SoccerPlayer,
  toStateObject: ( soccerPlayer: SoccerPlayer ) => ( { initialPlaceInLine: soccerPlayer.initialPlaceInLine } ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ stateObject.initialPlaceInLine ];
  },
  stateSchema: {
    initialPlaceInLine: NumberIO
  }
} );

centerAndVariability.register( 'SoccerPlayer', SoccerPlayer );
export default SoccerPlayer;