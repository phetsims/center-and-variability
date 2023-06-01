// Copyright 2023, University of Colorado Boulder

/**
 * FilteredSoundClip is used to produce sounds for the slider that controls photon intensity.  It is
 * basically just a sound clip with a high-pass filter in the signal chain.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import centerAndVariability from '../../centerAndVariability.js';

// types for options
type SelfOptions = EmptySelfOptions;
type FilteredSoundClipOptions = SelfOptions & SoundGeneratorOptions;

export default class FilteredSoundClip extends SoundGenerator implements TSoundPlayer {
  private soundClip: SoundClip;

  public constructor( soundClip: SoundClip, providedOptions?: FilteredSoundClipOptions ) {

    const options = optionize<FilteredSoundClipOptions, SelfOptions, SoundGeneratorOptions>()( {}, providedOptions );

    super( options );

    // Create a low-pass filter that will change as the solar intensity changes.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext );
    lowPassFilter.type = 'lowpass';
    lowPassFilter.frequency.value = 750;
    lowPassFilter.Q.value = 0.5;

    // Connect the filter to the audio output path.
    lowPassFilter.connect( this.masterGainNode );

    // Hook up the sound clips to the filter.
    const useFiltering = true;
    if ( useFiltering ) {
      soundClip.connect( lowPassFilter );
    }
    else {
      soundClip.connect( this.masterGainNode );
    }

    this.soundClip = soundClip;
  }

  public setPlaybackRate( playbackRate: number ): void {
    this.soundClip.setPlaybackRate( playbackRate );
  }

  /**
   * Play the boundary sound if at the min or max of the range, or the middle sound if not.
   */
  public play(): void {
    this.soundClip.play();
  }

  /**
   * Stop the sounds.  This isn't expected to be used much in this context, it's here primarily to complete the
   * TSoundPlayer interface.
   */
  public stop(): void {
    this.soundClip.stop();
  }
}

centerAndVariability.register( 'FilteredSoundClip', FilteredSoundClip );