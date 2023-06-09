// Copyright 2023, University of Colorado Boulder

import numberTone2_mp3 from '../../../sounds/numberTone2_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soccerCommon from '../soccerCommon.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';

// TODO: Create one per ball? One per location? Or multiple? See https://github.com/phetsims/center-and-variability/issues/217

const INITIAL_OUTPUT_LEVEL = 0.1;
const soundClip = new SoundClip( numberTone2_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL
} );
soundManager.addSoundGenerator( soundClip );

const medianFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 0.5
} );

const medianSoundClip = new SoundClip( numberTone2_mp3, {

  // For unknown reasons, the initial output level must be set on the originating sound clip, to
  // volume match it
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ medianFilter ]
} );

soundManager.addSoundGenerator( medianSoundClip );

const toPlaybackSpeed = ( value: number ): number => {
  return value === 1 ? Math.pow( 2, 0 / 12 ) : // C
         value === 1.5 ? Math.pow( 2, 1 / 12 ) : // C#
         value === 2 ? Math.pow( 2, 2 / 12 ) : // D
         value === 2.5 ? Math.pow( 2, 3 / 12 ) : // D#
         value === 3 ? Math.pow( 2, 4 / 12 ) : // E
         value === 3.5 ? Math.pow( 2, 4.5 / 12 ) : // FAKE
         value === 4 ? Math.pow( 2, 5 / 12 ) : // F
         value === 4.5 ? Math.pow( 2, 6 / 12 ) : // F#
         value === 5 ? Math.pow( 2, 7 / 12 ) : // G
         value === 5.5 ? Math.pow( 2, 8 / 12 ) : // G#
         value === 6 ? Math.pow( 2, 9 / 12 ) : // A
         value === 6.5 ? Math.pow( 2, 10 / 12 ) : // A#
         value === 7 ? Math.pow( 2, 11 / 12 ) : // B
         value === 7.5 ? Math.pow( 2, 11.5 / 12 ) : // FAKE
         value === 8 ? Math.pow( 2, 12 / 12 ) : // C
         value === 8.5 ? Math.pow( 2, 13 / 12 ) : // C#
         value === 9 ? Math.pow( 2, 14 / 12 ) : // D
         value === 9.5 ? Math.pow( 2, 15 / 12 ) : // D#
         value === 10 ? Math.pow( 2, 16 / 12 ) : // E
         value === 10.5 ? Math.pow( 2, 16.5 / 12 ) : // FAKE
         value === 11 ? Math.pow( 2, 17 / 12 ) : // F
         value === 11.5 ? Math.pow( 2, 18 / 12 ) : // F#
         value === 12 ? Math.pow( 2, 19 / 12 ) : // G
         value === 12.5 ? Math.pow( 2, 20 / 12 ) : // G#
         value === 13 ? Math.pow( 2, 21 / 12 ) : // A
         value === 13.5 ? Math.pow( 2, 22 / 12 ) : // A#
         value === 14 ? Math.pow( 2, 23 / 12 ) : // B
         value === 14.5 ? Math.pow( 2, 23.5 / 12 ) : // B
         value === 15 ? Math.pow( 2, 24 / 12 ) : // C
         value === 15.5 ? Math.pow( 2, 25 / 12 ) : // C#
         value === 16 ? Math.pow( 2, 26 / 12 ) : // D
         value === 16.5 ? Math.pow( 2, 27 / 12 ) : // D#
         value === 17 ? Math.pow( 2, 28 / 12 ) : // E
         value === 17.5 ? Math.pow( 2, 28.5 / 12 ) : // E
         value === 18 ? Math.pow( 2, 29 / 12 ) : // F
         -1;
};


export default class NumberTone {
  public static play( value: number ): void {
    const playbackSpeed = toPlaybackSpeed( value );

    soundClip.setPlaybackRate( playbackSpeed );
    soundClip.play();
  }

  public static playMedian( value: number ): void {
    const playbackSpeed = toPlaybackSpeed( value );

    const E3 = 164.81; // Hz
    const frequency = E3 * playbackSpeed;

    medianFilter.frequency.setTargetAtTime( frequency, phetAudioContext.currentTime, 0 );

    medianSoundClip.setPlaybackRate( playbackSpeed );
    medianSoundClip.play();
  }
}

soccerCommon.register( 'NumberTone', NumberTone );