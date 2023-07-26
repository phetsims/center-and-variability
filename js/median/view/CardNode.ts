// Copyright 2022-2023, University of Colorado Boulder

/**
 * Draggable node that shows a single number on a card.  The number can change if the corresponding ball is dragged.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Color, DragListener, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SoccerBall from '../../soccer-common/model/SoccerBall.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CardModel from '../model/CardModel.js';
import CardNodeContainer from './CardNodeContainer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import cvCardPickupSound_mp3 from '../../../sounds/cvCardPickupSound_mp3.js';
import cvCardDropSound_mp3 from '../../../sounds/cvCardDropSound_mp3.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';
import CAVConstants from '../../common/CAVConstants.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = WithRequired<NodeOptions, 'tandem'>;
export type CardNodeOptions = SelfOptions & ParentOptions;

export const cardPickUpSoundClip = new SoundClip( cvCardPickupSound_mp3, {
  initialOutputLevel: 0.3,
  initialPlaybackRate: CAVQueryParameters.cardMovementSoundPlaybackRate
} );
soundManager.addSoundGenerator( cardPickUpSoundClip );

export const cardDropSoundClip = new SoundClip( cvCardDropSound_mp3, {
  initialOutputLevel: 0.1,
  initialPlaybackRate: CAVQueryParameters.cardMovementSoundPlaybackRate * 1.3
} );
soundManager.addSoundGenerator( cardDropSoundClip );

// How much to translate the card on pick up and drop
export const PICK_UP_DELTA_X = -4;
export const PICK_UP_DELTA_Y = -4;

export default class CardNode extends Node {

  public readonly dragListener: DragListener;

  public readonly soccerBall: SoccerBall;

  private cardsToTheLeft: CardNode[] = [];

  public constructor( public readonly cardNodeContainer: CardNodeContainer, public readonly model: CardModel, providedOptions: CardNodeOptions ) {

    const cornerRadius = 10;
    const rectangle = new Rectangle( 0, 0, CAVConstants.CARD_DIMENSION, CAVConstants.CARD_DIMENSION, cornerRadius, cornerRadius, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'white'
    } );
    const text = new Text( '', {
      font: new PhetFont( 24 )
    } );

    const cardNode = new Node( {
      children: [ rectangle, text ]
    } );

    // For layout only, a bounding box that the card animates within for the "pick up" and "drop" effects.
    const offsetContainer = new Rectangle( PICK_UP_DELTA_X, PICK_UP_DELTA_Y, CAVConstants.CARD_DIMENSION - PICK_UP_DELTA_X, CAVConstants.CARD_DIMENSION - PICK_UP_DELTA_Y, {
      stroke: Color.TRANSPARENT,
      lineWidth: 0,
      children: [ cardNode ]
    } );

    model.isDraggingProperty.lazyLink( isDragging => {

      if ( isDragging ) {
        this.moveToFront();

        // Set the relative position within the parent.
        cardNode.setTranslation( PICK_UP_DELTA_X, PICK_UP_DELTA_Y );
        cardPickUpSoundClip.play();
      }
      else {
        // Restore the relative position within the parent.
        cardNode.setTranslation( 0, 0 );
        cardDropSoundClip.play();
      }
    } );

    const options = optionize<CardNodeOptions, SelfOptions, ParentOptions>()( {
      children: [ offsetContainer ],
      cursor: 'pointer',
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    model.soccerBall.valueProperty.link( value => {
      text.string = value === null ? '' : value + '';
      text.center = rectangle.center;
      this.visible = value !== null;
    } );

    this.soccerBall = model.soccerBall;

    model.positionProperty.link( position => {
      const range = model.cardContainerModel.getDragRange();
      const before = this.translation.copy();
      this.translation = new Vector2( range.constrainValue( position.x ), 0 );

      const delta = this.translation.minus( before );
      if ( model.isDraggingProperty.value ) {
        model.dragDistanceEmitter.emit( Math.abs( delta.x ) );

        // Set the relative position within the parent.
        cardNode.setTranslation( PICK_UP_DELTA_X, PICK_UP_DELTA_Y );
      }
    } );

    this.dragListener = new DragListener( {
      tandem: options.tandem.createTandem( 'dragListener' ),
      positionProperty: model.positionProperty,
      start: () => model.isDraggingProperty.set( true ),
      end: () => model.isDraggingProperty.set( false )
    } );
    this.addInputListener( this.dragListener );

    this.soccerBall.dragStartedEmitter.addListener( () => this.moveToFront() );

    this.addLinkedElement( model );
  }
}

centerAndVariability.register( 'CardNode', CardNode );