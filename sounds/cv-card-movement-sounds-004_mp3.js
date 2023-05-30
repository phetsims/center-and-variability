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