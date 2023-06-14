// Copyright 2023, University of Colorado Boulder

import numberTone2_mp3 from '../../../sounds/numberTone2_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soccerCommon from '../soccerCommon.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import Utils from '../../../../dot/js/Utils.js';

// TODO: Create one per ball? One per location? Or multiple? See https://github.com/phetsims/center-and-variability/issues/217

const E3 = 164.81; // Hz

const INITIAL_OUTPUT_LEVEL = 0.1;
const soundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL
} );
soundManager.addSoundGenerator( soundClip );

const medianFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 0.5
} );

const meanFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 2
} );

const medianSoundClip = new SoundClip( numberTone2_mp3, {

  // For unknown reasons, the initial output level must be set on the originating sound clip, to
  // volume match it
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ medianFilter ]
} );

const meanSoundClip = new SoundClip( numberTone2_mp3, {

  // For unknown reasons, the initial output level must be set on the originating sound clip, to
  // volume match it
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ meanFilter ]
} );

soundManager.addSoundGenerator( medianSoundClip );
soundManager.addSoundGenerator( meanSoundClip );

const toStepDiscrete = ( value: number ): number => {
  assert && assert( value >= 1 && value <= 18, `value ${value} is out of range` );
  return value === 1 ? 0 : // C
         value === 1.5 ? 1 : // C#
         value === 2 ? 2 : // D
         value === 2.5 ? 3 : // D#
         value === 3 ? 4 : // E
         value === 3.5 ? 4.5 : // FAKE
         value === 4 ? 5 : // F
         value === 4.5 ? 6 : // F#
         value === 5 ? 7 : // G
         value === 5.5 ? 8 : // G#
         value === 6 ? 9 : // A
         value === 6.5 ? 10 : // A#
         value === 7 ? 11 : // B
         value === 7.5 ? 11.5 : // FAKE
         value === 8 ? 12 : // C
         value === 8.5 ? 13 : // C#
         value === 9 ? 14 : // D
         value === 9.5 ? 15 : // D#
         value === 10 ? 16 : // E
         value === 10.5 ? 16.5 : // FAKE
         value === 11 ? 17 : // F
         value === 11.5 ? 18 : // F#
         value === 12 ? 19 : // G
         value === 12.5 ? 20 : // G#
         value === 13 ? 21 : // A
         value === 13.5 ? 22 : // A#
         value === 14 ? 23 : // B
         value === 14.5 ? 23.5 : // B
         value === 15 ? 24 : // C
         value === 15.5 ? 25 : // C#
         value === 16 ? 26 : // D
         value === 16.5 ? 27 : // D#
         value === 17 ? 28 : // E
         value === 17.5 ? 28.5 : // E
         value === 18 ? 29 : // F
         -1;
};

const toStep = ( value: number ): number => {
  const nearestStep = Utils.roundToInterval( value, 0.5 );
  if ( nearestStep === value ) {
    return toStepDiscrete( value );
  }
  else if ( nearestStep > value ) {
    return Utils.linear( nearestStep, nearestStep - 0.5, toStepDiscrete( nearestStep ), toStepDiscrete( nearestStep - 0.5 ), value );
  }
  else {
    return Utils.linear( nearestStep, nearestStep + 0.5, toStepDiscrete( nearestStep ), toStepDiscrete( nearestStep + 0.5 ), value );
  }
};

const toPlaybackSpeed = ( value: number ): number => {
  const step = toStep( value );
  return Math.pow( 2, step / 12 );
};

export default class NumberTone {
  public static play( value: number ): void {
    const playbackSpeed = toPlaybackSpeed( value );

    soundClip.setPlaybackRate( playbackSpeed );
    soundClip.play();
  }

  public static playMedian( value: number ): void {
    const playbackSpeed = toPlaybackSpeed( value );

    const frequency = E3 * playbackSpeed;
    medianFilter.frequency.setTargetAtTime( frequency, phetAudioContext.currentTime, 0 );

    medianSoundClip.setPlaybackRate( playbackSpeed );
    medianSoundClip.play();
  }

  public static playMean( value: number ): void {
    const playbackSpeed = toPlaybackSpeed( value );

    const frequency = E3 * playbackSpeed;
    meanFilter.frequency.setTargetAtTime( frequency, phetAudioContext.currentTime, 0 );

    meanSoundClip.setPlaybackRate( playbackSpeed );
    meanSoundClip.play();
  }
}

soccerCommon.register( 'NumberTone', NumberTone );