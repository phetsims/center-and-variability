// Copyright 2023, University of Colorado Boulder

/**
 * Class with static methods for playing the corresponding notes for the median animation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import numberTone2_mp3 from '../../../sounds/numberTone2_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import centerAndVariability from '../../centerAndVariability.js';
import NumberTone, { toStepDiscrete } from '../../soccer-common/model/NumberTone.js';

// This is the dominant frequency of numberTone2_mp3. If the audio file is changed, this will need to be updated.
// const E3 = 164.81; // Hz // TODO: https://github.com/phetsims/center-and-variability/issues/253 do we need filters
// TODO https://github.com/phetsims/center-and-variability/issues/253 Start with the Marimba sound for the counting down animation and use the Woodblock for the final number readout of the median.

const INITIAL_OUTPUT_LEVEL = 0.1;
const soundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL
} );
soundManager.addSoundGenerator( soundClip );

// Filter to make the median sound different from the main sound
const medianFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 0.5
} );

// Filter to make the mean sound different from the main sound and from the median sound
const meanFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 2
} );

const upperSoundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ medianFilter ]
} );

const lowerSoundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ medianFilter ]
} );

const meanSoundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ meanFilter ]
} );

soundManager.addSoundGenerator( upperSoundClip );
soundManager.addSoundGenerator( lowerSoundClip );
soundManager.addSoundGenerator( meanSoundClip );

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

  public static playIntermediateTone( index: number, numberOfSteps: number, median: number ): void {

    // compute the lower note based on the pentatonic scale.  If index===numberOfSteps, we should arrive at median
    const numberOfStepsAwayFromMedian = numberOfSteps - index;
    // console.log( 'playIntermediateTone', index, numberOfSteps, median, numberOfStepsAwayFromMedian );

    const upperPlaybackRate = toPlaybackRate( median, numberOfStepsAwayFromMedian );
    upperSoundClip.setPlaybackRate( upperPlaybackRate );
    upperSoundClip.play();

    const lowerPlaybackRate = toPlaybackRate( median, -numberOfStepsAwayFromMedian );
    lowerSoundClip.setPlaybackRate( lowerPlaybackRate );
    lowerSoundClip.play();
  }

  public static playFinalTone( index: number, numberOfSteps: number, median: number ): void {

    console.log( 'playFinalTone' );

    // NumberTone.playMedian( median );
  }
}

centerAndVariability.register( 'MedianAnimationTone', MedianAnimationTone );