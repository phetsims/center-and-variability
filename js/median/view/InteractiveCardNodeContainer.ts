// Copyright 2022-2023, University of Colorado Boulder

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

import CardNodeContainer, { CARD_LAYER_OFFSET, CardNodeContainerOptions } from './CardNodeContainer.js';
import centerAndVariability from '../../centerAndVariability.js';
import InteractiveCardContainerModel from '../model/InteractiveCardContainerModel.js';
import Property from '../../../../axon/js/Property.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import { animatedPanZoomSingleton, HighlightFromNode, HighlightPath, KeyboardListener, NodeTranslationOptions, Path } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CAVConstants from '../../common/CAVConstants.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CardNode, { cardDropClip, cardPickUpSoundClip, PICK_UP_DELTA_X } from './CardNode.js';
import Utils from '../../../../dot/js/Utils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import GrabReleaseCueNode from '../../../../scenery-phet/js/accessibility/nodes/GrabReleaseCueNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CelebrationNode from './CelebrationNode.js';
import SoccerCommonConstants from '../../../../soccer-common/js/SoccerCommonConstants.js';
import checkboxCheckedSoundPlayer from '../../../../tambo/js/shared-sound-players/checkboxCheckedSoundPlayer.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CardDragIndicatorNode from './CardDragIndicatorNode.js';

const FOCUS_HIGHLIGHT_Y_MARGIN = CAVConstants.CARD_SPACING + 3;

type SelfOptions = EmptySelfOptions;

type InteractiveCardNodeContainerOptions = SelfOptions & NodeTranslationOptions & PickRequired<CardNodeContainerOptions, 'tandem'>;

export default class InteractiveCardNodeContainer extends CardNodeContainer {

  // Whether the cards were already sorted when a particular action was taken
  private wasSortedBefore = true;

  // The message that appears when the cards are sorted
  private readonly celebrationNode: CelebrationNode;

