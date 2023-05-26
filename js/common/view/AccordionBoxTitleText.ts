// Copyright 2023, University of Colorado Boulder

import centerAndVariability from '../../centerAndVariability.js';
import { Text } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

/**
 * Shows the title in the accordion box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 */
export default class AccordionBoxTitleText extends Text {
  public constructor( stringProperty: TReadOnlyProperty<string> ) {
    super( stringProperty, {
      font: new PhetFont( 16 ),
      maxWidth: 300
    } );
  }
}

centerAndVariability.register( 'AccordionBoxTitleText', AccordionBoxTitleText );