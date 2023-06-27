// Copyright 2023, University of Colorado Boulder

/**
 * Shows the title in the accordion box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { ManualConstraint, Node, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

export default class AccordionBoxTitleNode extends Node {
  public constructor( stringProperty: TReadOnlyProperty<string>, backgroundFill: TColor ) {

    const titleText = new Text( stringProperty, {
      font: new PhetFont( 16 ),
      maxWidth: 300
    } );

    const titleBackground = new Rectangle( 0, 0, 80, 20, { sizable: true, layoutOptions: { grow: 1, stretch: true }, fill: backgroundFill, opacity: 0.5 } );
    titleText.center = titleBackground.center;

    super( { children: [ titleBackground, titleText ], layoutOptions: { grow: 1, stretch: true } } );


    ManualConstraint.create( this, [ titleText ], titleTextProxy => {
      titleBackground.rectBounds = titleTextProxy.bounds;
      titleTextProxy.center = titleBackground.center;
    } );


  }
}

centerAndVariability.register( 'AccordionBoxTitleNode', AccordionBoxTitleNode );