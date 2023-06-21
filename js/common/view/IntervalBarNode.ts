// Copyright 2022-2023, University of Colorado Boulder

/**
 * Renders a horizontal line with short vertical drop lines on each end, to indicate some interval over data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  intervalBarNodeWidth?: number;
  dropLineLength?: number;
};
export type MedianBarNodeOptions = SelfOptions & PathOptions;

export default class IntervalBarNode extends Path {
  private intervalBarNodeWidth: number;
  private dropLineLength: number;

  public constructor( providedOptions?: MedianBarNodeOptions ) {

    const options = optionize<MedianBarNodeOptions, SelfOptions, PathOptions>()( {
      stroke: 'black',
      lineWidth: 1,

      intervalBarNodeWidth: 0,
      dropLineLength: 6
    }, providedOptions );

    super( null, options );
    this.intervalBarNodeWidth = options.intervalBarNodeWidth;
    this.dropLineLength = options.dropLineLength;

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
    const leftDropPoint = new Vector2( 0, this.dropLineLength );
    const rightDropPoint = new Vector2( this.intervalBarNodeWidth, this.dropLineLength );

    shape.moveToPoint( leftDropPoint );
    shape.lineToPoint( leftCorner );
    shape.lineToPoint( rightCorner );
    shape.lineToPoint( rightDropPoint );

    this.shape = shape;
  }
}

centerAndVariability.register( 'IntervalBarNode', IntervalBarNode );