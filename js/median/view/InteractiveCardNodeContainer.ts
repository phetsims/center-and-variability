// Copyright 2022-2025, University of Colorado Boulder

/**
 * InteractiveCardNodeContainer extends the functionality of the CardNodeContainer by adding interactivity features. It
 * manages user interactions, both mouse and keyboard, with the cards inside the accordion box, enabling users to sort,
 * drag, and drop the cards. This container also integrates visual feedbacks like drag indicators and animation
 * effects for cards, as well as auditory feedbacks with sounds on various user actions. Moreover, the container handles
 * focus and blur events, ensuring a seamless experience for keyboard users. Additionally, the container checks and
 * celebrates when the cards are sorted correctly.
 *
 * Major functionalities include:
 * - Handling drag and drop for individual cards, animating them back to their home cells when dropped.
 * - Responding to the correct sorting of cards with visual and auditory feedback.
 * - Managing focus highlights and interactivity cues for keyboard users.
 * - Processing keyboard inputs to move and sort cards using keys like arrows, space, enter, and more.
 * - Adjusting visual components like the drag indicator based on the interaction state.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import GroupSortInteractionView from '../../../../scenery-phet/js/accessibility/group-sort/view/GroupSortInteractionView.js';
import animatedPanZoomSingleton from '../../../../scenery/js/listeners/animatedPanZoomSingleton.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import CardModel from '../model/CardModel.js';
import InteractiveCardContainerModel from '../model/InteractiveCardContainerModel.js';
import CardDragIndicatorNode from './CardDragIndicatorNode.js';
import CardNode, { cardDropClip, cardPickUpSoundClip, PICK_UP_DELTA_X } from './CardNode.js';
import CardNodeContainer, { CARD_LAYER_OFFSET, CardNodeContainerOptions } from './CardNodeContainer.js';
import CelebrationNode from './CelebrationNode.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import isResettingAllProperty from '../../../../scenery-phet/js/isResettingAllProperty.js';

const FOCUS_HIGHLIGHT_Y_MARGIN = CAVConstants.CARD_SPACING + 3;

type SelfOptions = EmptySelfOptions;

type InteractiveCardNodeContainerOptions =
  SelfOptions
  & NodeTranslationOptions
  & PickRequired<CardNodeContainerOptions, 'tandem'>
  & StrictOmit<CardNodeContainerOptions, 'focusable'>;

export default class InteractiveCardNodeContainer extends CardNodeContainer {

  // Whether the cards were already sorted when a particular action was taken
  private wasSortedBefore = true;

  // The message that appears when the cards are sorted
  private readonly celebrationNode: CelebrationNode;
  private readonly groupSortInteractionView: GroupSortInteractionView<CardModel, CardNode>;

  public constructor( model: InteractiveCardContainerModel,
                      private readonly isSortingDataProperty: Property<boolean>,
                      sceneModel: CAVSoccerSceneModel,
                      medianVisibleProperty: Property<boolean>,
                      providedOptions: InteractiveCardNodeContainerOptions
  ) {

    const options = optionize<InteractiveCardNodeContainerOptions, SelfOptions, CardNodeContainerOptions>()( {}, providedOptions );

    super( model, sceneModel, medianVisibleProperty, options );

    const sortingRangeProperty = new Property( new Range( 0, this.model.cards.length - 1 ) );

    this.celebrationNode = new CelebrationNode( model, this.cardMap, this.sceneModel.resetEmitter );
    this.addChild( this.celebrationNode );

    const getNodeFromModelItem = ( cardModel: CardModel ) => this.cardMap.get( cardModel ) || null;

    this.groupSortInteractionView = new GroupSortInteractionView( model.groupSortInteractionModel, this, {
      getNextSelectedGroupItem: ( delta, selectedCardModel ) => {
        const currentIndex = selectedCardModel.indexProperty.value!;
        assert && assert( currentIndex !== null, 'need an index to be sorted' );
        const newIndex = currentIndex + delta;
        const cardNodes = this.getActiveCardNodesInOrder();
        const newCardNode = cardNodes[ newIndex ];
        assert && assert( newCardNode, 'wrong index for available cards I believe' );
        return newCardNode.model;
      },
      onGrab: groupItem => {
        groupItem.isDraggingProperty.value = true;
      },
      onRelease: groupItem => {
        groupItem.isDraggingProperty.value = false;
      },
      sortGroupItem: ( selectedCardModel, newValue ) => {
        assert && assert( selectedCardModel.indexProperty.value !== null, 'need an index to be sorted' );
        const delta = newValue - selectedCardModel.indexProperty.value!;
        swapCards( this.getActiveCardNodesInOrder(), this.cardMap.get( selectedCardModel )!, delta );
      },
      onSort: () => {

        // See if the user unsorted the data.  If so, uncheck the "Sort Data" checkbox
        if ( this.isSortingDataProperty.value && !this.model.isDataSorted() ) {
          this.isSortingDataProperty.value = false;
        }
      },
      getGroupItemToSelect: () => {
        const activeCards = this.getActiveCardNodesInOrder();
        return activeCards[ 0 ] ? activeCards[ 0 ].model : null;
      },
      getNodeFromModelItem: getNodeFromModelItem,
      getHighlightNodeFromModelItem: cardModel => getNodeFromModelItem( cardModel )?.cardNode || null,
      grabReleaseCueOptions: {
        top: CAVConstants.CARD_DIMENSION + FOCUS_HIGHLIGHT_Y_MARGIN + 15
      },
      sortingRangeProperty: sortingRangeProperty
    } );

    this.cardMap.forEach( ( cardNode, cardModel ) => {
      // Update the position of all cards (via animation) whenever any card is dragged
      cardNode.model.positionProperty.link( this.createDragPositionListener( cardNode ) );

      // When a card is dropped, send it to its home cell
      cardNode.dragListener.isPressedProperty.lazyLink( isPressed => {

        if ( isPressed ) {
          this.wasSortedBefore = model.isDataSorted();
        }

        if ( !isPressed && !isSettingPhetioStateProperty.value ) {

          // Animate the dropped card home
          model.animateToHomeCell( cardNode.model, 0.2 );

          if ( this.celebrationNode.isReadyForCelebration ) {
            this.celebrationNode.celebrate();
            model.manuallySortedEmitter.emit();
          }
        }
      } );

      cardModel.indexProperty.lazyLink( ( index, oldIndex ) => {
        if ( index !== null ) {
          if ( oldIndex === null || isSettingPhetioStateProperty.value || this.sceneModel.isClearingData || isResettingAllProperty.value ) {
            model.setAtHomeCell( cardModel );
          }
          else {
            model.animateToHomeCell( cardModel, 0.5 );
          }
        }
      } );

      // Accumulate drag distance
      cardModel.dragDistanceEmitter.addListener( distance => {
        model.totalDragDistanceProperty.value += distance;
      } );
    } );

    const keyboardSortCueNode = GroupSortInteractionView.createSortCueNode( model.groupSortInteractionModel.keyboardSortCueVisibleProperty );

    this.addChild( keyboardSortCueNode );

    const cardDragIndicatorVisibleProperty = new DerivedProperty(
      [ this.inputEnabledProperty, model.groupSortInteractionModel.mouseSortCueVisibleProperty ],
      ( inputEnabled, mouseSortCueVisible ) => inputEnabled && mouseSortCueVisible );

    const cardDragIndicatorTop = CAVConstants.CARD_DIMENSION - 10;

    const cardDragIndicatorNode = new CardDragIndicatorNode( {
      centerTop: new Vector2( 0.5 * CAVConstants.CARD_DIMENSION - PICK_UP_DELTA_X, cardDragIndicatorTop ),
      visibleProperty: cardDragIndicatorVisibleProperty
    } );

    this.addChild( cardDragIndicatorNode );

    let expandedCardNode: CardNode | null = null;

    cardDragIndicatorVisibleProperty.lazyLink( visible => {

      if ( !visible && expandedCardNode ) {
        expandedCardNode.restorePointerAreas();
        expandedCardNode = null;
      }

      if ( visible && !expandedCardNode ) {
        const activeCards = this.getActiveCardNodesInOrder();
        const card = activeCards[ 0 ]?.model || null;
        if ( card ) {

          const newCardNode = this.cardMap.get( card )!;

          const bounds = newCardNode.getLocalPointerAreaShape();

          // Expand the card's touch + mouse area to cover the hand. Much simpler than adding a DragListener.createForwardingListener
          const newArea = new Bounds2( bounds.minX, bounds.minY, bounds.maxX, bounds.maxY + cardDragIndicatorTop );
          newCardNode.mouseArea = newArea;
          newCardNode.touchArea = newArea;
          expandedCardNode = newCardNode;
        }
      }
    } );

    // for sound generation
    const checkboxCheckedSoundPlayer = sharedSoundPlayers.get( 'checkboxChecked' );

    this.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {

        if ( !model.isDataSorted() ) {

          // Will play sound effects in step()
          model.sortData();
        }
        else if ( !isSettingPhetioStateProperty.value ) {
          if ( model.representationContext === 'accordion' ) {
            if ( this.model.getActiveCards().length === 0 ) {
              checkboxCheckedSoundPlayer.play();
            }
            else {
              cardPickUpSoundClip.play();
              this.celebrationNode.animateCelebration1( () => cardDropClip.play(), false );
            }
          }
        }
      }
    } );

    // Needs to be pickable in accordion box.
    this.pickable = true;

    const focusedCardNodeProperty: TReadOnlyProperty<CardNode | null> = new DerivedProperty( [ model.groupSortInteractionModel.selectedGroupItemProperty ], focusedCard => {
      return focusedCard === null ? focusedCard : this.cardMap.get( focusedCard )!;
    } );

    // Update focused card when cards are created.
    model.cardCellsChangedEmitter.addListener( () => {

      const activeCardNodes = this.getActiveCardNodesInOrder();

      sortingRangeProperty.value = new Range( 0, activeCardNodes.length - 1 );

      // When a user is focused on the card container but there are no cards yet, we want to ensure that a card gets focused
      // once there is a card.
      if ( model.groupSortInteractionModel.selectedGroupItemProperty.value === null &&
           model.groupSortInteractionModel.isKeyboardFocusedProperty.value && model.getActiveCards().length === 1 ) {
        model.groupSortInteractionModel.selectedGroupItemProperty.value = activeCardNodes[ 0 ].model;
      }

        // If the card cells changed, and we have no more active cards left, that means that all the cards were removed.
      // Therefore, we want to set the focused card to null.
      else if ( model.getActiveCards().length === 0 ) {
        model.groupSortInteractionModel.selectedGroupItemProperty.value = null;
      }
    } );

    Multilink.multilink( [ focusedCardNodeProperty, model.groupSortInteractionModel.isGroupItemKeyboardGrabbedProperty ],
      ( focusedCardNode, isCardGrabbed ) => {
        if ( focusedCardNode ) {

          focusedCardNode.model.isDraggingProperty.value = isCardGrabbed;

          const focusHighlightOffset = 20; // empirically determined to preset below the of the card
          keyboardSortCueNode.centerBottom = new Vector2( focusedCardNode.centerX + CARD_LAYER_OFFSET + PICK_UP_DELTA_X / 2 + 1,
            focusedCardNode.cardNode.bottom + focusHighlightOffset );
        }
      } );

    model.groupSortInteractionModel.isGroupItemKeyboardGrabbedProperty.link( isCardGrabbed => {
      if ( isCardGrabbed ) {
        this.wasSortedBefore = model.isDataSorted();
      }
      else {

        // celebrate after the card was dropped and gets to its home
        this.celebrationNode.isReadyForCelebration = this.model.isDataSorted() && !this.wasSortedBefore;

        if ( this.celebrationNode.isReadyForCelebration ) {
          this.celebrationNode.celebrate();
          model.manuallySortedEmitter.emit();
        }

        this.wasSortedBefore = this.model.isDataSorted();
      }
    } );

    // Move and swap cards according to the focused card's target index. Used for alternative input.
    const swapCards = ( activeCards: CardNode[], focusedCard: CardNode, delta: number ) => {
      const currentIndex = activeCards.indexOf( focusedCard );
      assert && assert( focusedCard.model.indexProperty.value === currentIndex, 'sanity check' );
      const targetIndex = sortingRangeProperty.value.constrainValue( currentIndex + delta );

      if ( targetIndex !== currentIndex ) {

        // Which way the displacement is going.
        const indexSign = Math.sign( targetIndex - currentIndex );

        // An array of indices affected by the focusedCardNode's movement.
        const displacedIndexes = _.range( currentIndex, targetIndex );
        const displacedCards = displacedIndexes.map( index => {
          return activeCards[ index + indexSign ];
        } );

        focusedCard.model.indexProperty.value = targetIndex;
        displacedCards.forEach( ( card, index ) => {
          card.model.indexProperty.value = displacedIndexes[ index ];
        } );

        model.setAtHomeCell( focusedCard.model );
        animatedPanZoomSingleton.listener.panToNode( focusedCard, true );

        model.cardCellsChangedEmitter.emit();
      }
    };

    const focusHighlightWidthProperty = new DerivedProperty( [ model.numActiveCardsProperty ], numActiveCards => {
      return model.getCardPositionX( numActiveCards === 0 ? 1 : numActiveCards );
    } );

    const marginX = 7;
    focusHighlightWidthProperty.link( focusHighlightWidth => {
      const focusRect = Shape.rect( -marginX, -FOCUS_HIGHLIGHT_Y_MARGIN, focusHighlightWidth + 2 * marginX, CAVConstants.CARD_DIMENSION + 2 * FOCUS_HIGHLIGHT_Y_MARGIN + 9 );
      this.groupSortInteractionView.groupSortGroupFocusHighlightPath.setShape( focusRect );
      const cueNodeWidth = this.groupSortInteractionView.grabReleaseCueNode.width;
      const max = Math.max( this.width - cueNodeWidth / 2, cueNodeWidth );
      this.groupSortInteractionView.grabReleaseCueNode.centerX = clamp( focusRect.bounds.centerX, cueNodeWidth / 2, max );
    } );

    const selectedItemValueProperty = new DynamicProperty<number | string, TReadOnlyProperty<number | string>, TReadOnlyProperty<string | number | null>>( new DerivedProperty( [ model.groupSortInteractionModel.selectedGroupItemProperty ], item => {
      return item ? item.soccerBall.valueProperty : CenterAndVariabilityFluent.a11y.nullStringProperty;
    } ) );
    const indexDependencies = model.cards.map( card => card.indexProperty );
    const selectedItemIndexProperty = DerivedProperty.deriveAny( [ model.groupSortInteractionModel.selectedGroupItemProperty, ...indexDependencies, CenterAndVariabilityFluent.a11y.nullStringProperty ], () => {
      const item = model.groupSortInteractionModel.selectedGroupItemProperty.value;
      return item && item.indexProperty.value !== null ? item.indexProperty.value + 1 : CenterAndVariabilityFluent.a11y.nullStringProperty.value;
    } );
    const selectNamePatternStringProperty = CenterAndVariabilityFluent.a11y.medianScreen.dataCardsGroup.selectAccessibleName.createProperty( {
      value: selectedItemValueProperty,
      index: selectedItemIndexProperty,
      total: sceneModel.numberOfDataPointsProperty
    } );

    const sortNamePatternStringProperty = CenterAndVariabilityFluent.a11y.medianScreen.dataCardsGroup.sortAccessibleName.createProperty( {
      value: selectedItemValueProperty,
      index: selectedItemIndexProperty,
      total: sceneModel.numberOfDataPointsProperty
    } );

    Multilink.multilink( [
        model.groupSortInteractionModel.isGroupItemKeyboardGrabbedProperty,
        sceneModel.numberOfDataPointsProperty,
        model.groupSortInteractionModel.selectedGroupItemProperty
      ],
      ( isGrabbed, numberOfDataPoints ) => {

        if ( numberOfDataPoints === 0 ) {
          this.accessibleName = CenterAndVariabilityFluent.a11y.medianScreen.dataCardsGroup.noCardsAccessibleNameStringProperty;
        }
        else {
          this.accessibleName = isGrabbed ? sortNamePatternStringProperty :
                                selectNamePatternStringProperty;
          this.accessibleHelpText = isGrabbed ? CenterAndVariabilityStrings.a11y.medianScreen.dataCardsGroup.sortAccessibleHelpTextStringProperty :
                                    CenterAndVariabilityStrings.a11y.medianScreen.dataCardsGroup.selectAccessibleHelpTextStringProperty;
        }
      } );
  }

  // The listener which is linked to the cardNode.positionProperty
  private createDragPositionListener( cardNode: CardNode ): ( position: Vector2 ) => void {
    return ( position: Vector2 ) => {
      if ( cardNode.dragListener.isPressedProperty.value ) {

        assert && assert( cardNode.model.indexProperty.value !== null, 'The cardNode\'s indexProperty cannot be null if it is being dragged.' );
        const originalCell = cardNode.model.indexProperty.value!;

        // Find the closest cell to the dragged card
        const dragCell = this.model.getClosestCell( position.x );

        // The drag delta can suggest a match further than a neighboring cell. But we must do pairwise swaps with
        // neighbors only in order to maintain the correct ordering. See https://github.com/phetsims/center-and-variability/issues/78
        const closestCell = dragCell > originalCell ? originalCell + 1 :
                            dragCell < originalCell ? originalCell - 1 :
                            originalCell;

        const closestCardModel = this.model.getCardsInCells().find( card => card.indexProperty.value === closestCell );

        assert && assert( closestCardModel, `closestCardModel is undefined. closestCell: ${closestCell}` );
        const currentOccupant = this.cardMap.get( closestCardModel! )!;

        // No-op if the dragged card is near its home cell
        if ( currentOccupant !== cardNode ) {

          // it's just a pairwise swap
          cardNode.model.indexProperty.value = closestCell;
          currentOccupant.model.indexProperty.value = originalCell;

          // See if the user unsorted the data.  If so, uncheck the "Sort Data" checkbox
          if ( this.isSortingDataProperty.value && !this.model.isDataSorted() ) {
            this.isSortingDataProperty.value = false;
          }

          // celebrate after the card was dropped and gets to its home
          this.celebrationNode.isReadyForCelebration = this.model.isDataSorted() && !this.wasSortedBefore;

          this.model.cardCellsChangedEmitter.emit();
        }
      }
    };
  }
}

centerAndVariability.register( 'InteractiveCardNodeContainer', InteractiveCardNodeContainer );