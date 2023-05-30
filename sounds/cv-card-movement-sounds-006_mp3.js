/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JARcQgAAOAAABbbcJ1r/AAAAAAD/+0DEAAAE3AEr4IhgEU2fKLwGDHCIUwIgAgCSacGGEyhOQvJvtOWDu5qgB0U/p/0/+OTrAkmBP//+j9AA9KaiIACW49xNyQNIhiST7r0IRG7GCpZzYGL3esAAAjRMOLhYQncneEae5k709yrnuZcTT/99N3v6IiU/y/9DQn/8qBmEEdY4YCGc0lDgYKcQB9UDEoAAAAHn//4zzoOQCAGUYW0dHIaOg7jd1zKkS7gqKy6CWpv2uv/7QsQTAA0o80eMMHMBTBEuOB0Yfj4jAzOEBbZtuBqInlQmBy/EXxHFDqxKH5UUZf+cm3HajaUEYRFQkTlhNCfS//z/zKncs+IeyFTACF2LvYtpcmMJZeQB4ZnRSQ2+mzlbkqMzkkSIYUD4UzYzUrQTwWXnjVHMSjTqs6i0oBjk7K7/5rQ0Zb5haBzhWhYwuMVug6enr5M8sfKP1UuNoHtFY/7brFbLE/UxRNVoQxAREiJBJBUx9P/7QsQFgAoFJW/npEXxTZEs+MemjbSIEIVBAwSzOgik0ogh/a+n6yRPLGCnPXWyOKTb3zJtd1VEYjlVK6IikY72olrb0t/VbEJd/f6b90tOeEaIW9df9C3hhNYhAACADQAAUm2CcPaVScPtUOSeKiQKw/EMvCI+SOODRkkEt8C4pYjgvBbzcL8SQV9DhJDhMtgYy7RIdPgEZNoGiRNJlG0SEcV9YnGwt7LVHNfJpb6yCAQAC5Lh8v/7QsQEgAo0s2m0wwARQ5DxPx6SAvkwcgKjSARAEFlKJQ6mJ8bPGjTlqYcK05IKAgVDal4s1FvP2c03N/nK9ci2/ZxJ5z59/15+83xcogypqrzsrLP1utEMkkr9nJOEqqkqGiEqKqu3bbbYDgAbSH/bCViKLpsa4akks2PYY4LTtNRemjcUVfDRxxP3Thqz9Yh/9xn7/L9g9CSOZ6gc3gwMUZIbYnLjm44//8Hy4DXfuQkgklNuN//7QsQEAAoYrW+49IARPBzpN5iAA27bUAAADC64UWQpG5YOwepXB9bR65dYwdFYgHo4BZ6aHoo+icDBCJ0WCom2q4EBRhB50i/3/9qUspyVf/x2pePdHF8msEkyK6BGkCQACm5QBM4dLgmCYbiCWyUfBNcmA2SxisSHSiqHgtGiwuC0k0WFm0+BBjk8kgpBvJusk0QdttfXK7X61/nN1PrF1K19xB2qz/8qLM+t+caaRC3bhUpE0P/7QsQFAAhcp0WAsMVxGg5jaBewogUmByWD4CxVmgnG7KwpulWi1T/WWRx5zXkwlp1EyCcDjjjpkqyM5BJGZ/qqefn//xkiJFuj9317VkAAAAAClLykpiDGkN1GopjP5VVX2R0rCUCSOESVoCQ+qOIBSyyepj72t7TGhdEVdDRds7OVW8ecC23/fO/X/2//9Z3+e61KsQAAAAAUk29xWGuwVAIGAg0GlBWAQEHayXHD0/UvcWIu9v/7QsQRA8YAHQughGAQAAA0gAAABEZqArP+Wkfvf2QlY//tTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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