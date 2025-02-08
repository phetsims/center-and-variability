// Copyright 2023-2025, University of Colorado Boulder

/**
 * VariabilityMeasureIconNode represents the icons for IQR, Range, MAD, and the Interval Tool checkboxes,
 * which are all the same except for the color.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import IconArrowNode from './IconArrowNode.js';

export default class VariabilityMeasureIconNode extends Node {

  public constructor( color: TColor, iconDimension: number = CAVConstants.CHECKBOX_ICON_DIMENSION ) {
    const rectangle = new Rectangle( 0, 0, iconDimension, iconDimension, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( 0.1 )
    } );
    super( {
      children: [ rectangle, new IconArrowNode( rectangle ) ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'VariabilityMeasureIconNode', VariabilityMeasureIconNode );