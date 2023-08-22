// Copyright 2022-2023, University of Colorado Boulder

/**
 * Adds mouse and keyboard input to the CardNodeContainer in the accordion box.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import CardNodeContainer, { CARD_LAYER_OFFSET, CardNodeContainerOptions } from './CardNodeContainer.js';
import centerAndVariability from '../../centerAndVariability.js';
import InteractiveCardContainerModel from '../model/InteractiveCardContainerModel.js';
import Property from '../../../../axon/js/Property.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import InteractiveCueArrowNode from '../../common/view/InteractiveCueArrowNode.js';
import { HighlightFromNode, HighlightPath, Image, KeyboardListener, Node, Path } from '../../../../scenery/js/imports.js';
import dragIndicatorHand_png from '../../../images/dragIndicatorHand_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CAVConstants from '../../common/CAVConstants.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
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

const FOCUS_HIGHLIGHT_Y_MARGIN = CAVConstants.CARD_SPACING + 3;

export default class InteractiveCardNodeContainer extends CardNodeContainer {

  // Whether or not the cards were already sorted when a particular action was taken
  private wasSortedBefore = true;

  // The message that appears when the cards are sorted
  private readonly celebrationNode: CelebrationNode;

  public constructor( model: InteractiveCardContainerModel,
                      private readonly isSortingDataProperty: Property<boolean>,
                      sceneModel: CAVSoccerSceneModel,
                      medianVisibleProperty: Property<boolean>,
                      providedOptions: CardNodeContainerOptions
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

          this.celebrationNode.isReadyForCelebration && this.celebrationNode.celebrate();
        }
      } );

      // Accumulate drag distance
      cardModel.dragDistanceEmitter.addListener( distance => {
        model.totalDragDistanceProperty.value += distance;
      } );
    } );

    const mouseArrowNode = new InteractiveCueArrowNode( {
      doubleHead: false,
      dashWidth: 2,
      dashHeight: 1.8,
      numberOfDashes: 3,
      spacing: 1.5,
      triangleNodeOptions: {
        triangleWidth: 5,
        triangleHeight: 4.7
      }
    } );

    const focusHighlightPath = new HighlightPath( null, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );

    const grabReleaseCueNode = new GrabReleaseCueNode( {
      top: CAVConstants.CARD_DIMENSION + FOCUS_HIGHLIGHT_Y_MARGIN + 4,
      visibleProperty: model.isGrabReleaseVisibleProperty // TODO rename? https://github.com/phetsims/center-and-variability/issues/433
    } );

    const createKeyboardArrowNode = ( visibleProperty: TReadOnlyProperty<boolean> ) => new InteractiveCueArrowNode( {
        doubleHead: true,
        dashWidth: 3.5,
        dashHeight: 2.8,
        numberOfDashes: 2,
        spacing: 2,
        triangleNodeOptions: {
          triangleWidth: 12,
          triangleHeight: 11
        },
        visibleProperty: visibleProperty
      }
    );

    const keyboardDragArrowNode = createKeyboardArrowNode( model.isKeyboardDragArrowVisibleProperty );
    const keyboardSelectArrowNode = createKeyboardArrowNode( model.isKeyboardSelectArrowVisibleProperty );

    this.addChild( keyboardDragArrowNode );
    this.addChild( keyboardSelectArrowNode );

    const isDragIndicatorVisibleProperty = new DerivedProperty( [ this.inputEnabledProperty, model.hasKeyboardFocusProperty ],
      ( inputEnabled, hasKeyboardFocus ) => inputEnabled && !hasKeyboardFocus );

    const handWithArrowNode = new Node( {
      children: [
        mouseArrowNode,
        new Image( dragIndicatorHand_png, { scale: 0.077, centerTop: mouseArrowNode.leftTop.plusXY( -0.5, 0 ) } )
      ],
      opacity: 0,
      pickable: false,
      centerTop: new Vector2( 0.5 * CAVConstants.CARD_DIMENSION, CAVConstants.CARD_DIMENSION - 9 ),
      visibleProperty: isDragIndicatorVisibleProperty
    } );

    this.addChild( handWithArrowNode );

    // Fade in the hand with arrow node
    const fadeInAnimation = new Animation( {
      duration: 0.5,
      targets: [ {
        property: handWithArrowNode.opacityProperty,
        to: 1,
        easing: Easing.QUADRATIC_IN_OUT
      } ]
    } );

    // Fade out the hand with arrow node
    const fadeOutAnimation = new Animation( {
      duration: 0.1,
      targets: [ {
        property: handWithArrowNode.opacityProperty,
        to: 0,
        easing: Easing.QUADRATIC_IN_OUT
      } ]
    } );

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

      if ( oldCard && !newCard ) {
        fadeInAnimation.stop();
        fadeOutAnimation.start();
      }

      else if ( newCard && !oldCard ) {
        fadeOutAnimation.stop();
        fadeInAnimation.start();
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
            cardPickUpSoundClip.play();
            this.celebrationNode.animateCelebration1( () => cardDropClip.play(), false );
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
        model.hasKeyboardFocusProperty.value = true;
      },
      blur: () => {
        model.isCardGrabbedProperty.value = false;
        model.hasKeyboardFocusProperty.value = false;
      },
      out: () => {

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
      },
      over: () => {
        model.hasKeyboardFocusProperty.value = false;
      }
    } );

    Multilink.multilink( [ focusedCardNodeProperty, model.isCardGrabbedProperty ], ( focusedCardNode, isCardGrabbed ) => {
        if ( focusedCardNode ) {

          const focusForSelectedCard = new HighlightFromNode( focusedCardNode.cardNode, { dashed: isCardGrabbed } );
          this.setFocusHighlight( focusForSelectedCard );

          focusedCardNode.model.isDraggingProperty.value = isCardGrabbed;

          keyboardDragArrowNode.centerBottom = new Vector2( focusedCardNode.centerX + CARD_LAYER_OFFSET + PICK_UP_DELTA_X / 2 + 1, focusForSelectedCard.bottom + 6 );
          keyboardSelectArrowNode.centerBottom = new Vector2( focusedCardNode.centerX + CARD_LAYER_OFFSET - PICK_UP_DELTA_X / 2, focusForSelectedCard.bottom + 10 );
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

        this.celebrationNode.isReadyForCelebration && this.celebrationNode.celebrate();
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

    const keyboardListener = new KeyboardListener( {
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
              model.hasSelectedDifferentCardProperty.value = true;
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
            model.hasGrabbedCardProperty.value = true;

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
      const focusRect = Shape.rect( -marginX, -FOCUS_HIGHLIGHT_Y_MARGIN, focusHighlightWidth + 2 * marginX, CAVConstants.CARD_DIMENSION + 2 * FOCUS_HIGHLIGHT_Y_MARGIN );
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