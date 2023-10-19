// Copyright 2023, University of Colorado Boulder

/**
 * InteractiveCardContainerModel manages the interactive card container in a simulation. It supports a variety
 * of user interactions, including mouse drags and keyboard inputs. With integrated sonification, it provides
 * auditory feedback when cards shift position, ensuring a more accessible user experience.
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
import Tandem from '../../../../tandem/js/Tandem.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';
import Emitter from '../../../../axon/js/Emitter.js';
import isResettingProperty from '../../../../soccer-common/js/model/isResettingProperty.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

const cardMovementSounds = [
  cardMovement1_mp3,
  cardMovement2_mp3,
  cardMovement3_mp3,
  cardMovement4_mp3,
  cardMovement5_mp3,
  cardMovement6_mp3
];

// This property determines when the card sound can be enabled after reset. In this case it is enabled
// after one step has been completed.
const ENABLE_SOUND_IN_STEP_PROPERTY = new BooleanProperty( true );

// A card sound should not be enabled during reset, state setting, or the first step call after either
// of those processes.
const cardSoundEnableProperty = new DerivedProperty( [ isResettingProperty, isSettingPhetioStateProperty, ENABLE_SOUND_IN_STEP_PROPERTY ], ( isResetting, isSettingState, isEnabled ) => {
  if ( isResetting || isSettingState ) {
    ENABLE_SOUND_IN_STEP_PROPERTY.value = false;
  }
  return !isResetting && !isSettingState && isEnabled;
} );

export const cardMovementSoundClips = cardMovementSounds.map( sound => new SoundClip( sound, {
  initialOutputLevel: 0.3,
  additionalAudioNodes: [],
  enableControlProperties: [ cardSoundEnableProperty ]
} ) );
cardMovementSoundClips.forEach( soundClip => soundManager.addSoundGenerator( soundClip ) );

type InteractiveCardContainerModelOptions = EmptySelfOptions & CardContainerModelOptions;

export default class InteractiveCardContainerModel extends CardContainerModel {

  // For sonification, order the active, non-displaced cards appeared in the last step
  private lastStepOrder: CardModel[] = [];

  // Indicates whether the user has ever dragged a card, used to determine dragIndicationCardProperty.
  public readonly hasDraggedCardProperty: TReadOnlyProperty<boolean>;

  // The card where the drag indicator should appear. null if no drag indicator should appear.
  public readonly dragIndicationCardProperty: Property<CardModel | null>;

  public readonly totalDragDistanceProperty: Property<number>;

  // KEYBOARD INPUT PROPERTIES:
  // The card which currently has focus. Is part of what controls highlight visibility among other things.
  public readonly focusedCardProperty: Property<CardModel | null> = new Property<CardModel | null>( null );

  // Tracks when a card is currently grabbed via keyboard input.
  public readonly isCardGrabbedProperty = new BooleanProperty( false );

  // Visible Properties for keyboard hints
  public readonly isGrabReleaseCueVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly isKeyboardDragArrowVisibleProperty: TReadOnlyProperty<boolean>;

  // Properties that track if a certain action has ever been performed via keyboard input.
  public readonly hasKeyboardMovedCardProperty: Property<boolean>;
  public readonly hasKeyboardGrabbedCardProperty = new BooleanProperty( false );
  public readonly hasKeyboardSelectedDifferentCardProperty = new BooleanProperty( false );

  // Property that is triggered via focus and blur events in the InteractiveCardNodeContainer
  public readonly isKeyboardFocusedProperty = new BooleanProperty( false );
  public readonly manuallySortedEmitter: Emitter;

  public constructor( medianModel: MedianModel, providedOptions: InteractiveCardContainerModelOptions ) {
    super( medianModel, providedOptions );

    this.totalDragDistanceProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'totalDragDistanceProperty' ),
      phetioReadOnly: true, // controlled by the sim
      phetioDocumentation: 'Accumulated card drag distance, for purposes of hiding the drag indicator node'
    } );

    this.hasKeyboardMovedCardProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'hasKeyboardMovedCardProperty' ),
      phetioReadOnly: true, // controlled by the sim
      phetioDocumentation: 'Whether a card been moved using the keyboard, for purposes of hiding the drag indicator node'
    } );

    this.hasDraggedCardProperty = new DerivedProperty(
      [ this.totalDragDistanceProperty, this.hasKeyboardMovedCardProperty ],
      ( totalDragDistance, hasKeyboardMovedCard ) => totalDragDistance > 15 || hasKeyboardMovedCard
    );

    this.dragIndicationCardProperty = new Property<CardModel | null>( null, {
      phetioReadOnly: true,
      phetioValueType: NullableIO( ReferenceIO( CardModel.CardModelIO ) ),
      tandem: this.representationContext === 'accordion' ? providedOptions.tandem.createTandem( 'cardDragIndicatorProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'This is for PhET-iO internal use only.'
    } );

    this.isKeyboardDragArrowVisibleProperty = new DerivedProperty( [ this.focusedCardProperty, this.hasKeyboardMovedCardProperty, this.hasKeyboardGrabbedCardProperty,
        this.isCardGrabbedProperty, this.isKeyboardFocusedProperty ],
      ( focusedCard, hasKeyboardMovedCard, hasGrabbedCard, isCardGrabbed, hasKeyboardFocus ) => {
        return focusedCard !== null && !hasKeyboardMovedCard && hasGrabbedCard && isCardGrabbed && hasKeyboardFocus;
      } );

    this.isGrabReleaseCueVisibleProperty = new DerivedProperty( [ this.focusedCardProperty, this.hasKeyboardGrabbedCardProperty, this.isKeyboardFocusedProperty ],
      ( focusedCard, hasGrabbedCard, hasKeyboardFocus ) => {
        return focusedCard !== null && !hasGrabbedCard && hasKeyboardFocus;
      } );

    this.cardCellsChangedEmitter.addListener( () => {
      medianModel.areCardsSortedProperty.value = this.isDataSorted();
    } );

    const updateDragIndicationCardProperty = () => {

      const leftCard = this.getCardsInCellOrder()[ 0 ];
      const rightCard = this.getCardsInCellOrder()[ 1 ];

      // If the user has not yet dragged a card and there are multiple cards showing, add the drag indicator to leftCard.
      if ( !this.hasDraggedCardProperty.value && leftCard && rightCard ) {
        this.dragIndicationCardProperty.value = leftCard;
      }

      // If the user has dragged a card, then the drag indicator does not need to be shown.
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
      this.hasKeyboardGrabbedCardProperty.reset();
      this.hasKeyboardSelectedDifferentCardProperty.reset();
    } );

    medianModel.selectedSceneModelProperty.value.preClearDataEmitter.addListener( () => {
        this.focusedCardProperty.reset();
        this.isCardGrabbedProperty.reset();
      }
    );

    this.manuallySortedEmitter = new Emitter( {
      tandem: providedOptions.tandem.createTandem( 'manuallySortedEmitter' ),
      phetioFeatured: true
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

    // Card sounds may be enabled again when the first step after a reset or state set has been completed.
    ENABLE_SOUND_IN_STEP_PROPERTY.value = true;
  }

}

centerAndVariability.register( 'InteractiveCardContainerModel', InteractiveCardContainerModel );