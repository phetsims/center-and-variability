// Copyright 2022, University of Colorado Boulder

/**
 * Renders non-interactive red bars that show how the median splits up into the lower and upper groups.
 * This appears within the NumberCardContainer and in the DotPlotNode
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Color, Path, PathOptions, VBoxOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type MedianBarsNodeSelfOptions = {};
export type MedianBarsNodeOptions = MedianBarsNodeSelfOptions & VBoxOptions & Required<Pick<VBoxOptions, 'tandem'>>;

// constants
const NOTCH_HEIGHT = 10;
const HALF_SPLIT_WIDTH = 2;

class MedianBarsNode extends Path {

  constructor( providedOptions?: MedianBarsNodeOptions ) {

    const options = optionize<MedianBarsNodeOptions, MedianBarsNodeSelfOptions, PathOptions>( {
      tandem: Tandem.REQUIRED,
      lineWidth: 2,
      stroke: Color.RED
    }, providedOptions );

    super( null, options );
  }

  setMedianBarsShape( y: number, left: number, center: number, right: number ) {
    const shape = new Shape();

    const leftCorner = new Vector2( left, y );
    const rightCorner = new Vector2( right, y );
    const centerVector = new Vector2( center, y );

    shape.moveToPoint( leftCorner.plusXY( 0, -NOTCH_HEIGHT ) );
    shape.lineToPoint( leftCorner );

    shape.lineToPoint( centerVector.plusXY( -HALF_SPLIT_WIDTH, 0 ) );
    shape.lineToRelative( 0, -NOTCH_HEIGHT );
    shape.moveToPoint( centerVector.plusXY( HALF_SPLIT_WIDTH, -NOTCH_HEIGHT ) );
    shape.lineToRelative( 0, NOTCH_HEIGHT );

    shape.lineToPoint( rightCorner );
    shape.lineToPoint( rightCorner.plusXY( 0, -NOTCH_HEIGHT ) );

    this.shape = shape;
  }

  clear() {
    this.shape = null;
  }
}

centerAndSpread.register( 'MedianBarsNode', MedianBarsNode );
export default MedianBarsNode;