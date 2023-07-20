// Copyright 2023, University of Colorado Boulder

/**
 * Shows the title in the accordion box. Has a semi-transparent background in case some data goes behind it.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { ManualConstraint, Node, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CAVConstants from '../CAVConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class AccordionBoxTitleNode extends Node {
  public constructor( stringProperty: TReadOnlyProperty<string>, backgroundFill: TColor, tandem: Tandem ) {

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
      tandem: tandem.createTandem( 'accordionBoxTitle' ),
      phetioVisiblePropertyInstrumented: true
    } );

    ManualConstraint.create( this, [ titleText ], titleTextProxy => {
      titleBackground.rectBounds = titleTextProxy.bounds;
      titleTextProxy.center = titleBackground.center;
    } );
  }
}

centerAndVariability.register( 'AccordionBoxTitleNode', AccordionBoxTitleNode );