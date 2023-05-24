/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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qqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqq//tCxMyAAuAHB6EEICCUAZrkwwwEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqq//tCxNuBywBIw4YwYWAIAEABkAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqq//tCxK6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqq//tCxK6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqq//tCxK6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqq//tAxK8DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+0LEroPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+0LEroPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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