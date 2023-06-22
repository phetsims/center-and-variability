// Copyright 2022-2023, University of Colorado Boulder

/**
 * Draggable node that shows a single number on a card.  The number can change if the corresponding ball is dragged.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { DragListener, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SoccerBall from '../../soccer-common/model/SoccerBall.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Animation from '../../../../twixt/js/Animation.js';
import Range from '../../../../dot/js/Range.js';
import Easing from '../../../../twixt/js/Easing.js';
import CardModel from '../model/CardModel.js';
import Emitter from '../../../../axon/js/Emitter.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { cardMovementSoundClips } from './CardNodeContainer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import cvCardPickupSound_mp3 from '../../../sounds/cvCardPickupSound_mp3.js';
import cvCardDropSound_mp3 from '../../../sounds/cvCardDropSound_mp3.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';

type SelfOptions = EmptySelfOptions;
export type CardNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

const cardPickUpSoundClip = new SoundClip( cvCardPickupSound_mp3, {
  initialOutputLevel: 0.3,
  initialPlaybackRate: CAVQueryParameters.cardMovementSoundPlaybackRate
} );
soundManager.addSoundGenerator( cardPickUpSoundClip );

const cardDropSoundClip = new SoundClip( cvCardDropSound_mp3, {
  initialOutputLevel: 0.3,
  initialPlaybackRate: CAVQueryParameters.cardMovementSoundPlaybackRate
} );
soundManager.addSoundGenerator( cardDropSoundClip );

export default class CardNode extends Node {
  public readonly positionProperty: Vector2Property;
  public readonly dragListener: DragListener;

  // Emit how far the card has been dragged for purposes of hiding the drag indicator arrow when the user
  // has dragged a sufficient amount
  public readonly dragDistanceEmitter: TEmitter<[ number ]> = new Emitter( {
    parameters: [ { valueType: 'number' } ]
  } );

  public readonly soccerBall: SoccerBall;
  public animation: Animation | null = null;
  private animationTo: Vector2 | null = null;

  public static readonly CARD_DIMENSION = 43;

  public constructor( cardModel: CardModel, position: Vector2, getDragRange: () => Range, providedOptions: CardNodeOptions ) {

    const cornerRadius = 10;
    const rectangle = new Rectangle( 0, 0, CardNode.CARD_DIMENSION, CardNode.CARD_DIMENSION, cornerRadius, cornerRadius, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'white'
    } );
    const text = new Text( '', {
      font: new PhetFont( 24 )
    } );

    const options = optionize<CardNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ rectangle, text ],
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    cardModel.soccerBall.valueProperty.link( value => {
      text.string = value === null ? '' : value + '';
      text.center = rectangle.center;
      this.visible = value !== null;
    } );

    this.positionProperty = new Vector2Property( position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      valueComparisonStrategy: 'equalsFunction'
    } );

    this.soccerBall = cardModel.soccerBall;

    // Track whether the card is being dragged, for purposes of hiding the drag indicator arrow when the user
    // has dragged a sufficient amount
    let dragging = false;

    this.positionProperty.link( position => {
      const range = getDragRange();
      const before = this.translation.copy();
      this.translation = new Vector2( range.constrainValue( position.x ), 0 );

      const delta = this.translation.minus( before );
      if ( dragging ) {
        this.dragDistanceEmitter.emit( Math.abs( delta.x ) );
      }
    } );

    this.dragListener = new DragListener( {
      tandem: options.tandem.createTandem( 'dragListener' ),
      positionProperty: this.positionProperty,
      start: () => {
        dragging = true;
        this.moveToFront();
        cardPickUpSoundClip.play();
      },
      end: () => {
        dragging = false;
        cardDropSoundClip.play();
      }
    } );
    this.addInputListener( this.dragListener );

    this.soccerBall.dragStartedEmitter.addListener( () => this.moveToFront() );

    this.addLinkedElement( cardModel );
  }

  public animateTo( destination: Vector2, duration: number, audio: boolean ): void {

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
    else {
      if ( destination.equals( this.positionProperty.value ) ) {

        // Already at the desired destination.
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
      this.animation = null;
      this.animationTo = null;
    } );

    if ( audio ) {
      const randomSound = cardMovementSoundClips[ dotRandom.nextInt( cardMovementSoundClips.length ) ];

      // Moving to the right, go up in pitch by 4 semitones
      randomSound.setPlaybackRate( CAVQueryParameters.cardMovementSoundPlaybackRate * ( destination.x < this.positionProperty.value.x ? 1 : Math.pow( 2, 4 / 12 ) ) );
      randomSound.play();
    }

    this.animation.start();
  }
}

centerAndVariability.register( 'CardNode', CardNode );