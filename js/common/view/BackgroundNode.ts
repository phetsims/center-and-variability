// Copyright 2022, University of Colorado Boulder

/**
 * Shows the sky and the ground.
 * TODO: Possibly generalize this, move to scenery-phet, replace usages
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Color, LinearGradient, Rectangle } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CASColors from '../CASColors.js';

class BackgroundNode extends Rectangle {
  constructor( bottomY: number, visibleBoundsProperty: Property<Bounds2> ) {
    super( visibleBoundsProperty.value.centerX, visibleBoundsProperty.value.top, visibleBoundsProperty.value.centerX, bottomY );

    Property.multilink( [
      CASColors.skyGradientTopColorProperty,
      CASColors.skyGradientMiddleColorProperty,
      CASColors.skyGradientBottomColorProperty,
      CASColors.groundColorProperty,
      visibleBoundsProperty
    ], ( skyGradientTopColor: Color, skyGradientMiddleColor: Color, skyGradientBottomColor: Color, groundColor: Color, visibleBounds: Bounds2 ) => {
      const gradient = new LinearGradient( visibleBounds.centerX, visibleBounds.top, visibleBounds.centerX, bottomY );

      // sky gradient, sampled from a screenshot
      gradient.addColorStop( 0.0, CASColors.skyGradientTopColorProperty.value );
      gradient.addColorStop( 0.5, CASColors.skyGradientMiddleColorProperty.value );
      gradient.addColorStop( 1.0, CASColors.skyGradientBottomColorProperty.value );

      // The ground
      gradient.addColorStop( 1.0, CASColors.groundColorProperty.value );

      this.setRect( visibleBounds.left, visibleBounds.top, visibleBounds.width, visibleBounds.height );
      this.fill = gradient;
    } );
  }
}

centerAndSpread.register( 'BackgroundNode', BackgroundNode );
export default BackgroundNode;