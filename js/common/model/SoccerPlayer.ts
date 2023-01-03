// Copyright 2022-2023, University of Colorado Boulder

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
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import Pose from './Pose.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;
type SoccerPlayerOptions =
  SelfOptions
  & PhetioObjectOptions
  & PickRequired<PhetioObjectOptions, 'tandem'>;

class SoccerPlayer extends PhetioObject {
  public readonly poseProperty: Property<Pose>;
  public readonly placeInLineProperty: NumberProperty;
  public static readonly SoccerPlayerIO = new IOType( 'SoccerPlayerIO', {
    valueType: SoccerPlayer,
    toStateObject: ( soccerPlayer: SoccerPlayer ) => ( { initialPlaceInLine: soccerPlayer.initialPlaceInLine } ),
    stateObjectToCreateElementArguments: ( stateObject: SoccerPlayerState ) => {
      return [ stateObject.initialPlaceInLine ];
    },
    stateSchema: {
      initialPlaceInLine: NumberIO
    }
  } );

  // Also used to determine the artwork for rendering the SoccerPlayerNode
  public readonly initialPlaceInLine: number;

  public timestampWhenPoisedBegan: number;

  public constructor( placeInLine: number, providedOptions: SoccerPlayerOptions ) {

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

  public reset(): void {
    this.poseProperty.reset();
  }

  public override dispose(): void {
    this.placeInLineProperty.dispose();
    super.dispose();
  }
}

type SoccerPlayerState = {
  initialPlaceInLine: number;
};

centerAndVariability.register( 'SoccerPlayer', SoccerPlayer );
export default SoccerPlayer;