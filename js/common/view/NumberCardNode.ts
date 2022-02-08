// Copyright 2022, University of Colorado Boulder

/**
 * Shows the "Kick 1" and "Kick 10" buttons in the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { DragListener, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CASObject from '../model/CASObject.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Animation from '../../../../twixt/js/Animation.js';

type NumberCardSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class NumberCardNode extends Node {
  readonly positionProperty: Vector2Property;
  dragListener: DragListener;
  casObject: CASObject;
  animation: Animation | null;

  constructor( casObject: CASObject, position: Vector2, providedOptions?: NumberCardOptions ) {

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

    this.positionProperty = new Vector2Property( position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      reentrant: true // TODO: Why????
    } );

    this.casObject = casObject;

    this.animation = null;

    this.positionProperty.link( position => {

      // TODO: Don't drag past the edges
      this.translation = new Vector2( position.x, 0 );
    } );

    this.dragListener = new DragListener( {
      positionProperty: this.positionProperty,
      start: () => {
        this.moveToFront();
      }
    } );
    this.addInputListener( this.dragListener );
  }

  dispose() {
    this.positionProperty.dispose();
    super.dispose();
  }
}

centerAndSpread.register( 'NumberCardNode', NumberCardNode );
export default NumberCardNode;