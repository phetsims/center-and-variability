// Copyright 2022-2023, University of Colorado Boulder

/**
 * BackgroundNode is a visual component designed to represent the environment's backdrop. It features both the sky
 * and the ground, transitioning through a gradient. To ensure consistent visibility and adaptability to various
 * screen dimensions, the node reshapes itself based on the current visible bounds. The sky's gradient
 * is derived from sampled color stops, while the ground is distinguished with a distinct color for clarity and contrast.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { LinearGradient, Rectangle } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CAVColors from '../CAVColors.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class BackgroundNode extends Rectangle {
  public constructor( bottomY: number, visibleBoundsProperty: Property<Bounds2> ) {
    super( visibleBoundsProperty.value.centerX, visibleBoundsProperty.value.top, visibleBoundsProperty.value.centerX, bottomY, {
      isDisposable: false
    } );

    Multilink.multilink( [
      CAVColors.skyGradientTopColorProperty,
      CAVColors.skyGradientMiddleColorProperty,
      CAVColors.skyGradientBottomColorProperty,
      CAVColors.groundColorProperty,
      visibleBoundsProperty
    ], ( skyGradientTopColor, skyGradientMiddleColor, skyGradientBottomColor, groundColor, visibleBounds ) => {
      const gradient = new LinearGradient( visibleBounds.centerX, visibleBounds.top, visibleBounds.centerX, bottomY );

      // sky gradient, sampled from a screenshot
      gradient.addColorStop( 0.0, skyGradientTopColor );
      gradient.addColorStop( 0.5, skyGradientMiddleColor );
      gradient.addColorStop( 0.9999, skyGradientBottomColor );

      // The ground
      gradient.addColorStop( 1.0, groundColor );

      this.setRect( visibleBounds.left, visibleBounds.top, visibleBounds.width, visibleBounds.height );
      this.fill = gradient;
    } );
  }
}

centerAndVariability.register( 'BackgroundNode', BackgroundNode );