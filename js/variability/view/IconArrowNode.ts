// Copyright 2023-2025, University of Colorado Boulder

/**
 * IconArrowNode represents the arrow icon used for the interval tool and variability measure UIs.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import centerAndVariability from '../../centerAndVariability.js';


export default class IconArrowNode extends ArrowNode {
  public constructor( rectangle: Rectangle ) {
    super( 0, 0, rectangle.width, 0, {
      fill: 'black',
      stroke: null,
      center: rectangle.center,
      doubleHead: true,
      tailWidth: 2,
      headWidth: 7,
      headHeight: 5,
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'IconArrowNode', IconArrowNode );