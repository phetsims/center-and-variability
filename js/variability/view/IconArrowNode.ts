// Copyright 2023, University of Colorado Boulder

/**
 * The interval tool icon and variability measures show a similar arrow across their icon rectangles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
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