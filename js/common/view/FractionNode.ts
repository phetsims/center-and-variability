// Copyright 2023, University of Colorado Boulder

/**
 * Shows an expression (represented by a Node) divided by another expression (also a Node). The vinculum is horizontal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class FractionNode extends VBox {
  public constructor( numerator: Node, denominator: Node ) {
    super( {
      children: [ numerator, new HSeparator(), denominator ],
      align: 'center'
    } );
  }
}

centerAndVariability.register( 'FractionNode', FractionNode );