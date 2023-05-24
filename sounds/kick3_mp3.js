/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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TUVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVV//tCxF8ABGAHG6MEQBCeAKD0IIgCVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxIqBRpjM36SMQMiFEhj0ECz/VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxK6DwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;