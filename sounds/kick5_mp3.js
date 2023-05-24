/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAY8QgAAOAAABbZfwSYYAAAAAAD/+0DEAAAFAAMftAGAMcCcbXcxAACNEBpJLBgElCBwPw/BCJHB9Tjl5STKf/EAIf/+D7//cUOfsKO///4YhES3FYmNwVE52I4FAAvW2DhYAATTYYCwGuR6rz0JIOXVsnkiJhlwrE8gaQ/UBGCOMZdpqYA8FxFoUGePpP3iURDwuAE3DhTM0Lu/kOFbDKkSF0KBs6+3xH5NkMOmpw0f1/+boF8mSuGQj/4LgQMBF6otx2yxtuNtBv/7QsQEAAngpXu89AAxRZTudPMOJmAU4ZhxF6L6hJlJ5Qm82sTGoWvNAhD4PORVCtYlVGNbMVPU88TdX/9Caaa+S2/96iL14uygKNK5J+IUTSB5gVZxFZT///+dCezlsiTjaQZVIIbpbQ3SapYrievm19DcVtbQCubF9qbCA7OfprLeGdm8Vu/6Fyc6Da7Yby529Yit7oEQjDuVBvGNNyDls9v/r0///3VsdDQ9VQ3r9ZKjI028H//7QsQEgAochWGnpGPhP5OpLYYMtNHXSHgSwBRPMFhWFARcXQ41GVn1DV2JbKlOr2NBXVMBbzjKc9qSlRKqY9S0nhUNOM1r9G2b5KeTWSVo9j4l9fnRzEILBQ8dKGhxOFqICFS1kaogyaiMx1Hgai6diAKXy6XD15cnOVDNnNgQrWBncG2ZqkBKjAm7+zXbnnNGMj9qEdZ0YOM4yqxM6LqfHuNqYqOky8UR/nZFA8cAAGkJXCzkz//7QsQFAAocsT0sJGXBPYrnrPSNLGlROHCcCEhABTQ6XOspjqkrVRs1qVlGn6dGeSCLVFMahWM+kbl2k9/2/Y/ythSeOSby0o0LLNoMJuag2bUE7tEX1/dHf98mFto+24IBxCiI8+h6y2oQb6JWg24sIRKyQClFMgH0RCvSKLS0VZoxedDRoEFHg0KA0+NSw1irgNSEHk0uZEjmOEUlhy2NaCWKpymouiup49Uy6/ex1tJpAC7BvP/7QsQFgAhUSz2nsMNg9A5mtMMMZCaqlgtDJyWg6PteLAfFUqkk6FMSckk1d6ZamIrKjzBgckTGztwaLHpjDuKuIi4svoLD1XL3f1dATVdd1kdbSUGoDS4tMO7beScwC7TEg1DVkQtbkWA0SqU4MGX1mVVhoqRBUKnXkDqYkrcgsP/5v/s/7//80gRgJBRvxtgAGHZTyXLfaJTpFkrob9X5b//yQASSkEYgdgAAYXAQzuIqsnfdt//7QsQWgANMBTehBGAgaYFhtJEEBOz//lUM+d+uqYiZAAAAAAA30SP7NkDnBDKSl/MxONfSMbvZk0ksxjZnvLN2qqI8Y/6zf3s/NgB5wrKTTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QsRNA8ZgGEvP+8JwAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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