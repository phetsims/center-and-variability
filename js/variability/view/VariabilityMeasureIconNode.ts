// Copyright 2023, University of Colorado Boulder

/**
 * The icons for IQR, Range, MAD, and the Interval Tool checkboxes are all the same except for the color.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Color, Node, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import IconArrowNode from './IconArrowNode.js';
import CAVConstants from '../../common/CAVConstants.js';

export default class VariabilityMeasureIconNode extends Node {

  public constructor( color: TColor ) {
    const rectangle = new Rectangle( 0, 0, CAVConstants.CHECKBOX_ICON_DIMENSION, CAVConstants.CHECKBOX_ICON_DIMENSION, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( 0.1 )
    } );
    super( { children: [ rectangle, new IconArrowNode( rectangle ) ] } );
  }
}

centerAndVariability.register( 'VariabilityMeasureIconNode', VariabilityMeasureIconNode );