// Copyright 2023-2025, University of Colorado Boulder

/**
 * InteractiveCardContainerModel manages the interactive card container in a simulation. It supports a variety
 * of user interactions, including mouse drags and keyboard inputs. With integrated sonification, it provides
 * auditory feedback when cards shift position, ensuring a more accessible user experience.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import GroupSelectModel from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSelectModel.js';
import isResettingAllProperty from '../../../../scenery-phet/js/isResettingAllProperty.js';
import CardSounds from '../../../../tambo/js/sound-generators/CardSounds.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import centerAndVariability from '../../centerAndVariability.js';
import CardContainerModel, { CardContainerModelOptions } from './CardContainerModel.js';
import CardModel from './CardModel.js';
import MedianModel from './MedianModel.js';

// This property determines when the card sound can be enabled after reset. In this case it is enabled
// after one step has been completed.
const ENABLE_SOUND_IN_STEP_PROPERTY = new BooleanProperty( true );

// A card sound should not be enabled during reset, state setting, or the first step call after either
// of those processes.
const cardSoundEnableProperty = new DerivedProperty( [ isResettingAllProperty, isSettingPhetioStateProperty, ENABLE_SOUND_IN_STEP_PROPERTY ], ( isResetting, isSettingState, isEnabled ) => {
  if ( isResetting || isSettingState ) {
    ENABLE_SOUND_IN_STEP_PROPERTY.value = false;
  }
  return !isResetting && !isSettingState && isEnabled;
} );

cardSoundEnableProperty.link( enabled => {
  CardSounds.CARD_MOVEMENT_SOUNDS_ENABLED_PROPERTY.value = enabled;
} );

type InteractiveCardContainerModelOptions = EmptySelfOptions & CardContainerModelOptions;

export default class InteractiveCardContainerModel extends CardContainerModel {

  // For sonification, order the active, non-displaced cards appeared in the last step
  private lastStepOrder: CardModel[] = [];

  public readonly totalDragDistanceProperty: Property<number>;

  public readonly manuallySortedEmitter: Emitter;

  public readonly groupSortInteractionModel: GroupSelectModel<CardModel>;

  public constructor( medianModel: MedianModel, providedOptions: InteractiveCardContainerModelOptions ) {
    super( medianModel, providedOptions );

    this.totalDragDistanceProperty = new NumberProperty( 0 );

    this.groupSortInteractionModel = new GroupSelectModel<CardModel>( {
      getGroupItemValue: cardModel => cardModel.indexProperty.value,
      tandem: providedOptions.tandem.createTandem( 'groupSortInteractionModel' )
    } );

    this.totalDragDistanceProperty.link( totalDragDistance => {
      this.groupSortInteractionModel.setMouseSortedGroupItem( totalDragDistance > 15 );
    } );

    this.cardCellsChangedEmitter.addListener( () => {
      medianModel.areCardsSortedProperty.value = this.isDataSorted();
    } );

    const updateMouseSortCueNode = () => {

      // If the user has not yet dragged a card and there are multiple cards showing, add the drag indicator.
      // If the user has dragged a card, then the drag indicator does not need to be shown.
      this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = this.getCardsInCellOrder().length >= 2 &&
                                                                         this.groupSortInteractionModel.mouseSortCueShouldBeVisible();
    };

    this.cardCellsChangedEmitter.addListener( updateMouseSortCueNode );
    this.groupSortInteractionModel.registerUpdateSortCueNode( updateMouseSortCueNode );
    this.cards.forEach( card => card.soccerBall.valueProperty.lazyLink( updateMouseSortCueNode ) );

    medianModel.selectedSceneModelProperty.value.resetEmitter.addListener( () => {
      this.totalDragDistanceProperty.reset();
      this.groupSortInteractionModel.reset();
    } );

    medianModel.selectedSceneModelProperty.value.preClearDataEmitter.addListener( () => {
      this.groupSortInteractionModel.resetInteractionState();
    } );

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

    const swappedPairs: Array<{ first: CardModel; second: CardModel; direction: 'left' | 'right' }> = [];

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

      CardSounds.playCardMovementSound( directionToPlay );
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