  public constructor( model: InteractiveCardContainerModel,
                      private readonly isSortingDataProperty: Property<boolean>,
                      sceneModel: CAVSoccerSceneModel,
                      medianVisibleProperty: Property<boolean>,
                      providedOptions: InteractiveCardNodeContainerOptions
  ) {

    super( model, sceneModel, medianVisibleProperty, providedOptions );

    this.celebrationNode = new CelebrationNode( model, this.cardMap, this.sceneModel.resetEmitter );
    this.addChild( this.celebrationNode );

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

      // Accumulate drag distance
      cardModel.dragDistanceEmitter.addListener( distance => {
        model.totalDragDistanceProperty.value += distance;
      } );
    } );

    const focusHighlightPath = new HighlightPath( null, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );

    const grabReleaseCueNode = new GrabReleaseCueNode( {
      top: CAVConstants.CARD_DIMENSION + FOCUS_HIGHLIGHT_Y_MARGIN + 15,
      visibleProperty: model.isGrabReleaseCueVisibleProperty
    } );

    const keyboardDragArrowNode = SoccerCommonConstants.CREATE_KEYBOARD_ARROW_NODE( model.isKeyboardDragArrowVisibleProperty );

    this.addChild( keyboardDragArrowNode );

    const cardDragIndicatorNode = new CardDragIndicatorNode( {
      centerTop: new Vector2( 0.5 * CAVConstants.CARD_DIMENSION - PICK_UP_DELTA_X, CAVConstants.CARD_DIMENSION - 9 ),
      visibleProperty: new DerivedProperty(
        [ this.inputEnabledProperty, model.isKeyboardFocusedProperty, model.dragIndicationCardProperty ],
        ( inputEnabled, hasKeyboardFocus, dragIndicationCard ) => inputEnabled && !hasKeyboardFocus && !!dragIndicationCard )
    } );

    this.addChild( cardDragIndicatorNode );

    model.dragIndicationCardProperty.lazyLink( ( newCard, oldCard ) => {

      if ( oldCard ) {
        const oldCardNode = this.cardMap.get( oldCard )!;
        oldCardNode.restorePointerAreas();
      }

      if ( newCard ) {
        const newCardNode = this.cardMap.get( newCard )!;

        const bounds = newCardNode.getLocalPointerAreaShape();

        // Expand the card's touch + mouse area to cover the hand. Much simpler than adding a DragListener.createForwardingListener
        const newArea = new Bounds2( bounds.minX, bounds.minY, bounds.maxX, bounds.maxY + 30 );
        newCardNode.mouseArea = newArea;
        newCardNode.touchArea = newArea;
      }
    } );

    this.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {

        if ( !model.isDataSorted() ) {

          // Will play sound effects in step()
          model.sortData();
        }
        else {

          if ( model.parentContext === 'accordion' ) {
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

    const focusedCardNodeProperty: TReadOnlyProperty<CardNode | null> = new DerivedProperty( [ model.focusedCardProperty ], focusedCard => {
      return focusedCard === null ? focusedCard : this.cardMap.get( focusedCard )!;
    } );

    // Update focused card when cards are created.
    model.cardCellsChangedEmitter.addListener( () => {

      const activeCardNodes = this.getActiveCardNodesInOrder();

      // When a user is focused on the card container but there are no cards yet, we want to ensure that a card gets focused
      // once there is a card.
      if ( model.focusedCardProperty.value === null && this.focused && model.getActiveCards().length === 1 ) {
        model.focusedCardProperty.value = activeCardNodes[ 0 ].model;
      }
    } );

    this.addInputListener( {
      focus: () => {
        const activeCardNodes = this.getActiveCardNodesInOrder();
        if ( model.focusedCardProperty.value === null && activeCardNodes.length > 0 ) {
          model.focusedCardProperty.value = activeCardNodes[ 0 ].model;
        }

        // When the group receives keyboard focus, make sure that the focused ball is displayed
        if ( focusedCardNodeProperty.value ) {
          animatedPanZoomSingleton.listener.panToNode( focusedCardNodeProperty.value, false );
        }
        model.isKeyboardFocusedProperty.value = true;
      },
      blur: () => {
        model.isCardGrabbedProperty.value = false;
        model.isKeyboardFocusedProperty.value = false;
      },
      out: () => {
        if ( !animatedPanZoomSingleton.listener.animatingProperty.value ) {
          if ( model.focusedCardProperty.value !== null ) {

            // Before clearing out the focusedCardProperty the CardModel must be cleared out of it's
            // dragging state.
            model.focusedCardProperty.value.isDraggingProperty.set( false );

            // Clear the 'focused' card so that there isn't a flicker to a highlight around that card when
            // moving between the CardNode interactive highlight and the container group highlight (which has
            // a custom highlight around the focused card).
            model.focusedCardProperty.set( null );
          }

          model.isCardGrabbedProperty.value = false;
        }
      },
      over: () => {
        if ( !animatedPanZoomSingleton.listener.animatingProperty.value ) {
          model.isKeyboardFocusedProperty.value = false;
        }
      }
    } );

    Multilink.multilink( [ focusedCardNodeProperty, model.isCardGrabbedProperty ], ( focusedCardNode, isCardGrabbed ) => {
        if ( focusedCardNode ) {

          const focusForSelectedCard = new HighlightFromNode( focusedCardNode.cardNode, { dashed: isCardGrabbed } );
          this.setFocusHighlight( focusForSelectedCard );

          focusedCardNode.model.isDraggingProperty.value = isCardGrabbed;

          keyboardDragArrowNode.centerBottom = new Vector2( focusedCardNode.centerX + CARD_LAYER_OFFSET + PICK_UP_DELTA_X / 2 + 1, focusForSelectedCard.bottom + 11 );
        }
        else {
          this.setFocusHighlight( 'invisible' );
        }
      }
    );

    model.isCardGrabbedProperty.link( isCardGrabbed => {
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
      const targetIndex = Utils.clamp( currentIndex + delta, 0, activeCards.length - 1 );

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
          model.animateToHomeCell( card.model, 0.3 );
        } );
        model.animateToHomeCell( focusedCard.model, 0.3 );

        model.cardCellsChangedEmitter.emit();

        // Gets rid of the hand icon
        model.hasKeyboardMovedCardProperty.value = true;
      }
    };

    // A single 'panListener' so that we can keep an easy reference to it to remove it when necessary.
    // When using keyboard input, make sure that the "focused" card is still displayed by panning to keep it
    // in view.
    const panListener = () => {

      // remove this listener, it will only be called once
      if ( model.focusedCardProperty.value && model.focusedCardProperty.value.animation ) {
        model.focusedCardProperty.value.animation.endedEmitter.removeListener( panListener );
      }

      if ( focusedCardNodeProperty.value ) {
        animatedPanZoomSingleton.listener.panToNode( focusedCardNodeProperty.value );
      }
    };

    const keyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'arrowRight', 'arrowLeft', 'enter', 'space', 'home', 'end', 'escape', 'pageUp', 'pageDown' ],
      callback: ( event, keysPressed ) => {

        const focusedCardNode = focusedCardNodeProperty.value;
        const activeCardNodes = this.getActiveCardNodesInOrder();
        const numberOfActiveCards = activeCardNodes.length;
        const isCardGrabbed = model.isCardGrabbedProperty.value;

        if ( focusedCardNode ) {

          if ( [ 'arrowRight', 'arrowLeft' ].includes( keysPressed ) ) {
            const delta = keysPressed === 'arrowRight' ? 1 : -1;
            if ( isCardGrabbed ) {
              swapCards( activeCardNodes, focusedCardNode, delta );
            }
            else {

              // Arrow keys will shift the card focus when a card is not grabbed.
              const currentIndex = activeCardNodes.indexOf( focusedCardNode );
              const nextIndex = Utils.clamp( currentIndex + delta, 0, numberOfActiveCards - 1 );
              model.focusedCardProperty.value = activeCardNodes[ nextIndex ].model;
              model.hasKeyboardSelectedDifferentCardProperty.value = true;
            }
          }
          else if ( [ 'pageUp', 'pageDown' ].includes( keysPressed ) && isCardGrabbed ) {
            const delta = keysPressed === 'pageUp' ? 3 : -3;
            swapCards( activeCardNodes, focusedCardNode, delta );
          }
          else if ( [ 'home', 'end' ].includes( keysPressed ) && isCardGrabbed ) {
            const delta = keysPressed === 'end' ? numberOfActiveCards : -numberOfActiveCards;
            swapCards( activeCardNodes, focusedCardNode, delta );
          }
          else if ( [ 'enter', 'space' ].includes( keysPressed ) ) {
            model.isCardGrabbedProperty.value = !model.isCardGrabbedProperty.value;
            model.hasKeyboardGrabbedCardProperty.value = true;

            // See if the user unsorted the data.  If so, uncheck the "Sort Data" checkbox
            if ( !model.isCardGrabbedProperty.value && this.isSortingDataProperty.value && !this.model.isDataSorted() ) {
              this.isSortingDataProperty.value = false;
            }
          }
          else if ( keysPressed === 'escape' && isCardGrabbed ) {
            model.isCardGrabbedProperty.value = false;
          }
          else {

            // We cleared the 'focused' card because we were using mouse input - start over with
            // keyboard interaction and focus the first card.
            this.cardNodes.forEach( cardNode => {
              cardNode.model.isDraggingProperty.value = false;
            } );
            model.isCardGrabbedProperty.value = false;

            model.focusedCardProperty.value = this.model.getCardsInCellOrder()[ 0 ];
          }

          assert && assert( model.focusedCardProperty.value, 'Can we assume this exists?' );
          const focusedCard = model.focusedCardProperty.value!;

          if ( focusedCard.animation ) {
            if ( focusedCard.animation.endedEmitter.hasListener( panListener ) ) {
              focusedCard.animation.endedEmitter.removeListener( panListener );
            }
            focusedCard.animation.endedEmitter.addListener( panListener );
          }
        }
      }
    } );
    const focusHighlightWidthProperty = new DerivedProperty( [ model.numActiveCardsProperty ], numActiveCards => {
      return model.getCardPositionX( numActiveCards === 0 ? 1 : numActiveCards + 1 );
    } );

    focusHighlightPath.addChild( grabReleaseCueNode );

    const highlightRectangle = new Path( null );
    this.addChild( highlightRectangle );
    highlightRectangle.moveToBack();

    focusHighlightWidthProperty.link( focusHighlightWidth => {
      const marginX = 7;
      const focusRect = Shape.rect( -marginX, -FOCUS_HIGHLIGHT_Y_MARGIN, focusHighlightWidth + 2 * marginX, CAVConstants.CARD_DIMENSION + 2 * FOCUS_HIGHLIGHT_Y_MARGIN + 12 );
      focusHighlightPath.setShape( focusRect );
      highlightRectangle.setShape( focusRect );
      const cueNodeWidth = grabReleaseCueNode.width;
      grabReleaseCueNode.centerX = Utils.clamp( focusRect.bounds.centerX, cueNodeWidth / 2, this.width - cueNodeWidth / 2 );
    } );

    this.setGroupFocusHighlight( focusHighlightPath );
    this.addInputListener( keyboardListener );
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

          this.model.animateToHomeCell( currentOccupant.model, 0.3 );

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