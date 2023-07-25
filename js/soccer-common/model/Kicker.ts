// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from '../soccerCommon.js';
import Pose from './Pose.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { KickerPhase } from './KickerPhase.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class Kicker {
  public readonly soccerPlayerPhaseProperty: Property<KickerPhase>;
  public readonly poseProperty: TReadOnlyProperty<Pose>;
  public readonly timestampWhenPoisedBeganProperty: Property<number | null>;

  // Used to determine the artwork for rendering the SoccerPlayerNode
  public readonly initialPlaceInLine: number;

  public constructor( placeInLine: number, tandem: Tandem ) {
    this.soccerPlayerPhaseProperty = new EnumerationProperty( placeInLine === 0 ? KickerPhase.READY : KickerPhase.INACTIVE, {
      tandem: tandem.createTandem( 'soccerPlayerPhaseProperty' )
    } );
    this.poseProperty = new DerivedProperty( [ this.soccerPlayerPhaseProperty ], soccerPlayerPhase => {
      if ( soccerPlayerPhase === KickerPhase.POISED ) {
        return Pose.POISED_TO_KICK;
      }
      else if ( soccerPlayerPhase === KickerPhase.KICKING ) {
        return Pose.KICKING;
      }
      else {
        return Pose.STANDING;
      }
    } );
    this.timestampWhenPoisedBeganProperty = new Property<number | null>( null, {
      tandem: tandem.createTandem( 'timestampWhenPoisedBeganProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );
    this.initialPlaceInLine = placeInLine;
  }

  public reset(): void {
    this.soccerPlayerPhaseProperty.reset();
    this.timestampWhenPoisedBeganProperty.reset();
  }
}

soccerCommon.register( 'Kicker', Kicker );