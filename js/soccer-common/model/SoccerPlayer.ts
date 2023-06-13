// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from '../soccerCommon.js';
import Pose from './Pose.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

export default class SoccerPlayer {
  public readonly poseProperty;

  // Also used to determine the artwork for rendering the SoccerPlayerNode
  public readonly initialPlaceInLine: number;

  public readonly timestampWhenPoisedBeganProperty: Property<number | null>;
  public readonly isActiveProperty: BooleanProperty;

  public constructor( placeInLine: number, tandem: Tandem ) {
    this.poseProperty = new EnumerationProperty( Pose.STANDING, {
      tandem: tandem.createTandem( 'poseProperty' )
    } );
    this.isActiveProperty = new BooleanProperty( placeInLine === 0, {
      tandem: tandem.createTandem( 'isActiveProperty' )
    } );
    this.timestampWhenPoisedBeganProperty = new Property<number | null>( null, {
      tandem: tandem.createTandem( 'timestampWhenPoisedBeganProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );
    this.initialPlaceInLine = placeInLine;
  }

  public reset(): void {
    this.poseProperty.reset();
    this.timestampWhenPoisedBeganProperty.reset();
    this.isActiveProperty.reset();
  }
}

soccerCommon.register( 'SoccerPlayer', SoccerPlayer );