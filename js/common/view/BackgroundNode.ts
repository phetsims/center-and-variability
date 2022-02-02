// Copyright 2022, University of Colorado Boulder

/**
 * TODO: Describe this class and its responsibilities.
 * TODO: Possibly generalize this, move to scenery-phet, replace usages
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { LinearGradient, Rectangle } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// TODO: Do we still want a separate node for Sky and Ground?
class BackgroundNode extends Rectangle {
  constructor( bottomY: number, visibleBoundsProperty: Property<Bounds2> ) {
    super( visibleBoundsProperty.value.centerX, visibleBoundsProperty.value.top, visibleBoundsProperty.value.centerX, bottomY );

    visibleBoundsProperty.link( visibleBounds => {
      const gradient = new LinearGradient( visibleBounds.centerX, visibleBounds.top, visibleBounds.centerX, bottomY );

      // sky gradient, sampled from a screenshot
      gradient.addColorStop( 0.0, '#2e4f8a' );
      gradient.addColorStop( 0.5, '#5c98d3' );
      gradient.addColorStop( 1.0, '#c9d9ef' );

      // The ground
      gradient.addColorStop( 1.0, '#468a41' );

      this.setRect( visibleBounds.left, visibleBounds.top, visibleBounds.width, visibleBounds.height );
      this.fill = gradient;
    } );
  }
}

centerAndSpread.register( 'BackgroundNode', BackgroundNode );
export default BackgroundNode;