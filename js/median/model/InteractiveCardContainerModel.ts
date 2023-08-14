// Copyright 2023, University of Colorado Boulder

/**
 * Adds sonification, animation, and interactive user input logic in the accordion box.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import CardContainerModel, { CardContainerModelOptions } from './CardContainerModel.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import cardMovement1_mp3 from '../../../sounds/cardMovement1_mp3.js';
import cardMovement2_mp3 from '../../../sounds/cardMovement2_mp3.js';
import cardMovement3_mp3 from '../../../sounds/cardMovement3_mp3.js';
import cardMovement4_mp3 from '../../../sounds/cardMovement4_mp3.js';
import cardMovement5_mp3 from '../../../sounds/cardMovement5_mp3.js';
import cardMovement6_mp3 from '../../../sounds/cardMovement6_mp3.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianModel from './MedianModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import CardModel from './CardModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';

const cardMovementSounds = [
  cardMovement1_mp3,
  cardMovement2_mp3,
  cardMovement3_mp3,
  cardMovement4_mp3,
  cardMovement5_mp3,
  cardMovement6_mp3
];

export const cardMovementSoundClips = cardMovementSounds.map( sound => new SoundClip( sound, {
  initialOutputLevel: 0.3,
  additionalAudioNodes: []
} ) );
cardMovementSoundClips.forEach( soundClip => soundManager.addSoundGenerator( soundClip ) );

type InteractiveCardContainerModelOptions = EmptySelfOptions & CardContainerModelOptions;

export default class InteractiveCardContainerModel extends CardContainerModel {

  // For sonification, order the active, non-displaced cards appeared in the last step
  private lastStepOrder: CardModel[] = [];

  // Indicates whether the user has ever dragged a card. It's used to hide the drag indicator arrow after
  // the user dragged a card
  public readonly hasDraggedCardProperty: TReadOnlyProperty<boolean>;
  public readonly dragIndicationCardProperty: Property<CardModel | null>;
  public readonly totalDragDistanceProperty: Property<number>;
  public readonly hasKeyboardMovedCardProperty = new BooleanProperty( false );

  public constructor( medianModel: MedianModel, providedOptions: InteractiveCardContainerModelOptions ) {
    super( medianModel, providedOptions );

    // Accumulated card drag distance, for purposes of hiding the drag indicator node
    this.totalDragDistanceProperty = new NumberProperty( 0 );

    this.hasDraggedCardProperty = new DerivedProperty( [ this.totalDragDistanceProperty, this.hasKeyboardMovedCardProperty ], ( totalDragDistance, hasKeyboardMovedCard ) => {
      return totalDragDistance > 15 || hasKeyboardMovedCard;
    } );

    this.dragIndicationCardProperty = new Property<CardModel | null>( null, {
      phetioReadOnly: true,
      phetioValueType: NullableIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: this.parentContext === 'accordion' ? providedOptions.tandem.createTandem( 'cardDragIndicatorProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'This is for PhET-iO internal use only.'
    } );

    this.cardCellsChangedEmitter.addListener( () => {
      medianModel.areCardsSortedProperty.value = this.isDataSorted();
    } );

    const updateDragIndicationCardProperty = () => {

      const leftCard = this.getCardsInCellOrder()[ 0 ];
      const rightCard = this.getCardsInCellOrder()[ 1 ];

      // if the user has not yet dragged a card and there are multiple cards showing, fade in the drag indicator
      if ( !this.hasDraggedCardProperty.value && leftCard && rightCard ) {
        this.dragIndicationCardProperty.value = leftCard;
      }

      // if the user has dragged a card and the hand indicator is showing, fade the hand indicator out
      if ( this.hasDraggedCardProperty.value || !leftCard || !rightCard ) {
        this.dragIndicationCardProperty.value = null;
      }
    };

    this.cardCellsChangedEmitter.addListener( updateDragIndicationCardProperty );
    this.hasDraggedCardProperty.link( updateDragIndicationCardProperty );
    this.cards.forEach( card => card.soccerBall.valueProperty.lazyLink( updateDragIndicationCardProperty ) );

    medianModel.selectedSceneModelProperty.value.resetEmitter.addListener( () => {
      this.totalDragDistanceProperty.reset();
      this.hasKeyboardMovedCardProperty.reset();
    } );
  }

  /**
   * Play sound effects whenever two cards pass each other. If the user is dragging it, that card gets precedence for choosing the pitch.
   * Moving to the right is a higher pitch. If one card animates past another, that movement direction chooses the pitch.
   * If both cards are animating, use an in-between pitch.
   */
  public step( dt: number ): void {

    // Only consider cards that landed more than 0.1 seconds ago, to avoid an edge case that was mistakenly playing audio when soccer balls land
    const activeCards = this.cards.filter( card => card.isActiveProperty.value && card.timeSinceLanded > 0.1 && card.animationReason !== 'valueChanged' );

    // Determine the sort order to see which cards have swapped
    const newOrder = _.sortBy( activeCards, card => card.positionProperty.value.x );

    // Consider only cards which are both in the old and new lists
    const oldList = this.lastStepOrder.filter( cardNode => newOrder.includes( cardNode ) );
    const newList = newOrder.filter( cardNode => this.lastStepOrder.includes( cardNode ) );

    const swappedPairs: Array<{ first: CardModel; second: CardModel; direction: string }> = [];

    // Compare the old list and the new list
    for ( let i = 0; i < oldList.length; i++ ) {
      if ( oldList[ i ] !== newList[ i ] ) {
        // If the items at the same index in both lists are different, then they have swapped places.
        const direction = newList.indexOf( oldList[ i ] ) > i ? 'right' : 'left';
        const pairExists = swappedPairs.some( pair => pair.first === newList[ i ] && pair.second === oldList[ i ] );

        if ( !pairExists ) {
          swappedPairs.push( { first: oldList[ i ], second: newList[ i ], direction: direction } );
        }
      }
    }

    const opposite = ( direction: string ) => direction === 'left' ? 'right' : 'left';

    // You now have a list of pairs of CardNodes that swapped places and their directions
    swappedPairs.forEach( pair => {

      // If the user dragged a card, that takes precedence for choosing the pitch
      const directionToPlayFromInteraction = pair.first.isDraggingProperty.value && !pair.second.isDraggingProperty.value ? pair.direction :
                                             pair.second.isDraggingProperty.value && !pair.first.isDraggingProperty.value ? opposite( pair.direction ) :
                                             'none';

      // If one card animated past a stationary card, the moving card chooses the pitch.
      // If both cards are animating, use an in-between pitch.
      const directionToPlayFromAnimation = pair.first.animation && !pair.second.animation ? pair.direction :
                                           pair.second.animation && !pair.first.animation ? opposite( pair.direction ) :
                                           'both';

      const directionToPlay = directionToPlayFromInteraction !== 'none' ? directionToPlayFromInteraction : directionToPlayFromAnimation;

      const availableSoundClips = cardMovementSoundClips.filter( clip => !clip.isPlayingProperty.value );

      if ( ( directionToPlay === 'left' || directionToPlay === 'right' || directionToPlay === 'both' ) && availableSoundClips.length > 0 ) {

        const randomClip = availableSoundClips[ dotRandom.nextInt( availableSoundClips.length ) ];

        // Moving to the right, go up in pitch by 4 semitones
        randomClip.setPlaybackRate( CAVQueryParameters.cardMovementSoundPlaybackRate *
                                    ( directionToPlay === 'left' ? 1 :
                                      directionToPlay === 'right' ? Math.pow( 2, 4 / 12 ) :
                                      directionToPlay === 'both' ? Math.pow( 2, 2 / 12 ) : 0 ) );
        randomClip.play();
      }
    } );

    this.lastStepOrder = newOrder;

    this.getCardsInCellOrder().forEach( card => {
      card.timeSinceLanded += dt;
    } );
  }

}

centerAndVariability.register( 'InteractiveCardContainerModel', InteractiveCardContainerModel );