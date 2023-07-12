// Copyright 2023, University of Colorado Boulder

/**
 * Class with static methods for playing the corresponding notes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import numberTone2_mp3 from '../../../sounds/numberTone2_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soccerCommon from '../soccerCommon.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import Utils from '../../../../dot/js/Utils.js';
// eslint-disable-next-line soccer-common-cannot-reference-center-and-variability
import CAVModel from '../../common/model/CAVModel.js';
// eslint-disable-next-line soccer-common-cannot-reference-center-and-variability
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

// This is the dominant frequency of numberTone2_mp3. If the audio file is changed, this will need to be updated.
const E3 = 164.81; // Hz

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

const medianSoundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ medianFilter ]
} );

const meanSoundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ meanFilter ]
} );

soundManager.addSoundGenerator( medianSoundClip );
soundManager.addSoundGenerator( meanSoundClip );

/**
 * Identify the corresponding step above a base frequency for a note. This will be used to map to a playback speed
 * to play at the appropriate pitch. Note we have to add an extra note between E and F to keep the rest of the
 * scale corresponding to the desired pitches.
 *
 * Also note, this is the discrete version and for the continuous mean values, there is a linear interpolation of the
 * steps.
 */
export const toStepDiscrete = ( value: number ): number => {
  assert && assert( value >= 0 && value <= 18, `value ${value} is out of range` );
  const step =
    value === 0 ? 0 : // C
    value === 0.5 ? 1 : // C#
    value === 1 ? 2 : // D
    value === 1.5 ? 3 : // D#
    value === 2 ? 4 : // E
    value === 2.5 ? 4.5 : // FAKE
    value === 3 ? 5 : // F
    value === 3.5 ? 6 : // F#
    value === 4 ? 7 : // G
    value === 4.5 ? 8 : // G#
    value === 5 ? 9 : // A
    value === 5.5 ? 10 : // A#
    value === 6 ? 11 : // B
    value === 6.5 ? 11.5 : // FAKE
    value === 7 ? 12 : // C
    value === 7.5 ? 13 : // C#
    value === 8 ? 14 : // D
    value === 8.5 ? 15 : // D#
    value === 9 ? 16 : // E
    value === 9.5 ? 16.5 : // FAKE
    value === 10 ? 17 : // F
    value === 10.5 ? 18 : // F#
    value === 11 ? 19 : // G
    value === 11.5 ? 20 : // G#
    value === 12 ? 21 : // A
    value === 12.5 ? 22 : // A#
    value === 13 ? 23 : // B
    value === 13.5 ? 23.5 : // B
    value === 14 ? 24 : // C
    value === 14.5 ? 25 : // C#
    value === 15 ? 26 : // D
    value === 15.5 ? 27 : // D#
    value === 16 ? 28 : // E
    value === 16.5 ? 28.5 : // E
    value === 17 ? 29 : // F
    -1;

  assert && assert( step >= 0, 'step must be greater than or equal to 0' );
  return step;
};

/**
 * Continuous version of toStepDiscrete, which interpolates between the discrete steps.
 */
const toStep = ( value: number ): number => {
  const nearestStep = Utils.roundToInterval( value, 0.5 );
  if ( value === nearestStep ) {
    return toStepDiscrete( value );
  }
  else if ( value < nearestStep ) {
    return Utils.linear( nearestStep, nearestStep - 0.5, toStepDiscrete( nearestStep ), toStepDiscrete( nearestStep - 0.5 ), value );
  }
  else {
    return Utils.linear( nearestStep, nearestStep + 0.5, toStepDiscrete( nearestStep ), toStepDiscrete( nearestStep + 0.5 ), value );
  }
};

/**
 * Given a numeric value, return the playback speed that will play the corresponding note.
 */
const toPlaybackRate = ( value: number ): number => Math.pow( 2, toStep( value ) / 12 );

export default class NumberTone {

  public static play( model: CAVModel, sceneModel: CAVSoccerSceneModel, value: number ): void {
    if ( model.isPlayAreaMedianVisibleProperty.value && !model.isPlayAreaMeanVisibleProperty.value && sceneModel.medianValueProperty.value !== null ) {
      NumberTone.playMedian( sceneModel.medianValueProperty.value );
    }
    else if ( !model.isPlayAreaMedianVisibleProperty.value && model.isPlayAreaMeanVisibleProperty.value && sceneModel.meanValueProperty.value !== null ) {
      NumberTone.playMedian( sceneModel.meanValueProperty.value );
    }
    else {
      NumberTone.playValue( value );
    }
  }

  public static playValue( value: number ): void {
    const playbackSpeed = toPlaybackRate( value );

    soundClip.setPlaybackRate( playbackSpeed );
    soundClip.play();
  }

  public static playMedian( value: number ): void {
    const playbackSpeed = toPlaybackRate( value );

    // set the frequency of the band pass filter to be equal to the frequency of the adjusted sound
    const frequency = E3 * playbackSpeed;
    medianFilter.frequency.setTargetAtTime( frequency, phetAudioContext.currentTime, 0 );

    medianSoundClip.setPlaybackRate( playbackSpeed );
    medianSoundClip.play();
  }

  public static playMean( value: number ): void {
    const playbackRate = toPlaybackRate( value );

    // set the frequency of the band pass filter to be equal to the frequency of the adjusted sound
    const frequency = E3 * playbackRate;
    meanFilter.frequency.setTargetAtTime( frequency, phetAudioContext.currentTime, 0 );

    meanSoundClip.setPlaybackRate( playbackRate );
    meanSoundClip.play();
  }
}

soccerCommon.register( 'NumberTone', NumberTone );