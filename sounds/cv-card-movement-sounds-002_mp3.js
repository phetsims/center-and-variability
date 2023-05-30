/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JATeQgAAOAAABbZ71pTmAAAAAAD/+0DEAAAFXB0VoIBgMRuQJ7aYkAahAAAgFFJyTTl7HCKBhAkZRqMU6Qiyb9X6yDvAjf0cgCfUmpP/83/of/8nFG0mUik0g6MpOiGDczBuWwECAWAQRaZviAjRisNieaRA5RAx0kCBjJoyerRvUQE6NHPzn/7Rt+HtvOB3bwcdwx//R//+f6H7gAAIBUQrx9z6D4WgDmHzZyZrUg6MEUd6TV1yEBVjicIwOosAFk2ncmk+ZAGAnf/7QsQXgA7c9U+494ABMpAtt4yQAgSpMupmu8FGawh0qScu+iQtriDvvLx4NWJ5F3NfF2R595bWJ5nG9fP/2zxWNnm28mxBxaTX////c6azntVduMaeSCCI78n7WjpJAAAFtuWj+D+WPKPCCRhkgMUEBEkGiMnnvhPpEBJbbert7DM/7yNJe3kaXbTrXSVrti1hdynVj/E5d5cDg+fC4AddUAEMC4/+J3l1CFRDEREav7D/wpC2BP/7QsQGgAoIv3vHsGnxUBPtMPYMtoHzEkRLd1ShH1zFNp7RcuyZxppMIoET14EhJOiU8xLcMnenwz5Jn6HyM1D9C9yfhRCQGLc45oHPqaMFBRkavKt6Ahp3iKJIADK3nV6M4hoqJysSh+G4SxDkUUMSTERany5bXuhV6RFFJm9tWP/VVOqsb7J4sBQwpjWQUx4seLFgoDR4FUFTCAaxSpLLVu1fiVQNT3kYl4dVGrAAII1VB/CLqP/7QsQFAAlo11eHmFCxMxZrfYSNt8VWjrNBoJ6dKujIadN1hTLMVTRkyqdNI6jwlG/ncLS7mMzORgVn3RO5nlXaZ2Ms7XinTSY1e3epAIDbxr0+He1boVlMyIzNKSSAD+/qJLrDioazb1yhwXRd2YedESEcKiBcQx295EVQ3t36/lbrhJHtzPtNwcOKpQ/4uYdbkuXMtVj2ULu2JN9F1eV2a1zNpEEAAKo/x8TqAfIsCLJikVbBbf/7QsQKAAl000GHmG7xIQwnMBewXjdPS9QO6g86pqMah8O3UBsTEq0VkfPkNKllyl5huNfuX5KI7m5lLP6Kc1Ma5gswesf//5pH/FjVbSJSIFVB7nQohajmNKIol4MnYT4Dx68MDNWdQQH1q1zWDGyZdAbdlYWI6+uaArNxa06JAaklDyp1pGY/ub3lnv//JNvv/ioqgQAAAQAACiXpyOZMrENQHRaXUJQFiSCwvsIQDj8F0FNR0v/7QsQRAAfwTSHgsMVApQSkdBCYVuwkJ1TkjApQVUk64qNPFaSiqf+3/v+b0J/f6K/+jQhEEAglJJKVUw2cu88kFbSJXRKIlLfxNT+rI/Kjckj2f73//7P/9bpGAkaCSiAAgAFYCi26ok9bdQv///9SKkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QsQtg8KoAv+gBGAwAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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