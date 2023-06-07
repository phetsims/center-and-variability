/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAKAAAH2gAZGRkZGRkZGRkZMzMzMzMzMzMzM0xMTExMTExMTExmZmZmZmZmZmZmgICAgICAgICAgJmZmZmZmZmZmZmzs7Ozs7Ozs7OzzMzMzMzMzMzMzObm5ubm5ubm5ub///////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAU2QgAAOAAAB9qN93hMAAAAAAD/+0DEAAAEfAEptBEAMdOkLX8ZAgJgABouxLRAADlAgcKHBPWGIP3e/Jr8vifg+8H//nOTg+///EBoRqBqRqaybOu93YrkIpEQkJQVPy0lJ8Q0Jj+kJ+lDw9VlSXTIZA20AGgZMZM8QwgjJkXMEScFqIuQMmhmScJ8vm9ZgRQyMioXjhURPvy+92UZk+gYNUv/6akXVQ1opqf6KTGn6CbKb//63Y0rQm7/o/lC9qUgEAAZADDi/f/7QsQEAAn842k89AABRBxudPMJ4MxPGFHMzdFvbEWGwxXJDSyKMGiQSklAHNHHRX9w1v9d/6d2iVdcyYk//JS3fz8T3/BZynp9O8a7x7/BBg4xf9hRDSNatSf/0bp+RMhxtglPi+QRdmVcrg/zfUzZrq+WV2tmBoRd6asKT0b7+98iMimdriEqFFEXvIU49Nykd/k+uZXrtZqPv3xbgOgp911KtaUf7j776qTbFGk2aGNDC2SIp//7QsQEgAnwg3nmGEyBTJAu/MMN0GEWAiKjofyiIjThfQj0rmQOWC2KRk3no12KYe91ndmlz23Kb1WQTYbq16nhel4jUxBrnT8Xv9+RZeskx1S/3nEEqRNPC1THg4hmJBNWWAJOwl3BMmIIiluIzOVe1MDFeuMJoBUs5G5wwt/NGOBxSBXw3VhQLD/imKcUjCAOQMHG9VQdNODnzQ55ApRxyFCpZ8YQmHRf6PbXq0XNvRkAvUBeiP/7QsQEAAnkg2+GDFEBR5JsePSJ0FcTxIIhsMx/EB4TvQxcPa53lkNeBAInUDg/TEkJK+pzWa2rf2YxgYxMHSrTootni4GuEoVcdmN13+xWgSpE0UtTzFyBX9iWwwCQAAACwgMkR+tZ4lAqBwNcFFsfb1Sh5+hyqjAsCSA65vLaJYosWEibKWYzmcqHJui/Ur/sGZR4U+K3nlWh0qYI94d8NVNUhWIm1PZLaup/kpcANDQkJfySO//7QsQEgAockWHmDFJhQ6KoqrJQBHQ4kUgdIrA7A1gZHFFATiTkGrcOj7cxcMBHDo0IeFLL7AR2Nm0lQyvfmcBPB2SuVQg8Cu3Fix69ol9Hz1YlJWFa0Ha3L/1pIoAhSJGkQRmm0qVAOJlJ6KsWBd2zNTqmr/uTD6npaMAJbh5xESMYVKiDRVIsysyUZKOVzP7OrIzS3mNfzPVXnqWjlX+VDftfVk/fb/Qb0nfZpSQCGn6tF6/Vq//7QsQEgAoM72+484ARRZcupx6AABEAQCAMPoDkkAhkTvcikTq+LWdCULA0fCIdALEc9o5hOZHTyhscqJYtJuZQy5ilp555ay7znfoxUuW/9fnn3Qh//+TdKP/y4AAACEGCgCEADcPVUn785BuxBYmIlr2KxUT86iCQORDCxAYOTH5hIlQUUpCCj9OsipVJohvHqv1983/8Rf7/tp8Vlxd4XHyXJwC8vntp9yPWMVQAXDEQCmkGa//7QsQEgAnoh3Pc8oABSQ0ucPSNUAgjeWJRlOZR0HgkDhH/FgvGJkZxJRcPi41Q0rGUTvQyS7nRsrsjJou2rsHDN8mJTOVYG2DhZqc/IrvX1i67/02P/23N9eWbQuZQF/q3ASJB1YoUElkyYovhZk8XoDiFGi8ht4JwX3oVwE43giLI0sBQhxAgGPEKYLKc7GlTD0Q+EBzx1IWbc60SLK223N9KkJdcv86pCeVYhbAJKgQWnAk5Yf/7QMQEgAjoUXOmGEyBHhFsdPSM4AicDVIA4okxaOBgOB+W6kg39JLJel4uSYviHeDOZaKgNwlET20qMx53ZozRsnuUnKEbxZjUFvp2TF13s/yysgA0CAYnSEIhmjdcbDPOgpywBSANiB5cMrTm5Y3hDlaGakx/szex/GZbG6sNY0/6FdJGo7DsqIlRK8Su+rKrCew6zt//4a+p1AEsQLy0kYAZhUJhYVySFJIOxGLqwziEmMxU//tCxA2ACMSLUaWwY2DhiKc09IzsLAJwEmPVDUS12I1X9V/4x66+qNdmPwrowrFnLGHiclKgVNIuWXPeG98s94QRtus+/Ao+Yn13ylJyOFkAYEQIHwAiVoQnhUyivNVZiSrGcBj1/sCUtBpqf///r//+n9T2f+p5JQG2JALIKAAKdexAUkWj/2j0+35VLQoa/////////x6FTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxB8Dw/ABKaCMIDAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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