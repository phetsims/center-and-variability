// Copyright 2022, University of Colorado Boulder

/**
 * Renders non-interactive red bars that show how the median splits up into the lower and upper groups.
 * This appears within the NumberCardContainer and in the DotPlotNode
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CASColors from '../CASColors.js';

type NotchDirection = 'up' | 'down';
type MedianBarsNodeSelfOptions = {
  notchDirection: NotchDirection;
};
export type MedianBarsNodeOptions = MedianBarsNodeSelfOptions & PathOptions;

// constants
const HALF_SPLIT_WIDTH = 2;

class MedianBarsNode extends Path {
  private readonly notchDirection: NotchDirection;
  static NOTCH_HEIGHT = 10;

  constructor( providedOptions: MedianBarsNodeOptions ) {

    const options = optionize<MedianBarsNodeOptions, MedianBarsNodeSelfOptions, PathOptions>( {
      tandem: Tandem.REQUIRED,
      lineWidth: 2,
      stroke: CASColors.medianColorProperty
    }, providedOptions );

    super( null, options );

    this.notchDirection = options.notchDirection;
  }

  setMedianBarsShape( y: number, left: number, center: number, right: number ): this {
    const shape = new Shape();

    const notchSign = this.notchDirection === 'up' ? -1 : 1;
    const leftCorner = new Vector2( left, y );
    const rightCorner = new Vector2( right, y );
    const centerVector = new Vector2( center, y );

    shape.moveToPoint( leftCorner.plusXY( 0, MedianBarsNode.NOTCH_HEIGHT * notchSign ) );
    shape.lineToPoint( leftCorner );

    shape.lineToPoint( centerVector.plusXY( -HALF_SPLIT_WIDTH, 0 ) );
    shape.lineToRelative( 0, MedianBarsNode.NOTCH_HEIGHT * notchSign );
    shape.moveToPoint( centerVector.plusXY( HALF_SPLIT_WIDTH, MedianBarsNode.NOTCH_HEIGHT * notchSign ) );
    shape.lineToRelative( 0, -MedianBarsNode.NOTCH_HEIGHT * notchSign );

    shape.lineToPoint( rightCorner );
    shape.lineToPoint( rightCorner.plusXY( 0, MedianBarsNode.NOTCH_HEIGHT * notchSign ) );

    this.shape = shape;

    return this;
  }

  clear() {
    this.shape = null;
  }
}

centerAndSpread.register( 'MedianBarsNode', MedianBarsNode );
export default MedianBarsNode;