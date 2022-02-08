// Copyright 2022, University of Colorado Boulder

/**
 * Shows the "Kick 1" and "Kick 10" buttons in the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CASObject from '../model/CASObject.js';

type NumberCardSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class NumberCardNode extends Node {

  constructor( casObject: CASObject, providedOptions?: NumberCardOptions ) {

    const sideLength = 50;
    const cornerRadius = 10;
    const rectangle = new Rectangle( 0, 0, sideLength, sideLength, cornerRadius, cornerRadius, {
      stroke: 'black',
      lineWidth: 2,
      fill: 'white'
    } );
    const text = new Text( '', {
      font: new PhetFont( 24 )
    } );

    casObject.valueProperty.link( value => {
      text.text = value + '';
      text.center = rectangle.center;
    } );

    const options = optionize<NumberCardOptions, NumberCardSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED,
      children: [ rectangle, text ]
    }, providedOptions );

    super( options );
  }
}

centerAndSpread.register( 'NumberCardNode', NumberCardNode );
export default NumberCardNode;