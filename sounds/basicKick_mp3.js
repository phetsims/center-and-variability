/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
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