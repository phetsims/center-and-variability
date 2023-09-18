// Copyright 2023, University of Colorado Boulder

/**
 * IntervalBarNode displays a horizontal line representing an interval.
 * Short vertical lines at each end indicate the boundaries of the interval over the data set.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// The length of the lines that extend perpendicularly from the ends of the bar
const DROP_LINE_LENGTH = 6;

type SelfOptions = EmptySelfOptions;
export type IntervalBarNodeOptions = SelfOptions & PathOptions;

export default class IntervalBarNode extends Path {
  private intervalBarNodeWidth: number;

  public constructor( providedOptions?: IntervalBarNodeOptions ) {

    const options = optionize<IntervalBarNodeOptions, SelfOptions, PathOptions>()( {
      stroke: 'black',
      lineWidth: 1,
      isDisposable: false
    }, providedOptions );

    super( null, options );
    this.intervalBarNodeWidth = 0;
    this.updateShape();
  }

  public setIntervalBarNodeWidth( intervalBarNodeWidth: number ): void {
    this.intervalBarNodeWidth = intervalBarNodeWidth;
    this.updateShape();
  }

  public updateShape(): void {
    const shape = new Shape();

    const leftCorner = new Vector2( 0, 0 );
    const rightCorner = new Vector2( this.intervalBarNodeWidth, 0 );
    const leftDropPoint = new Vector2( 0, DROP_LINE_LENGTH );
    const rightDropPoint = new Vector2( this.intervalBarNodeWidth, DROP_LINE_LENGTH );

    shape.moveToPoint( leftDropPoint );
    shape.lineToPoint( leftCorner );
    shape.lineToPoint( rightCorner );
    shape.lineToPoint( rightDropPoint );

    this.shape = shape;
  }
}

centerAndVariability.register( 'IntervalBarNode', IntervalBarNode );