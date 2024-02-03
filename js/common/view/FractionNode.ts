// Copyright 2023-2024, University of Colorado Boulder

/**
 * FractionNode is a visual representation of a mathematical fraction. It takes two expressions (both represented by Nodes) -
 * the numerator and the denominator - and displays them with a horizontal line (vinculum) in between.
 * This representation is aligned centrally, with the numerator and denominator centered with respect to the vinculum.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class FractionNode extends VBox {
  public constructor( numerator: Node, denominator: Node ) {
    super( {
      children: [ numerator, new HSeparator(), denominator ],
      align: 'center',
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'FractionNode', FractionNode );