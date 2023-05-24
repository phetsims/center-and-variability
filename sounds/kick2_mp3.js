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