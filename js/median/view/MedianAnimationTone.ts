// Copyright 2023-2024, University of Colorado Boulder

/**
 * The MedianAnimationTone class contains static methods for playing the corresponding notes for the median animation
 * (when the median checkbox in the accordion box is checked). The notes are played using pairwise/stepwise notes
 * in the pentatonic scale.  For instance, if there are 5 data points, then it plays the outermost pair with an
 * upper pitch note and lower pitch note, then the next pair, and so on. In this case, for a total of 3 "pairs" of notes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberTone, { toStepDiscrete } from '../../../../soccer-common/js/model/NumberTone.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import marimbaToneE3_mp3 from '../../../sounds/marimbaToneE3_mp3.js';
import centerAndVariability from '../../centerAndVariability.js';

const INITIAL_OUTPUT_LEVEL = 0.2;

// The higher pitched note in the pair
const upperSoundClip = new SoundClip( marimbaToneE3_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL
} );

// The lower pitched note in the pair
const lowerSoundClip = new SoundClip( marimbaToneE3_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL
} );

soundManager.addSoundGenerator( upperSoundClip );
soundManager.addSoundGenerator( lowerSoundClip );

centerAndVariability.register( 'NumberTone', NumberTone );

/**
 * Get the corresponding step above a base frequency for a note in the pentatonic scale.
 *
 * @param value - The base frequency.
 * @param animationStepsAway - The number of steps away from the base note in the pentatonic scale.
 * @returns The corresponding step in the pentatonic scale.
 */
const toStepDiscretePentatonic = ( value: number, animationStepsAway: number ): number => {

  // Get the step for the base frequency in the chromatic scale
  const fundamental = toStepDiscrete( value );

  // Define the number of steps away from the base note for each note in the pentatonic scale within one octave
  const stepsInPattern = animationStepsAway >= 0 ? [ 0, 2, 4, 7, 9 ] : [ 0, 3, 5, 8, 10 ];

  // Determine how many octaves away the desired note is from the base note
  const octave = Math.floor( Math.abs( animationStepsAway ) / 5 );

  // Determine which note in the pentatonic scale pattern the desired note is
  const indexInPattern = Math.abs( animationStepsAway ) % 5;

  // Calculate the total number of steps away from the base note
  const stepsAway = stepsInPattern[ indexInPattern ] + octave * 12;

  // For negative animationStepsAway, we subtract stepsAway from the fundamental. For positive, we add.
  return animationStepsAway >= 0 ? fundamental + stepsAway : fundamental - stepsAway;
};

/**
 * Given a numeric value, return the playback speed that will play the corresponding note.
 */
const toPlaybackRate = ( value: number, stepsAway: number ): number => {
  return Math.pow( 2, toStepDiscretePentatonic( value, stepsAway ) / 12 );
};

export default class MedianAnimationTone {

  public static playIntermediateTone( numberOfStepsAwayFromMedian: number, median: number ): void {

    upperSoundClip.setPlaybackRate( toPlaybackRate( median, numberOfStepsAwayFromMedian ) );
    upperSoundClip.play();

    lowerSoundClip.setPlaybackRate( toPlaybackRate( median, -numberOfStepsAwayFromMedian ) );
    lowerSoundClip.play();
  }

  public static playFinalTone( median: number ): void {

    // Wood block
    NumberTone.playValue( median );
  }
}

centerAndVariability.register( 'MedianAnimationTone', MedianAnimationTone );