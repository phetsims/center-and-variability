// Copyright 2022-2023, University of Colorado Boulder

/**
 * Draggable node that shows a single number on a card.  The number can change if the corresponding ball is dragged.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Color, DragListener, InteractiveHighlightingNode, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CardModel from '../model/CardModel.js';
import CardNodeContainer from './CardNodeContainer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import cardPickup_mp3 from '../../../sounds/cardPickup_mp3.js';
import cardDrop_mp3 from '../../../sounds/cardDrop_mp3.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';
import CAVConstants from '../../common/CAVConstants.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = WithRequired<NodeOptions, 'tandem'>;
export type CardNodeOptions = SelfOptions & ParentOptions;

export const cardPickUpSoundClip = new SoundClip( cardPickup_mp3, {
  initialOutputLevel: 0.4,
  initialPlaybackRate: CAVQueryParameters.cardMovementSoundPlaybackRate
} );
soundManager.addSoundGenerator( cardPickUpSoundClip );

export const cardDropClip = new SoundClip( cardDrop_mp3, {
  initialOutputLevel: 0.2,
  initialPlaybackRate: CAVQueryParameters.cardMovementSoundPlaybackRate * 1.3
} );
soundManager.addSoundGenerator( cardDropClip );

// How much to translate the card on pick up and drop
export const PICK_UP_DELTA_X = -4;
export const PICK_UP_DELTA_Y = -4;

export default class CardNode extends Node {

  public readonly dragListener: DragListener;

  public readonly soccerBall: SoccerBall;

  // We want to access the cardNode without the offset container for focusHighlight
  public readonly cardNode: Node;

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

    const cardNode = new InteractiveHighlightingNode( {
      children: [ rectangle, text ],
      cursor: 'pointer'
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
        cardDropClip.play();
      }
    } );

    const options = optionize<CardNodeOptions, SelfOptions, ParentOptions>()( {
      children: [ offsetContainer ],
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    this.cardNode = cardNode;

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
      tandem: model.cardContainerModel.parentContext === 'info' ? Tandem.OPT_OUT : options.tandem.createTandem( 'dragListener' ),
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