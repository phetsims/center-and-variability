// Copyright 2022-2023, University of Colorado Boulder

/**
 * AsyncCounter manages the animations that play during card animation sequences.
 * A final callback is fired when all animations have completed.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import centerAndVariability from '../../centerAndVariability.js';

export default class AsyncCounter {

  // The index of the object that is currently being animated
  private index: number;

  // Whether all card animations have finished
  private complete: boolean;

  // The total number of cards that are being animated in the current sequence
  private readonly count: number;

  // The callback fired when all animations in the sequence have completed
  private readonly callback: () => void;

  public constructor( count: number, callback: () => void ) {
    this.index = 0;
    this.complete = false;
    this.count = count;
    this.callback = callback;

    if ( count === 0 ) {
      this.finish();
    }
  }

  /**
   * Mark as completed and fire the callback after all events have completed.
   */
  private finish(): void {
    this.complete = true;
    this.callback();
  }

  public increment(): void {
    this.index++;

    if ( this.index >= this.count ) {
      assert && assert( !this.complete, 'Too many completions' );

      this.finish();
    }
  }
}

centerAndVariability.register( 'AsyncCounter', AsyncCounter );