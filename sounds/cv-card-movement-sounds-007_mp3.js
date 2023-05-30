/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAKVQgAAOAAABbYW+jSzAAAAAAD/+0DEAAAC7EC5tBGAMW8Y5LcnIgIASQCWsCAAAfkoF/PiCKBgcAxcAEn//VmIDioywvFquDqNRoeDepR22LjEPTs4QjAHHW0MZh0F94DGBe8Cppp9k4Bdg2NiVB0m7+qGwDNkwRgzD9v+cJwghZ9upCymN003WZp98yPSQJu/u6tCgHo0XP/0qpb04VWoxYK1WqlYgIAP1+emjmRgCFbkj7u0ou0KxZn2ZgIibkNA5VBFLVDRbP/7QsQWgA6k41u5h4ARQxAsN5JgAlMqsM9C9CrkLewlCY7FWalC2qqZQaxNqW2bx5ssmGyCrHG/m/r9wLay5Z/jw5/9/NveX41eNXd9xPP/72j3B4mljP/1EFMBBQ3jRAJBbaUt/9iEDgyKA8hwLmgQDxJ5lMtwtRnDhZV/+M/fHMQ77QzQMyzix26E7WNFFreSCQXDgYW9YRpiD9z/TEQSeIHeta3hhj1tP/9TkZykUgAAAEBJ7v/7QsQEgAo1CWHmJEuBNJzveYMVrichSIYcVQwODkHg8FGBggeDFQ70E9QBlTWlFFMuEin7UHIEAvSncjT/f1rO+yEQ+TOc7X/q/Ov/+U9WvOcDPlKMoCAnPhnYcLzUMpmZCVXVZPxiG3Ef8GQbgUcQPHGtDjUTkvCGHhh+y9/UHx8VfVZyVzVpo9JlxqQ8BrdVTvvvr/v/UipdcZWxmJkQQoOjLPR0yUTVqXqEIiEiNr5s78UgdP/7QsQGAApBP4HMGEd5Tp6tepKAAYwLWVOvIsGLJLtD+FLheZUblMj/1qlOjPbeu10ZbOmqCQyoUXa3TR2djKjOVHYcSKMVFZ/s7OV2///s7GKGCggQMhxAtVScEDQBEAK+sN6ggSITBoKSIEdHCY3HBowYUp4yxxKkSpDzmlPKD0GmJmlMqlDazq4LGCCIITBKJHpxgueOO9pq+Y/uv//q////+rp0RyCyAxamn+rfNpoMGFSKN//7QsQEAAocfYO4xYARN57tv57QB6SyWwCgDAm5mbn9Fp5YSR1aOixAbSbLmhOJQ+xRMUODAgEoOOo3EAbrmxr/XUHKj3O/13lWjj5AcHRFa9iNDBj+C70VmFP//CQQ6CIAAAU22oB/GSJfTgLaxZblVHhJNCVCJ8NYIsJmOju500SLtGXTJzJ1mV02RRRSetlaSKKNT0rfrbV+p+iij6LdX//9ExZj7+moZmID2IEFuWSOAf/oav/7QsQFgAok92GnpEv5OpNn9BeYelHo3U6N5RNvEIl0sCSSJYVLmSHGmkRFpVJZWDKtbnaWo7Fz7pT9Cq5lhisXMrK5jVgrylq3o/crWlbKhVbmXjFAhxU8sWLg0yAASnG2rmuyueHmnTHN06aoaoWsXFIo+aDV7IooaDb0aOSLn1ed0cpE9HsxxJeWagcdZFHQYvP5/7syQlIwaPdV9hWTVclpH/+wt/+20SRYLTbZBTx5VIqKWv/7QsQGgEdkYzegpMVwXQAgtACIBvYZGgXQxCo9SKQCWaRl5n84lpu+eSquaSs1EBDniV2CvPf//b9Z3/6//yUS28sK0k3ZJdhWWJBR6AqZLVAVmPTMtxV34pVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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