// Copyright 2023, University of Colorado Boulder

/**
 * Adds mouse and keyboard input to the CardNodeContainer in the accordion box.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import CardNodeContainer, { CardNodeContainerOptions } from './CardNodeContainer.js';
import centerAndVariability from '../../centerAndVariability.js';
import InteractiveCardContainerModel from '../model/InteractiveCardContainerModel.js';
import Property from '../../../../axon/js/Property.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import DragIndicatorArrowNode from '../../common/view/DragIndicatorArrowNode.js';
import { FocusHighlightFromNode, FocusHighlightPath, Image, KeyboardListener, LinearGradient, Node, Path, Text } from '../../../../scenery/js/imports.js';
import dragIndicatorHand_png from '../../../images/dragIndicatorHand_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CAVConstants from '../../common/CAVConstants.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CardNode, { cardDropClip, cardPickUpSoundClip } from './CardNode.js';
import Utils from '../../../../dot/js/Utils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Panel from '../../../../sun/js/Panel.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Multilink from '../../../../axon/js/Multilink.js';
import AsyncCounter from '../../common/model/AsyncCounter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import sortCelebration_mp3 from '../../../sounds/sortCelebration_mp3.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import GrabReleaseCueNode from '../../../../scenery-phet/js/accessibility/nodes/GrabReleaseCueNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const successSoundClip = new SoundClip( sortCelebration_mp3, {
  initialOutputLevel: 0.3
} );
soundManager.addSoundGenerator( successSoundClip );

const FOCUS_HIGHLIGHT_Y_MARGIN = CAVConstants.CARD_SPACING + 3;

export default class InteractiveCardNodeContainer extends CardNodeContainer {

  private isReadyForCelebration = false;
  private remainingCelebrationAnimations: ( () => void )[] = [];
  private dataSortedNodeAnimation: Animation | null = null;
  private wasSortedBefore = true;

  private readonly dataSortedNode: Panel;

  public constructor( model: InteractiveCardContainerModel,
                      private readonly isSortingDataProperty: Property<boolean>,
                      sceneModel: CAVSoccerSceneModel,
                      medianVisibleProperty: Property<boolean>,
                      providedOptions: CardNodeContainerOptions
  ) {
    super( model, sceneModel, medianVisibleProperty, providedOptions );

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

          this.isReadyForCelebration && this.celebrate();
        }
      } );

      // Accumulate drag distance
      cardModel.dragDistanceEmitter.addListener( distance => {
        model.totalDragDistanceProperty.value += distance;
      } );
    } );

    const arrowNode = new DragIndicatorArrowNode( {
      doubleHead: false,
      dashWidth: 1.2,
      dashHeight: 1.1,
      numberOfDashes: 3,
      spacing: 1.1,
      triangleNodeOptions: {
        triangleWidth: 3.9,
        triangleHeight: 3.5
      }
    } );

    const isDragIndicatorVisibleProperty = new DerivedProperty( [ this.inputEnabledProperty, model.isGrabReleaseCueVisibleProperty ],
      ( inputEnabled, isGrabReleaseVisible ) => inputEnabled && !isGrabReleaseVisible );

    const handWithArrowNode = new Node( {
      children: [
        arrowNode,
        new Image( dragIndicatorHand_png, { scale: 0.077, centerTop: arrowNode.leftTop.plusXY( -0.5, 0 ) } )
      ],
      opacity: 0,
      pickable: false,
      centerTop: new Vector2( 0.5 * CAVConstants.CARD_DIMENSION, CAVConstants.CARD_DIMENSION - 8 ),
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
        oldCardNode.mouseArea = oldCardNode.localBounds;
        oldCardNode.touchArea = oldCardNode.localBounds;
      }

      if ( newCard ) {
        const newCardNode = this.cardMap.get( newCard )!;

        // Expand the card's touch + mouse area to cover the hand. Much simpler than adding a DragListener.createForwardingListener
        const newArea = new Bounds2( newCardNode.localBounds.minX, newCardNode.localBounds.minY, newCardNode.localBounds.maxX, newCardNode.localBounds.maxY + 30 );
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
            this.animateCelebration1( () => cardDropClip.play(), false );
          }
        }
      }
    } );

    const dataSortedTextNode = new Text( CenterAndVariabilityStrings.youSortedTheDataStringProperty, {
      font: new PhetFont( 15 ),
      maxWidth: CAVConstants.CARD_DIMENSION * 10
    } );
    this.dataSortedNode = new Panel( dataSortedTextNode, {
      stroke: null,
      cornerRadius: 4,
      lineWidth: 2,
      visible: false
    } );

    // create a rotated linear gradient
    const gradientMargin = 20;
    const startPoint = new Vector2( this.dataSortedNode.left + gradientMargin, this.dataSortedNode.top + gradientMargin );
    const endPoint = new Vector2( this.dataSortedNode.right - gradientMargin, this.dataSortedNode.bottom - gradientMargin );
    const gradient = new LinearGradient( startPoint.x, startPoint.y, endPoint.x, endPoint.y );
    gradient.addColorStop( 0, '#fa9696' );
    gradient.addColorStop( 0.2, '#ffa659' );
    gradient.addColorStop( 0.4, '#ebd75e' );
    gradient.addColorStop( 0.6, '#8ce685' );
    gradient.addColorStop( 0.8, '#7fd7f0' );
    gradient.addColorStop( 1, '#927feb' );
    gradient.setTransformMatrix( Matrix3.rotationAroundPoint( Math.PI / 4 * 1.2, this.dataSortedNode.center ) );
    this.dataSortedNode.stroke = gradient;

    this.addChild( this.dataSortedNode );

    this.sceneModel.resetEmitter.addListener( () => {
      this.dataSortedNode.visible = false;
      if ( this.dataSortedNodeAnimation ) {
        this.dataSortedNodeAnimation.stop();
        this.dataSortedNodeAnimation = null;
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
      if ( model.focusedCardProperty.value === null && this.focused && this.cardNodes[ 0 ].model.isActiveProperty.value ) {
        model.focusedCardProperty.value = activeCardNodes[ 0 ].model;
      }
    } );

    this.addInputListener( {
      focus: () => {
        const activeCardNodes = this.getActiveCardNodesInOrder();
        if ( model.focusedCardProperty.value === null && activeCardNodes.length > 0 ) {
          model.focusedCardProperty.value = activeCardNodes[ 0 ].model;
        }
      },
      blur: () => {
        model.isCardGrabbedProperty.value = false;
      },
      focusout: () => {
        model.focusedCardProperty.value = null;
      }
    } );

    const hitRect = new Path( null, { fill: '#aaaa00', opacity: 0 } );
    this.addChild( hitRect );
    hitRect.moveToBack();

    Multilink.multilink( [ focusedCardNodeProperty, model.isCardGrabbedProperty ], ( focusedCardNode, isCardGrabbed ) => {
        if ( focusedCardNode ) {

          const focusForSelectedCard = new FocusHighlightFromNode( focusedCardNode.cardNode, { dashed: isCardGrabbed } );
          this.setFocusHighlight( focusForSelectedCard );

          focusedCardNode.model.isDraggingProperty.value = isCardGrabbed;
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
        this.isReadyForCelebration = this.model.isDataSorted() && !this.wasSortedBefore;

        this.isReadyForCelebration && this.celebrate();
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
      callback: ( event, listener ) => {

        const keysPressed = listener.keysPressed;

        // Select a card
        const focusedCardNode = focusedCardNodeProperty.value;
        const activeCardNodes = this.getActiveCardNodesInOrder();
        const numberOfActiveCards = activeCardNodes.length;

        if ( focusedCardNode ) {
          if ( ( keysPressed === 'arrowRight' || keysPressed === 'arrowLeft' ) ) {

            // Arrow keys will shift the card focus when a card is not grabbed.
            if ( !model.isCardGrabbedProperty.value ) {
              const delta = listener.keysPressed === 'arrowRight' ? 1 : -1;

              // We are deciding not to wrap the value around the ends of the range because the sort order is important and does not wrap
              const currentIndex = activeCardNodes.indexOf( focusedCardNode );
              const nextIndex = Utils.clamp( currentIndex + delta, 0, numberOfActiveCards - 1 );
              model.focusedCardProperty.value = activeCardNodes[ nextIndex ].model;
            }

            // Arrow keys will move the card when it is grabbed.
            else {
              const delta = listener.keysPressed === 'arrowLeft' ? -1 : 1;
              swapCards( activeCardNodes, focusedCardNode, delta );
            }
          }
          else if ( keysPressed === 'pageUp' || keysPressed === 'pageDown' ) {
            if ( model.isCardGrabbedProperty.value ) {
              const delta = listener.keysPressed === 'pageUp' ? 3 : -3;
              swapCards( activeCardNodes, focusedCardNode, delta );
            }
          }
          else if ( keysPressed === 'home' || keysPressed === 'end' ) {
            if ( model.isCardGrabbedProperty.value ) {
              const delta = listener.keysPressed === 'end' ? numberOfActiveCards : -numberOfActiveCards;
              swapCards( activeCardNodes, focusedCardNode, delta );
            }
          }
          else if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            model.isCardGrabbedProperty.value = !model.isCardGrabbedProperty.value;
            model.hasGrabbedCardProperty.value = true;

            if ( !model.isCardGrabbedProperty.value ) {

              // See if the user unsorted the data.  If so, uncheck the "Sort Data" checkbox
              if ( this.isSortingDataProperty.value && !this.model.isDataSorted() ) {
                this.isSortingDataProperty.value = false;
              }
            }
          }
          else if ( model.isCardGrabbedProperty.value ) {
            if ( keysPressed === 'escape' ) {
              model.isCardGrabbedProperty.value = false;
            }
          }
        }
      }
    } );

    const focusHighlightWidthProperty = new DerivedProperty( [ model.numActiveCardsProperty ], numActiveCards => {
      return model.getCardPositionX( numActiveCards === 0 ? 1 : numActiveCards + 1 );
    } );

    const focusHighlightFromNode = new FocusHighlightPath( null, {
      outerStroke: FocusHighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: FocusHighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: FocusHighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: FocusHighlightPath.GROUP_INNER_LINE_WIDTH
    } );

    focusHighlightWidthProperty.link( focusHighlightWidth => {
      const marginX = 7;
      const focusRect = Shape.rect( -marginX, -FOCUS_HIGHLIGHT_Y_MARGIN, focusHighlightWidth + 2 * marginX, CAVConstants.CARD_DIMENSION + 2 * FOCUS_HIGHLIGHT_Y_MARGIN );
      focusHighlightFromNode.setShape( focusRect );
      hitRect.setShape( focusRect );
    } );

    this.setGroupFocusHighlight( focusHighlightFromNode );
    this.addInputListener( keyboardListener );

    const grabReleaseCueNode = new GrabReleaseCueNode( {
      visibleProperty: model.isGrabReleaseCueVisibleProperty,
      top: CAVConstants.CARD_DIMENSION + FOCUS_HIGHLIGHT_Y_MARGIN
    } );

    this.addChild( grabReleaseCueNode );
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
          this.isReadyForCelebration = this.model.isDataSorted() && !this.wasSortedBefore;

          this.model.cardCellsChangedEmitter.emit();
        }
      }
    };
  }

  private celebrate(): void {
    const cardCells = this.model.getCardsInCellOrder();
    const inProgressAnimations = cardCells.filter( card => card.animation ).map( card => card.animation! );

    // Setup a callback for animation when all current animations finish
    const asyncCounter = new AsyncCounter( inProgressAnimations.length, () => {

      const leftmostCard = this.cardMap.get( cardCells[ 0 ] )!;
      assert && assert( leftmostCard, 'leftmostCard should be defined' );

      this.dataSortedNode.centerX = this.model.getCardPositionX( ( cardCells.length - 1 ) / 2 ) + CAVConstants.CARD_DIMENSION / 2;
      this.dataSortedNode.top = leftmostCard.bottom + 7;

      if ( this.dataSortedNode.left < 0 ) {
        this.dataSortedNode.left = 0;
      }
      this.dataSortedNode.opacity = 1;
      this.dataSortedNode.visible = true;

      // If the user sorted the data again before the data sorted message was hidden, clear out the timer.
      if ( this.dataSortedNodeAnimation ) {
        this.dataSortedNodeAnimation.stop();
      }

      // start a timer to hide the data sorted node
      this.dataSortedNodeAnimation = new Animation( {
        duration: 0.6,
        delay: 2,
        targets: [ {
          property: this.dataSortedNode.opacityProperty,
          to: 0,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );
      this.dataSortedNodeAnimation.finishEmitter.addListener( () => {
        this.dataSortedNode.visible = false;
        this.dataSortedNodeAnimation = null;
      } );
      this.dataSortedNodeAnimation.start();

      successSoundClip.play();

      const cardBeingDragged = this.cardNodes.filter( cardNode => cardNode.dragListener.isPressed ).length;
      const cardsAnimating = cardCells.filter( card => card.animation ).length;
      if ( cardBeingDragged === 0 && cardsAnimating === 0 ) {
        this.pickable = false;

        this.animateRandomCelebration( () => {

          this.isReadyForCelebration = false;
          this.pickable = true;
          this.interruptSubtreeInput();
        } );
      }
    } );

    // Notify the asyncCounter when any in-progress animation finishes
    inProgressAnimations.forEach( animation => {
      animation.endedEmitter.addListener( () => asyncCounter.increment() );
    } );
  }


  private animateRandomCelebration( callback: () => void ): void {
    if ( this.remainingCelebrationAnimations.length === 0 ) {
      const animations = [
        () => this.animateCelebration1( callback, true ),
        () => this.animateCelebration2( callback ),
        () => this.animateCelebration3( callback )
      ];

      this.remainingCelebrationAnimations.push( ...animations );
    }

    const animation = dotRandom.sample( this.remainingCelebrationAnimations );
    arrayRemove( this.remainingCelebrationAnimations, animation );
    animation();
  }

  /**
   * The cards grow and then shrink back to normal size.
   */
  private animateCelebration1( callback: () => void, animateFromCenter: boolean ): void {
    const cardCells = this.model.getCardsInCellOrder();
    const asyncCounter = new AsyncCounter( cardCells.length, callback );

    cardCells.forEach( card => {
      const cardNode = this.cardMap.get( card )!;

      const scaleProperty = new NumberProperty( 1 );
      scaleProperty.lazyLink( scale => {
        const center = cardNode.center.copy();
        cardNode.setScaleMagnitude( scale );
        if ( animateFromCenter ) {
          cardNode.center = center;
        }
      } );

      const scaleUpAnimation = new Animation( {
        duration: animateFromCenter ? 0.2 : 0.15,
        targets: [ {
          property: scaleProperty,
          to: animateFromCenter ? 1.2 : 1.15,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      const scaleDownAnimation = new Animation( {
        duration: animateFromCenter ? 0.2 : 0.15,
        targets: [ {
          property: scaleProperty,
          to: 1,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );
      scaleDownAnimation.endedEmitter.addListener( () => asyncCounter.increment() );
      scaleUpAnimation.then( scaleDownAnimation );
      scaleUpAnimation.start();
    } );
  }

  /**
   * The cards do one clockwise rotation.
   */
  private animateCelebration2( callback: () => void ): void {
    const cardCells = this.model.getCardsInCellOrder();
    const asyncCounter = new AsyncCounter( cardCells.length, callback );

    cardCells.forEach( card => {
      const cardNode = this.cardMap.get( card )!;

      const center = cardNode.center.copy();

      const rotationProperty = new NumberProperty( 0 );
      rotationProperty.link( rotation => cardNode.setRotation( rotation ) );

      const animation = new Animation( {
        duration: 0.6,
        targets: [ {
          property: rotationProperty,
          to: 2 * Math.PI,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );
      const updatePosition = () => {
        cardNode.center = center;
      };
      animation.updateEmitter.addListener( updatePosition );
      animation.endedEmitter.addListener( () => asyncCounter.increment() );
      animation.start();
    } );
  }

  /**
   * The cards do the "wave" from left to right.
   */
  private animateCelebration3( callback: () => void ): void {
    const cardCells = this.model.getCardsInCellOrder();
    const asyncCounter = new AsyncCounter( cardCells.length, callback );

    cardCells.forEach( ( card, index ) => {
      const cardNode = this.cardMap.get( card )!;

      const initialPositionY = cardNode.y;
      const jumpHeight = 30;
      const positionYProperty = new NumberProperty( initialPositionY );
      positionYProperty.link( positionY => { cardNode.y = positionY; } );

      const goUpAnimation = new Animation( {
        duration: 0.2,
        targets: [ {
          property: positionYProperty,
          to: initialPositionY - jumpHeight,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      goUpAnimation.endedEmitter.addListener( () => {
        const goDownAnimation = new Animation( {
          duration: 0.2,
          targets: [ {
            property: positionYProperty,
            to: initialPositionY,
            easing: Easing.QUADRATIC_IN_OUT
          } ]
        } );
        goDownAnimation.endedEmitter.addListener( () => asyncCounter.increment() );
        goDownAnimation.start();
      } );

      // offset starting the animation for each card
      stepTimer.setTimeout( () => {
        goUpAnimation.start();
      }, index * 60 );
    } );
  }
}

centerAndVariability.register( 'InteractiveCardNodeContainer', InteractiveCardNodeContainer );