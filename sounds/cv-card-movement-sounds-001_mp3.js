/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAQbQgAAOAAABbbfxJbxAAAAAAD/+0DEAAAFAAEZoARgMQcQZrQXjK76NkAFhqXS3rWUJgFA4ah1b3fAdZv1o+prxyaD7v7//3//9n6N/V1J4TZaJAKaQbo+bimm3HGpEILwxCaKVbUirxAVgigYGbzcDPhE8TiU3w4sAL4BnuaE7CwgbDAWDJTy///+r///sUqpBMAACWNADX63JF2RwECLughp3ePDAQAAALhUgDWlojeNpyyGgpgSMk4j4vlUZiAgsjEjFYymnP/7QsQbgQ9UzS1MPZFBSJGoQNwwufLHgvjkRj8Wg+CtMJmMhSAmAkBJxMxC0LOs81hRieEqPECTCvLR4UwjPMjvUlmZnBQ7PyWfvONq4GnF/zP7dxZrC9tPmYaDMSJAghnWmuWnPtTWcUMnwhm/wEEBIHIi6W3dNmSGjyI2O7PrEJBiLyuSnCujh4nk8/hQ3ykiYOCYhLF77drLbtq8rMDkM2fjAcAR5/zxwQAAHQPWMwfw3WgLpf/7QsQGAApoeVZm4YfBQI7vOJw9rmeCBwygKbOhSSgCCMNEjvEsIhwSsTsRsREafFgYBDSDmZu/RwJSAoFA5iGrEspHl2CQ6kdn8mzCxzngNBhC/Uj+lUCEHN6KIlCIgIBO/sArsDZ0CgSREyBDOLSUuhbBeSrO1FpJarMpgdYia7KW4KGwQ/7avaNGZK02RQy/Clzmq0T4u6ELtZU0Z+7hPbzEnKPU5nJINcSqHaRJAATdv4H+ZP/7QsQFAAnw5WenoFERNJpqtMMOE3puk1lOZiSyTO1DTxUx/RaOUzaHJh7psxNHD52B0YLObkpiZlymKtRjb/odkdKob7JTJq1vOVzBUICdao6A3GEG4ir6lPlqCIABBkuAFZhE4XsgaVh6wFUAEhSNA4iSuJKGzpoVwXNKSllUSJaCby/9fjWUIF5CIGChqPGMs4bDrHyEgc7042XilV4LDibXYO3wvRWSQAACnLQB1OKozD0JhP/7QsQHgAnw00umsMWZRBbpdPMh3kFQDwpFEYugXunJbJpicuM0qXyi8qmHiZn+kiKIgkySUoR1cpvmtWlemR6f7VPr0UkBhh1fWfOY1b38up1TpnjNK2yySCmmnBavy2DhJaxGcW2UsDtCXFBKxLRQc0YKpyyG9tJU7YFB7a0vOSMH01cA2R1pGnXo5tVaP45rrr+SLcDTURRpp7nu2FqPb4LZK9i1GacaJACaRTu64J8cM6dhD//7QsQIAAi8czugPMHw4QvltCSMtuG9IZJ0udzJY2BWrI+AFZZyRuGwtcsFb5753CUTcctHTQUJa08DSTzqVwVubq6/+r//V//7n1gkopEFANiWakEGiZFGPEQJCYqKQRRgiwRNKmREBKv7NSwEBXyjYYeCoaO///b4d///9tqpL+nLKogAQCG3LRBbdwwVOip2eU/aRnrX5M79Q+RQmRbKs/4z///o7z06Vb2/f+s87rpMQU1FM//7QsQZgcVgDQeghEAwCgBAAbAABC45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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