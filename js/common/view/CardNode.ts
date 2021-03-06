// Copyright 2022, University of Colorado Boulder

/**
 * Draggable node that shows a single number on a card.  The number can change if the corresponding ball is dragged.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { DragListener, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CAVObject from '../model/CAVObject.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Animation from '../../../../twixt/js/Animation.js';
import Range from '../../../../dot/js/Range.js';
import Easing from '../../../../twixt/js/Easing.js';
import CardModel from '../model/CardModel.js';
import Emitter from '../../../../axon/js/Emitter.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IEmitter from '../../../../axon/js/IEmitter.js';

type SelfOptions = EmptySelfOptions;
export type CardNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

class CardNode extends Node {
  public readonly positionProperty: Vector2Property;
  public readonly dragListener: DragListener;

  // Emit how far the card has been dragged for purposes of hiding the drag indicator arrow when the user
  // has dragged a sufficient amount
  public readonly dragDistanceEmitter: IEmitter<[ number ]>;

  public readonly casObject: CAVObject;
  public animation: Animation | null;
  private animationTo: Vector2 | null;

  public static readonly CARD_WIDTH = 43;

  public constructor( cardModel: CardModel, position: Vector2, getDragRange: () => Range, providedOptions: CardNodeOptions ) {

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

    const options = optionize<CardNodeOptions, SelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED,
      children: [ rectangle, text ],
      cursor: 'pointer',
      phetioDynamicElement: true
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

    this.dragDistanceEmitter = new Emitter<[ number ]>( {
      parameters: [ { valueType: 'number' } ]
    } );

    this.dragListener = new DragListener( {
      tandem: options.tandem.createTandem( 'dragListener' ),
      positionProperty: this.positionProperty,
      start: () => {
        this.moveToFront();
      },
      // TODO-UX: This emits for dragging the leftmost card to the left
      drag: ( event, listener ) => this.dragDistanceEmitter.emit( Math.abs( listener.modelDelta.x ) )
    } );
    this.addInputListener( this.dragListener );

    this.casObject.dragStartedEmitter.addListener( () => this.moveToFront() );

    this.animationTo = null;

    this.addLinkedElement( cardModel, {
      tandem: options.tandem.createTandem( 'cardModel' )
    } );
  }

  public animateTo( destination: Vector2, duration: number, callback = _.noop ): void {

    if ( this.animation ) {

      assert && assert( !!this.animationTo, 'animationTo should be defined when animation is defined' );

      if ( destination.equals( this.animationTo! ) ) {

        // Already moving to the desired destination.
        // TODO: should this callback be called from the finishEmitter of the existing animation?
        callback();
        return;
      }
      else {
        this.animation.stop();
      }
    }
    else {
      if ( destination.equals( this.positionProperty.value ) ) {

        // Already at the desired destination.
        callback();
        return;
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

    this.animation.endedEmitter.addListener( () => {
      callback();
      this.animation = null;
      this.animationTo = null;
    } );

    this.animation.start();
  }

  public override dispose(): void {
    this.positionProperty.dispose();
    this.dragListener.dispose();
    super.dispose();
  }
}

centerAndVariability.register( 'CardNode', CardNode );
export default CardNode;