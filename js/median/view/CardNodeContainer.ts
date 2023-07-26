// Copyright 2022-2023, University of Colorado Boulder

/**
 * Manages creation, dragging, positioning of CardNode instances.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { FocusHighlightFromNode, FocusHighlightPath, Image, KeyboardListener, LinearGradient, Node, NodeOptions, SceneryConstants, Text } from '../../../../scenery/js/imports.js';
import CardNode, { cardDropSoundClip, cardPickUpSoundClip, PICK_UP_DELTA_X, PICK_UP_DELTA_Y } from './CardNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Panel from '../../../../sun/js/Panel.js';
import CAVConstants from '../../common/CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Easing from '../../../../twixt/js/Easing.js';
import Animation from '../../../../twixt/js/Animation.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import AsyncCounter from '../../common/model/AsyncCounter.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import handWithArrow_png from '../../../images/handWithArrow_png.js';
import cvSuccessOptions002_mp3 from '../../../sounds/cvSuccessOptions002_mp3.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import CardContainerModel from '../model/CardContainerModel.js';
import CardModel from '../model/CardModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';

const successSoundClip = new SoundClip( cvSuccessOptions002_mp3, {
  initialOutputLevel: 0.2
} );
soundManager.addSoundGenerator( successSoundClip );

export type CardNodeContainerOptions = EmptySelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class CardNodeContainer extends Node {
  private readonly model: CardContainerModel;
  public readonly cardNodes: CardNode[];
  private readonly cardMap = new Map<CardModel, CardNode>();
  private readonly medianBarNode = new MedianBarNode( {
    barStyle: 'split'
  } );

  // Add padding to the card layer to give space for the medianBarNode
  private readonly cardLayer = new Node( { x: CAVConstants.CARD_SPACING / 2 - MedianBarNode.HALF_SPLIT_WIDTH + MedianBarNode.LINE_WIDTH } );
  private isReadyForCelebration = false;
  private remainingCelebrationAnimations: ( () => void )[] = [];
  private dataSortedNodeAnimation: Animation | null = null;
  private wasSortedBefore = true;

  public constructor( model: CardContainerModel,
                      private readonly isSortingDataProperty: Property<boolean>,
                      private readonly sceneModel: CAVSoccerSceneModel,
                      private readonly isTopMedianVisibleProperty: Property<boolean>,
                      providedOptions: CardNodeContainerOptions ) {

    const options = optionize<CardNodeContainerOptions, EmptySelfOptions, NodeOptions>()( {
      phetioEnabledPropertyInstrumented: true,
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,
      focusable: true,
      tagName: 'div'
    }, providedOptions );

    super( options );

    this.model = model;

    // Allocate all the cards at start-up. Each card node must be associated with a card model.
    this.cardNodes = model.cards.map( ( cardModel, index ) => {

      // Synthetic property for use in keyboard input
      // const indexProperty = new NumberProperty( 0 );

      const cardNode = new CardNode( this, cardModel, {
        tandem: options.tandem.createTandem( 'cardNodes' ).createTandem1Indexed( 'cardNode', index )
      } );

      this.cardMap.set( cardNode.model, cardNode );

      this.cardLayer.addChild( cardNode );

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

          if ( this.isReadyForCelebration ) {
            const cardCells = model.getCardsInCellOrder();
            const inProgressAnimations = cardCells.filter( card => card.animation ).map( card => card.animation! );

            // Setup a callback for animation when all current animations finish
            const asyncCounter = new AsyncCounter( inProgressAnimations.length, () => {

              const leftmostCard = this.cardMap.get( cardCells[ 0 ] )!;
              assert && assert( leftmostCard, 'leftmostCard should be defined' );

              dataSortedNode.centerX = model.getCardPositionX( ( cardCells.length - 1 ) / 2 ) + CAVConstants.CARD_DIMENSION / 2;
              dataSortedNode.top = leftmostCard.bottom + 7;

              if ( dataSortedNode.left < 0 ) {
                dataSortedNode.left = 0;
              }
              dataSortedNode.opacity = 1;
              dataSortedNode.visible = true;

              // If the user sorted the data again before the data sorted message was hidden, clear out the timer.
              if ( this.dataSortedNodeAnimation ) {
                this.dataSortedNodeAnimation.stop();
              }

              // start a timer to hide the data sorted node
              this.dataSortedNodeAnimation = new Animation( {
                duration: 0.6,
                delay: 2,
                targets: [ {
                  property: dataSortedNode.opacityProperty,
                  to: 0,
                  easing: Easing.QUADRATIC_IN_OUT
                } ]
              } );
              this.dataSortedNodeAnimation.finishEmitter.addListener( () => {
                dataSortedNode.visible = false;
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
                } );
              }
            } );

            // Notify the asyncCounter when any in-progress animation finishes
            inProgressAnimations.forEach( animation => {
              animation.endedEmitter.addListener( () => asyncCounter.increment() );
            } );
          }
        }
      } );

      // Accumulate drag distance
      cardModel.dragDistanceEmitter.addListener( distance => {
        model.totalDragDistanceProperty.value += distance;
      } );

      return cardNode;
    } );

    this.addChild( this.medianBarNode );

    this.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {

        if ( !model.isDataSorted() ) {

          // Will play sound effects in step()
          model.sortData();
        }
        else {

          if ( model.parentContext === 'accordion' ) {
            cardPickUpSoundClip.play();
            this.animateCelebration1( () => cardDropSoundClip.play(), false );
          }
        }
      }
    } );

    const dataSortedTextNode = new Text( CenterAndVariabilityStrings.youSortedTheDataStringProperty, {
      font: new PhetFont( 15 ),
      maxWidth: CAVConstants.CARD_DIMENSION * 10
    } );
    const dataSortedNode = new Panel( dataSortedTextNode, {
      stroke: null,
      cornerRadius: 4,
      lineWidth: 2,
      visible: false
    } );

    // create a rotated linear gradient
    const gradientMargin = 20;
    const startPoint = new Vector2( dataSortedNode.left + gradientMargin, dataSortedNode.top + gradientMargin );
    const endPoint = new Vector2( dataSortedNode.right - gradientMargin, dataSortedNode.bottom - gradientMargin );
    const gradient = new LinearGradient( startPoint.x, startPoint.y, endPoint.x, endPoint.y );
    gradient.addColorStop( 0, '#fa9696' );
    gradient.addColorStop( 0.2, '#ffa659' );
    gradient.addColorStop( 0.4, '#ebd75e' );
    gradient.addColorStop( 0.6, '#8ce685' );
    gradient.addColorStop( 0.8, '#7fd7f0' );
    gradient.addColorStop( 1, '#927feb' );
    gradient.setTransformMatrix( Matrix3.rotationAroundPoint( Math.PI / 4 * 1.2, dataSortedNode.center ) );
    dataSortedNode.stroke = gradient;

    this.addChild( dataSortedNode );

    this.addChild( this.cardLayer );

    if ( model.parentContext === 'accordion' ) {
      const handWithArrowNode = new Image( handWithArrow_png, {
        tandem: options.tandem.createTandem( 'handWithArrowNode' ),
        opacity: 0,
        maxWidth: 25,
        pickable: false,
        centerTop: new Vector2( 0.5 * CAVConstants.CARD_DIMENSION, CAVConstants.CARD_DIMENSION - 8 ),
        visibleProperty: this.enabledProperty
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
    }

    const medianTextNode = new Text( new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty, { value: this.sceneModel.medianValueProperty }, {
      tandem: options.tandem.createTandem( 'medianStringProperty' ),
      maps: {
        value: CAVConstants.STRING_VALUE_NULL_MAP
      }
    } ), {
      font: CAVConstants.MAIN_FONT,
      maxWidth: 300
    } );
    const medianReadoutText = new Panel( medianTextNode, {
      stroke: 'lightgray',
      lineWidth: 0.6,
      cornerRadius: 4,
      tandem: options.tandem.createTandem( 'medianReadoutText' )
    } );
    this.addChild( medianReadoutText );

    const updateMedianNode = () => {

      const cardCells = model.getCardsInCellOrder();
      const leftmostCard = this.cardMap.get( cardCells[ 0 ] );

      const MARGIN_X = CAVConstants.CARD_SPACING / 2 + MedianBarNode.HALF_SPLIT_WIDTH;

      // Distance between the top card to the median bar when the card is not being held
      const MARGIN_Y = PICK_UP_DELTA_Y - 3;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( leftmostCard && ( ( this.isTopMedianVisibleProperty.value && model.isDataSorted() ) || model.parentContext === 'info' ) ) {
        const barY = MARGIN_Y;

        // If the card model exists the cardNode must also exist
        const rightmostCard = this.cardMap.get( cardCells[ cardCells.length - 1 ] )!;
        const left = model.getCardPositionX( 0 ) + MedianBarNode.LINE_WIDTH;
        const right = model.getCardPositionX( cardCells.length - 1 ) + rightmostCard.width + PICK_UP_DELTA_X + MARGIN_X;
        const median = ( left + right ) / 2;

        this.medianBarNode.setMedianBarShape( barY, left, median, right, false );
      }
      else {
        this.medianBarNode.clear();
      }

      if ( leftmostCard ) {

        if ( model.parentContext === 'accordion' ) {
          medianReadoutText.centerX = model.getCardPositionX( ( cardCells.length - 1 ) / 2 ) + leftmostCard.width / 2 + PICK_UP_DELTA_X;
          if ( medianReadoutText.left < 0 ) {
            medianReadoutText.left = 0;
          }
        }
        else {
          medianReadoutText.centerX = model.getCardPositionX( ( cardCells.length - 1 ) / 2 ) + leftmostCard.width / 2;
        }

        medianReadoutText.bottom = MARGIN_Y - 5;
        medianReadoutText.visible = this.isTopMedianVisibleProperty.value || model.parentContext === 'info';
      }
      else {
        medianReadoutText.visible = false;
      }
    };
    model.cardCellsChangedEmitter.addListener( updateMedianNode );
    this.sceneModel.medianValueProperty.link( updateMedianNode );
    this.isTopMedianVisibleProperty.link( updateMedianNode );
    this.sceneModel.objectChangedEmitter.addListener( updateMedianNode );
    medianTextNode.boundsProperty.link( updateMedianNode );

    this.sceneModel.resetEmitter.addListener( () => {
      dataSortedNode.visible = false;
      if ( this.dataSortedNodeAnimation ) {
        this.dataSortedNodeAnimation.stop();
        this.dataSortedNodeAnimation = null;
      }
    } );

    if ( model.parentContext === 'info' ) {
      this.pickable = false;
    }

    const focusedCardNodeProperty = new Property<CardNode | null>( null );

    // TODO: What if there is no focusedCardNodeProperty? Make sure this isn't true in that case, see https://github.com/phetsims/center-and-variability/issues/351
    // TODO: When a card is grabbed, translate it up and left like for the mouse/touch, see https://github.com/phetsims/center-and-variability/issues/351
    const isCardGrabbedProperty = new Property( false );

    sceneModel.clearDataEmitter.addListener( () => {
      focusedCardNodeProperty.reset();
      isCardGrabbedProperty.reset();
    } );

    // Update focused card when cards are created.  TODO: https://github.com/phetsims/center-and-variability/issues/351 listen for cardAdded or something like that
    sceneModel.stackChangedEmitter.addListener( () => {

      const activeCardNodes = this.getActiveCardNodesInOrder();

      // When a user is focused on the card container but there are no cards yet, we want to ensure that a card gets focused
      // once there is a card.
      if ( focusedCardNodeProperty.value === null && this.focused && this.cardNodes[ 0 ].model.isActiveProperty.value ) {
        focusedCardNodeProperty.value = activeCardNodes[ 0 ];
      }
    } );

    this.addInputListener( {
      focus: () => {
        const activeCardNodes = this.getActiveCardNodesInOrder();
        if ( focusedCardNodeProperty.value === null && activeCardNodes.length > 0 ) {
          focusedCardNodeProperty.value = activeCardNodes[ 0 ];
        }
      },
      blur: () => {
        isCardGrabbedProperty.value = false;
      }
    } );

    Multilink.multilink( [ focusedCardNodeProperty, isCardGrabbedProperty ], ( focusedCardNode, isCardNodeGrabbed ) => {
        if ( focusedCardNode ) {

          // TODO: Add isDashed to the FocusHighlightFromNode options, see https://github.com/phetsims/center-and-variability/issues/351
          // TODO: There is an odd offset due to the pick/up grab area for the cards, see https://github.com/phetsims/center-and-variability/issues/351
          const focusForSelectedCard = new FocusHighlightFromNode( focusedCardNode );
          this.setFocusHighlight( focusForSelectedCard );

          focusForSelectedCard.makeDashed( isCardNodeGrabbed );

          focusedCardNode.model.isDraggingProperty.value = isCardNodeGrabbed;
        }
        else {
          this.setFocusHighlight( 'invisible' );
        }
      }
    );

    // TODO: Some duplication with SoccerSceneView, see https://github.com/phetsims/center-and-variability/issues/351
    const keyboardListener = new KeyboardListener( {
      keys: [ 'arrowRight', 'arrowLeft', 'enter', 'space', 'escape' ],
      callback: ( event, listener ) => {

        const keysPressed = listener.keysPressed;

        // Select a card
        const focusedCardNode = focusedCardNodeProperty.value;
        const activeCardNodes = this.getActiveCardNodesInOrder();
        const numberOfActiveCards = activeCardNodes.length;

        if ( focusedCardNode ) {
          if ( ( keysPressed === 'arrowRight' || keysPressed === 'arrowLeft' ) ) {

            if ( !isCardGrabbedProperty.value ) {
              const delta = listener.keysPressed === 'arrowRight' ? 1 : -1;

              // We are deciding not to wrap the value around the ends of the range because the sort order is important and does not wrap
              const currentIndex = activeCardNodes.indexOf( focusedCardNode );
              const nextIndex = Utils.clamp( currentIndex + delta, 0, numberOfActiveCards - 1 );
              focusedCardNodeProperty.value = activeCardNodes[ nextIndex ];
            }
            else {

              // Move a selected card
              const delta = listener.keysPressed === 'arrowLeft' ? -1 : 1;

              const currentIndex = activeCardNodes.indexOf( focusedCardNode );

              // swap cards
              const targetIndex = Utils.clamp( currentIndex + delta, 0, numberOfActiveCards - 1 );
              if ( targetIndex !== currentIndex ) {
                const displacedCardNode = activeCardNodes[ targetIndex ];

                focusedCardNode.model.cellPositionProperty.value = targetIndex;
                displacedCardNode.model.cellPositionProperty.value = currentIndex;

                model.animateToHomeCell( focusedCardNode.model, 0.3 );
                model.animateToHomeCell( displacedCardNode.model, 0.3 );

                // TODO: Celebrate if the user sorted the data, see https://github.com/phetsims/center-and-variability/issues/351
                model.cardCellsChangedEmitter.emit();

                // Gets rid of the hand icon
                model.hasKeyboardMovedCardProperty.value = true;
              }
            }
          }
          else if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            isCardGrabbedProperty.value = !isCardGrabbedProperty.value;
          }
          else if ( isCardGrabbedProperty.value ) {
            if ( keysPressed === 'escape' ) {
              isCardGrabbedProperty.value = false;
            }
          }
        }
      }
    } );

    const focusHighlightFromNode = new FocusHighlightFromNode( this, {
      outerStroke: FocusHighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: FocusHighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: FocusHighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: FocusHighlightPath.GROUP_INNER_LINE_WIDTH
    } );

    // TODO: The right edge of this rectangle fluctuates as you move a card fully to the right, see https://github.com/phetsims/center-and-variability/issues/351
    this.setGroupFocusHighlight( focusHighlightFromNode );
    this.addInputListener( keyboardListener );
  }

  // The listener which is linked to the cardNode.positionProperty
  private createDragPositionListener( cardNode: CardNode ): ( position: Vector2 ) => void {
    return ( position: Vector2 ) => {
      if ( cardNode.dragListener.isPressedProperty.value ) {

        assert && assert( cardNode.model.cellPositionProperty.value !== null, 'The cardNode\'s cellPositionProperty cannot be null if it is being dragged.' );
        const originalCell = cardNode.model.cellPositionProperty.value!;

        // Find the closest cell to the dragged card
        const dragCell = this.model.getClosestCell( position.x );

        // The drag delta can suggest a match further than a neighboring cell. But we must do pairwise swaps with
        // neighbors only in order to maintain the correct ordering. See https://github.com/phetsims/center-and-variability/issues/78
        const closestCell = dragCell > originalCell ? originalCell + 1 :
                            dragCell < originalCell ? originalCell - 1 :
                            originalCell;

        const closestCardModel = this.model.getCardsInCells().find( card => card.cellPositionProperty.value === closestCell );

        assert && assert( closestCardModel, `closestCardModel is undefined. closestCell: ${closestCell}` );
        const currentOccupant = this.cardMap.get( closestCardModel! )!;

        // No-op if the dragged card is near its home cell
        if ( currentOccupant !== cardNode ) {

          // it's just a pairwise swap
          cardNode.model.cellPositionProperty.value = closestCell;
          currentOccupant.model.cellPositionProperty.value = originalCell;

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
      scaleProperty.lazyLink( ( scale, oldScale ) => {
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

  // TODO: See model.getCardsInCellOrder(); https://github.com/phetsims/center-and-variability/issues/351
  private getActiveCardNodesInOrder(): CardNode[] {
    return _.sortBy( this.cardNodes.filter( cardNode => cardNode.model.isActiveProperty.value ), cardNode => cardNode.model.cellPositionProperty.value! );
  }
}

centerAndVariability.register( 'CardNodeContainer', CardNodeContainer );