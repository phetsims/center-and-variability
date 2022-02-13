// Copyright 2022, University of Colorado Boulder

/**
 * Draggable node that shows a single number on a card.  The number can change if the corresponding ball is dragged.
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
import CardModel from '../model/CardModel.js';

type NumberCardSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class CardNode extends Node {
  readonly positionProperty: Vector2Property;
  readonly dragListener: DragListener;
  readonly casObject: CASObject;
  animation: Animation | null;
  animationTo: Vector2 | null;

  static readonly CARD_WIDTH = 50;

  constructor( cardModel: CardModel, position: Vector2, getDragRange: () => Range, providedOptions?: NumberCardOptions ) {

    const cornerRadius = 10;
    const rectangle = new Rectangle( 0, 0, CardNode.CARD_WIDTH, CardNode.CARD_WIDTH, cornerRadius, cornerRadius, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'white'
    } );
    const text = new Text( '', {
      font: new PhetFont( 24 )
    } );

    cardModel.casObject.valueProperty.link( value => {
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
      useDeepEquality: true
    } );

    this.casObject = cardModel.casObject;

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

    this.addLinkedElement( cardModel, {
      tandem: options.tandem.createTandem( 'cardModel' )
    } );
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

centerAndSpread.register( 'CardNode', CardNode );
export default CardNode;