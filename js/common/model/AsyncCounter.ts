// Copyright 2022, University of Colorado Boulder

/**
 * Fire a final event when all child events have completed.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import centerAndSpread from '../../centerAndSpread.js';

class AsyncCounter {
  private index: number;
  private complete: boolean;
  private readonly count: number;
  private readonly callback: () => void;

  constructor( count: number, callback: () => void ) {
    this.index = 0;
    this.complete = false;
    this.count = count;
    this.callback = callback;
  }

  increment(): void {
    this.index++;

    if ( this.index >= this.count ) {
      assert && assert( this.complete === false, 'Too many completions' );

      this.complete = true;
      this.callback();
    }
  }
}

centerAndSpread.register( 'AsyncCounter', AsyncCounter );
export default AsyncCounter;