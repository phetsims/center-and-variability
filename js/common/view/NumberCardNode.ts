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
import Range from '../../../../dot/js/Range.js';
import Easing from '../../../../twixt/js/Easing.js';

type NumberCardSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

// TODO: Rename to CardNode
class NumberCardNode extends Node {
  readonly positionProperty: Vector2Property;
  readonly dragListener: DragListener;
  readonly casObject: CASObject;
  animation: Animation | null;
  animationTo: Vector2 | null;

  static readonly CARD_WIDTH = 50;

  constructor( casObject: CASObject, position: Vector2, getDragRange: () => Range, providedOptions?: NumberCardOptions ) {

    const cornerRadius = 10;
    const rectangle = new Rectangle( 0, 0, NumberCardNode.CARD_WIDTH, NumberCardNode.CARD_WIDTH, cornerRadius, cornerRadius, {
      stroke: 'black',
      lineWidth: 1,
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
      children: [ rectangle, text ],
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      useDeepEquality: true,
      reentrant: true // TODO: Why????
    } );

    this.casObject = casObject;

    this.animation = null;

    this.positionProperty.link( position => {
      const range = getDragRange();
      this.translation = new Vector2( range.constrainValue( position.x ), 0 );
    } );

    this.dragListener = new DragListener( {
      positionProperty: this.positionProperty,
      start: () => {
        this.moveToFront();
      }
    } );
    this.addInputListener( this.dragListener );

    this.animationTo = null;
  }

  animateTo( destination: Vector2, duration: number ) {

    if ( this.animation ) {

      assert && assert( !!this.animationTo, 'animationTo should be defined when animation is defined' );

      if ( destination.equals( this.animationTo! ) ) {

        // Already moving to the desired destination.
        return;
      }
      else {
        this.animation.stop();
      }
    }

    // this.moveToFront(); TODO: If we keep this, we need to move any cards being dragged to the front
    this.animation = new Animation( {
      duration: duration,
      targets: [ {
        property: this.positionProperty,
        to: destination,
        easing: Easing.QUADRATIC_IN_OUT
      } ]
    } );
    this.animationTo = destination;

    this.animation.start();
    this.animation.finishEmitter.addListener( () => {
      this.animation = null;
      this.animationTo = null;
      this.moveToBack();
    } );
  }

  dispose() {
    this.positionProperty.dispose();
    super.dispose();
  }
}

centerAndSpread.register( 'NumberCardNode', NumberCardNode );
export default NumberCardNode;