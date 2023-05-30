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