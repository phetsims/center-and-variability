// Copyright 2022-2023, University of Colorado Boulder

/**
 * Fire a final event when all child events have completed. Used for card animation sequences.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import centerAndVariability from '../../centerAndVariability.js';

export default class AsyncCounter {

  //REVIEW document fields
  private index: number;
  private complete: boolean;
  private readonly count: number;
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