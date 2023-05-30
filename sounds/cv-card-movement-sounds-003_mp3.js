/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAE/wAqKioqKioqKioqKioqKioqVVVVVVVVVVVVVVVVVVVVVVWAgICAgICAgICAgICAgICAqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1f////////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAJmQgAAOAAABP8MbY4cAAAAAAD/+0DEAAAC9AEPtBEAMfKfpes1QgLZtuMb7UUAAF1KOFHQhw/rB992GCjv/0AlmnnTBMBAKAgD0fr9aw/GzNp1mup3+IgKEGVGmVFmkUQLPgZ4iEytCFsyTEFAGmYGCJAmpvtsBrx4UCB6QXI+edA0goKA0CgFBIBzQQU//JkLYE4OAVuLj//ywHrjjNAtEDLBLen//RIeRMgiKZ1I0/+56KItnCjvMeCDlQkAAAALJmZzl5DN3P/7QsQGAAqMd1M8xgABN5Xu+PYJnkjqI7CsuHzAzwdDowRLRAEgtvL7rBwJg8EyNgwnEO0K9YIB5E0yZp33G3l+oQAHA+8irEAPqAGl1EEHA+///LxA4EHA+9Mos1NMhmZmRKxJkCp0FjeKNWHQXCccg4CYibmMOAcFQ1JAixOc+1rZ6nhA1R6xmoTZlcd8GjIhiTWf//4higwQbp36ZIp//60G1jVlTT6jhBVZczEiAQABJCE7x//7QsQFgAoY83PsJEyxMRTtvMGKUo2UQy5KjRjGh0X9DzvKHSYuMBYdAZCw/VlR5GjTxejkMkhwVORRnZVoyy3mW6s6+tNHXptR/9vWn+iirVf//+OAq/ipLFGgyEBAAAApOWinFcfCuGA/BXUMzUz8XHaxstozjVC586dU3BwEYjxQU68pU91tdKK9Tm2+zroMR1aDLNUTQldhPq8ihh2zpvtW8C0LelMSAQEAASUXI2lMDvTpKf/7QsQIAArNT3fnmKkxSo8u/PSM7kWuErNgQDQIBAQWQIEN6UxVajAmEqVjZ70ozfXTzu6uc4+QjJRmu/b/5mqlPe3r////fZ0XQhFO5GnYgwVH7CgnKND1s/1vLoZCIkAJRLblfKmI4+iQnQaA6xAAI2iGwqBK1skJKedfrsdJrkniZfElIn2BgxhcO2REgLi+JgMDT/jsKcXJb5sq7jIiWxAoxR4wWYAfFJYOmBu0SCQACnJJxP/7QsQEgAn4lWmgsGPRQpYrNBYYcpQBEEDqqGAQhKlDZfKZbWb6pfE4JHPCYxKstt0VYCczMtclvnOfmcAjQcrZhkKLh7u9/b0fzMCioKliw8FhckBULLAV0rcgTJkBAAAuS0cxOANADYZCClHJkSj6GhkeCUfiVyyMkdkijLEiVNWvOHAxLDiW+c/+N85qLZ63f/R1z5yqdyOAyzcKg0a5blvrlW/kg6DRr8KqsTYJIACSJTp4jv/7QsQFAAl0lz2gvMVwv4UhdBGMkpkko9Qjy5VJzJFYZk8W5Up5ywdaJxLHlFRwU81+7EnRYpZHKfCWzmuRx5Oz/tW8lPNO+DX+vJfnv07VuK27X+v8tGgAAAAAlJb7QrWCoKChBxIoBDAnDKyLqAqyRcLC7usyr6/3xnxY1///FW/1/jEBWkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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