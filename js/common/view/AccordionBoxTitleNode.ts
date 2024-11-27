// Copyright 2023, University of Colorado Boulder

/**
 * AccordionBoxTitleNode is a visual node that displays the title within an accordion box.
 * This title is accompanied by a semi-transparent background to ensure readability, even if
 * data or other visual elements pass behind it. The background adapts to the title's size
 * and ensures the title remains centered, making for a dynamic and adaptable visual component
 * suited for various title lengths and contents.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ManualConstraint, Node, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../CAVConstants.js';

export default class AccordionBoxTitleNode extends Node {
  public constructor( stringProperty: TReadOnlyProperty<string>, backgroundFill: TColor ) {

    const titleText = new Text( stringProperty, {
      font: CAVConstants.MAIN_FONT,

      // About 1/3 of the way across the accordion box, so it doesn't overlap with too much data
      maxWidth: 300
    } );

    // Will be sized in the manual constraint
    const titleBackground = new Rectangle( 0, 0, 0, 0, {
      sizable: true,
      layoutOptions: { grow: 1, stretch: true },
      fill: backgroundFill,
      opacity: 0.5
    } );

    super( {
      children: [ titleBackground, titleText ],
      layoutOptions: { grow: 1, stretch: true },
      isDisposable: false
    } );

    ManualConstraint.create( this, [ titleText ], titleTextProxy => {
      titleBackground.rectBounds = titleTextProxy.bounds;
      titleTextProxy.center = titleBackground.center;
    } );
  }
}

centerAndVariability.register( 'AccordionBoxTitleNode', AccordionBoxTitleNode );