// Copyright 2022-2023, University of Colorado Boulder

/**
 * Manages creation, dragging, positioning of CardNode instances.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Image, LinearGradient, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import SoccerBall from '../../soccer-common/model/SoccerBall.js';
import CardNode, { cardDropSoundClip, cardPickUpSoundClip, PICK_UP_DELTA_Y } from './CardNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Panel from '../../../../sun/js/Panel.js';
import CAVConstants from '../../common/CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Easing from '../../../../twixt/js/Easing.js';
import Animation from '../../../../twixt/js/Animation.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import AsyncCounter from '../../common/model/AsyncCounter.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import MedianModel from '../../median/model/MedianModel.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import handWithArrow_png from '../../../images/handWithArrow_png.js';

import cvCardMovementSoundsV2001_mp3 from '../../../sounds/cvCardMovementSoundsV2001_mp3.js';
import cvCardMovementSoundsV2002_mp3 from '../../../sounds/cvCardMovementSoundsV2002_mp3.js';
import cvCardMovementSoundsV2003_mp3 from '../../../sounds/cvCardMovementSoundsV2003_mp3.js';
import cvCardMovementSoundsV2004_mp3 from '../../../sounds/cvCardMovementSoundsV2004_mp3.js';
import cvCardMovementSoundsV2005_mp3 from '../../../sounds/cvCardMovementSoundsV2005_mp3.js';
import cvCardMovementSoundsV2006_mp3 from '../../../sounds/cvCardMovementSoundsV2006_mp3.js';

import cvSuccessOptions002_mp3 from '../../../sounds/cvSuccessOptions002_mp3.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';

const successSoundClip = new SoundClip( cvSuccessOptions002_mp3, {
  initialOutputLevel: 0.2
} );
soundManager.addSoundGenerator( successSoundClip );

const cardMovementSounds = [
  cvCardMovementSoundsV2001_mp3,
  cvCardMovementSoundsV2002_mp3,
  cvCardMovementSoundsV2003_mp3,
  cvCardMovementSoundsV2004_mp3,
  cvCardMovementSoundsV2005_mp3,
  cvCardMovementSoundsV2006_mp3
];

export const cardMovementSoundClips = cardMovementSounds.map( sound => new SoundClip( sound, {
  initialOutputLevel: 0.2,
  additionalAudioNodes: []
} ) );
cardMovementSoundClips.forEach( soundClip => soundManager.addSoundGenerator( soundClip ) );

// constants
const CARD_SPACING = 10;
const getCardPositionX = ( index: number ) => index * ( CardNode.CARD_DIMENSION + CARD_SPACING );

type SelfOptions = {

  // accordionBox is the full-featured interactive version with drag input and sound effects
  // info is the non-interactive version used in the info dialog
  parentContext: 'info' | 'accordion';
};
export type CardNodeContainerOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class CardNodeContainer extends Node {

  // Each card is associated with one "cell", no two cards can be associated with the same cell.  The leftmost cell is 0.
  // The cells linearly map to locations across the screen.
  public readonly cardNodeCells: CardNode[] = [];

  // Fires if the cardNodeCells may have changed
  public readonly cardNodeCellsChangedEmitter: TEmitter = new Emitter<[]>();

  private readonly model: MedianModel;
  public readonly cardNodes: CardNode[];
  private readonly medianBarNode = new MedianBarNode( {
    barStyle: 'split'
  } );

  // Indicates whether the user has ever dragged a card. It's used to hide the drag indicator arrow after
  // the user dragged a card
  private readonly hasDraggedCardProperty: TReadOnlyProperty<boolean>;
  private readonly cardWithExpandedPointerAreaProperty: TProperty<CardNode | null>;
  private readonly cardLayer = new Node();
  private isReadyForCelebration = false;
  private remainingCelebrationAnimations: ( () => void )[] = [];
  private dataSortedNodeAnimation: Animation | null = null;
  private wasSortedBefore = true;

  // For sonification, order the active, non-displaced cards appeared in the last step
  private lastStepOrder: CardNode[] = [];
  private parentContext: 'info' | 'accordion';

  public constructor( model: MedianModel, providedOptions: CardNodeContainerOptions ) {

    const options = optionize<CardNodeContainerOptions, SelfOptions, NodeOptions>()( {
      phetioType: CardNodeContainerIO,
      phetioState: false
    }, providedOptions );

    super( options );

    this.parentContext = options.parentContext;

    this.model = model;

    // Accumulated card drag distance, for purposes of hiding the drag indicator node
    const totalDragDistanceProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'totalDragDistanceProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For PhET-iO internal use only. Accumulated card drag distance, for purposes of hiding the drag indicator node'
    } );
    this.hasDraggedCardProperty = new DerivedProperty( [ totalDragDistanceProperty ], totalDragDistance => {
      return totalDragDistance > 15;
    } );
    this.cardWithExpandedPointerAreaProperty = new Property( null );

    this.cardNodes = model.cards.map( ( cardModel, index ) => {
      const cardNode = new CardNode( this, cardModel, new Vector2( 0, 0 ), () => this.getDragRange(), {
        tandem: options.tandem.createTandem( 'cardNodes' ).createTandem1Indexed( 'cardNode', index )
      } );

      this.cardLayer.addChild( cardNode );

      // Update the position of all cards (via animation) whenever any card is dragged
      cardNode.positionProperty.link( this.createDragPositionListener( cardNode ) );

      // When a card is dropped, send it to its home cell
      cardNode.dragListener.isPressedProperty.lazyLink( isPressed => {

        if ( isPressed ) {
          this.wasSortedBefore = this.isDataSorted();
        }

        if ( !isPressed && !isSettingPhetioStateProperty.value ) {

          // Animate the dropped card home
          this.animateToHomeCell( cardNode, 0.2 );

          if ( this.isReadyForCelebration ) {
            const inProgressAnimations = this.cardNodeCells.filter( cardNode => cardNode.animation )
              .map( cardNode => cardNode.animation! );

            // Setup a callback for animation when all current animations finish
            const asyncCounter = new AsyncCounter( inProgressAnimations.length, () => {

              // we know at least one card exists because we're in a dragListener link
              const leftmostCard = this.cardNodeCells[ 0 ];
              assert && assert( leftmostCard, 'leftmostCard should be defined' );

              dataSortedNode.centerX = getCardPositionX( ( this.cardNodeCells.length - 1 ) / 2 ) + leftmostCard.width / 2;
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

              const cardBeingDragged = this.cardNodeCells.filter( cardNode => cardNode.dragListener.isPressed ).length;
              const cardsAnimating = this.cardNodeCells.filter( cardNode => cardNode.animation ).length;
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
      cardNode.dragDistanceEmitter.addListener( distance => {
        totalDragDistanceProperty.value += distance;
      } );

      const removeCardCell = ( cardNode: CardNode ) => {
        const index = this.cardNodeCells.indexOf( cardNode );

        if ( index >= 0 ) {
          this.cardNodeCells.splice( index, 1 );
          this.cardNodeCellsChangedEmitter.emit();
        }
      };

      cardModel.isActiveProperty.link( isActive => {
        if ( isActive && !isSettingPhetioStateProperty.value ) {

          let targetIndex = this.cardNodeCells.length;
          if ( this.model.isSortingDataProperty.value || options.parentContext === 'info' ) {
            const newValue = cardNode.soccerBall.valueProperty.value!;
            const existingLowerCardNodes = this.cardNodeCells.filter( cardNode => cardNode.soccerBall.valueProperty.value! <= newValue );

            const lowerNeighborCardNode = _.maxBy( existingLowerCardNodes, cardNode => this.cardNodeCells.indexOf( cardNode ) );
            targetIndex = lowerNeighborCardNode ? this.cardNodeCells.indexOf( lowerNeighborCardNode ) + 1 : 0;
          }

          this.cardNodeCells.splice( targetIndex, 0, cardNode );
          cardNode.timeSinceLanded = 0;
          this.setAtHomeCell( cardNode );

          // Animate all displaced cards
          for ( let i = targetIndex; i < this.cardNodeCells.length; i++ ) {
            this.cardNodeCells[ i ].positionProperty.value = this.cardNodeCells[ i ].positionProperty.value.plusXY( 1, 0 );
            this.animateToHomeCell( this.cardNodeCells[ i ], 0.3 );
          }

          this.cardNodeCellsChangedEmitter.emit();
        }
        else if ( !isActive ) {
          removeCardCell( cardNode );
        }
      } );

      cardModel.soccerBall.valueProperty.link( value => {
        if ( value === null ) {
          removeCardCell( cardNode );
        }
      } );

      return cardNode;
    } );

    this.addChild( this.medianBarNode );

    model.selectedSceneModelProperty.value.soccerBalls.forEach( soccerBall => {

      // A ball landed OR a value changed
      soccerBall.valueProperty.link( value => {
        if ( ( this.model.isSortingDataProperty.value && value !== null ) || options.parentContext === 'info' ) {
          this.sortData( 'valueChanged' );
        }
      } );
    } );

    model.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {

        if ( !this.isDataSorted() ) {

          // Will play sound effects in step()
          this.sortData();
        }
        else {

          if ( options.parentContext === 'accordion' ) {
            cardPickUpSoundClip.play();
            this.animateCelebration1( () => cardDropSoundClip.play(), false );
          }
        }
      }
    } );

    const dataSortedTextNode = new Text( CenterAndVariabilityStrings.youSortedTheDataStringProperty, {
      font: new PhetFont( 15 )
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

    if ( options.parentContext === 'accordion' ) {
      const handWithArrowNode = new Image( handWithArrow_png, {
        tandem: options.tandem.createTandem( 'handWithArrowNode' ),
        opacity: 0,
        maxWidth: 25,
        centerTop: new Vector2( 0.5 * CardNode.CARD_DIMENSION, CardNode.CARD_DIMENSION - 8 )
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

      const updateDragIndicator = () => {

        const leftCard = this.cardNodeCells[ 0 ] || null;
        const rightCard = this.cardNodeCells[ 1 ] || null;

        const resetCardWithExpandedPointerArea = () => {
          if ( this.cardWithExpandedPointerAreaProperty.value !== null ) {
            this.cardWithExpandedPointerAreaProperty.value.mouseArea = this.cardWithExpandedPointerAreaProperty.value.localBounds;
            this.cardWithExpandedPointerAreaProperty.value.touchArea = this.cardWithExpandedPointerAreaProperty.value.localBounds;
          }
          this.cardWithExpandedPointerAreaProperty.value = null;
        };

        //if the left card has changed due to auto-sorting, reduce its bounds back to the default
        if ( leftCard !== null && leftCard !== this.cardWithExpandedPointerAreaProperty.value ) {
          resetCardWithExpandedPointerArea();
        }

        // if the user has not yet dragged a card and there are multiple cards showing, fade in the drag indicator
        if ( !this.hasDraggedCardProperty.value && leftCard && rightCard ) {

          // Expand the card's touch + mouse area to cover the hand. Much simpler than adding a DragListener.createForwardingListener
          const newArea = new Bounds2( leftCard.localBounds.minX, leftCard.localBounds.minY, leftCard.localBounds.maxX, leftCard.localBounds.maxY + 30 );
          leftCard.mouseArea = newArea;
          leftCard.touchArea = newArea;
          this.cardWithExpandedPointerAreaProperty.value = leftCard;

          fadeInAnimation.start();
        }

        // if the user has dragged a card and the hand indicator is showing, fade the hand indicator out
        if ( this.hasDraggedCardProperty.value && this.cardWithExpandedPointerAreaProperty.value !== null ) {
          resetCardWithExpandedPointerArea();

          if ( fadeInAnimation.animatingProperty.value ) {
            fadeInAnimation.stop();
          }

          fadeOutAnimation.start();
        }
      };

      this.cardNodeCellsChangedEmitter.addListener( updateDragIndicator );
      this.hasDraggedCardProperty.link( updateDragIndicator );
    }

    const medianTextNode = new Text( new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty, { value: model.selectedSceneModelProperty.value.medianValueProperty }, {
      tandem: options.tandem.createTandem( 'medianStringProperty' ),
      maps: {
        value: CAVConstants.STRING_VALUE_NULL_MAP
      }
    } ), {
      font: CAVConstants.MAIN_FONT,
      maxWidth: 300
    } );
    const medianReadoutPanel = new Panel( medianTextNode, {
      stroke: 'lightgray',
      lineWidth: 0.6,
      cornerRadius: 4
    } );
    this.addChild( medianReadoutPanel );

    const updateMedianNode = () => {

      const leftmostCard = this.cardNodeCells[ 0 ];

      const MARGIN_X = CARD_SPACING / 2 - MedianBarNode.HALF_SPLIT_WIDTH;

      // Distance between the top card to the median bar when the card is not being held
      const MARGIN_Y = PICK_UP_DELTA_Y - 3;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( leftmostCard && ( ( model.isTopMedianVisibleProperty.value && this.isDataSorted() ) || options.parentContext === 'info' ) ) {
        const barY = MARGIN_Y;
        const rightmostCard = this.cardNodeCells[ this.cardNodeCells.length - 1 ];
        const left = getCardPositionX( 0 ) - MARGIN_X;
        const right = getCardPositionX( this.cardNodeCells.length - 1 ) + rightmostCard.width + MARGIN_X;

        this.medianBarNode.setMedianBarShape( barY, left, ( left + right ) / 2, right, false );
      }
      else {
        this.medianBarNode.clear();
      }

      if ( leftmostCard ) {
        medianReadoutPanel.centerX = getCardPositionX( ( this.cardNodeCells.length - 1 ) / 2 ) + leftmostCard.width / 2;
        if ( medianReadoutPanel.left < 0 ) {
          medianReadoutPanel.left = 0;
        }
        medianReadoutPanel.bottom = MARGIN_Y - 5;
        medianReadoutPanel.visible = model.isTopMedianVisibleProperty.value || options.parentContext === 'info';
      }
      else {
        medianReadoutPanel.visible = false;
      }
    };
    this.cardNodeCellsChangedEmitter.addListener( updateMedianNode );
    model.selectedSceneModelProperty.value.medianValueProperty.link( updateMedianNode );
    model.isTopMedianVisibleProperty.link( updateMedianNode );
    model.selectedSceneModelProperty.value.objectChangedEmitter.addListener( updateMedianNode );
    medianTextNode.boundsProperty.link( updateMedianNode );

    model.selectedSceneModelProperty.value.resetEmitter.addListener( () => {
      totalDragDistanceProperty.reset();
      dataSortedNode.visible = false;
      if ( this.dataSortedNodeAnimation ) {
        this.dataSortedNodeAnimation.stop();
        this.dataSortedNodeAnimation = null;
      }
    } );

    if ( options.parentContext === 'info' ) {
      this.pickable = false;
    }

    if ( options.parentContext === 'accordion' ) {
      this.cardNodeCellsChangedEmitter.addListener( () => {
        model.areCardsSortedProperty.value = this.isDataSorted();
      } );
    }
  }

  // The listener which is linked to the cardNode.positionProperty
  private createDragPositionListener( cardNode: CardNode ): ( position: Vector2 ) => void {
    return ( position: Vector2 ) => {
      if ( cardNode.dragListener.isPressedProperty.value ) {

        const originalCell = this.cardNodeCells.indexOf( cardNode );

        // Find the closest cell to the dragged card
        const dragCell = this.getClosestCell( position.x );

        // The drag delta can suggest a match further than a neighboring cell. But we must do pairwise swaps with
        // neighbors only in order to maintain the correct ordering. See https://github.com/phetsims/center-and-variability/issues/78
        const closestCell = dragCell > originalCell ? originalCell + 1 :
                            dragCell < originalCell ? originalCell - 1 :
                            originalCell;

        const currentOccupant = this.cardNodeCells[ closestCell ];

        // No-op if the dragged card is near its home cell
        if ( currentOccupant !== cardNode ) {

          // it's just a pairwise swap
          this.cardNodeCells[ closestCell ] = cardNode;
          this.cardNodeCells[ originalCell ] = currentOccupant;

          this.animateToHomeCell( currentOccupant, 0.3 );

          // See if the user unsorted the data.  If so, uncheck the "Sort Data" checkbox
          if ( this.model.isSortingDataProperty.value && !this.isDataSorted() ) {
            this.model.isSortingDataProperty.value = false;
          }

          // celebrate after the card was dropped and gets to its home
          this.isReadyForCelebration = this.isDataSorted() && !this.wasSortedBefore;

          this.cardNodeCellsChangedEmitter.emit();
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
  private animateCelebration1( callback: () => void, adjustCentering: boolean ): void {

    const asyncCounter = new AsyncCounter( this.cardNodeCells.length, callback );

    this.cardNodeCells.forEach( cardNode => {

      const scaleProperty = new NumberProperty( 1 );
      scaleProperty.lazyLink( ( scale, oldScale ) => {
        const center = cardNode.center.copy();
        cardNode.setScaleMagnitude( scale );
        if ( adjustCentering ) {
          cardNode.center = center;
        }
      } );

      const scaleUpAnimation = new Animation( {
        duration: adjustCentering ? 0.2 : 0.15,
        targets: [ {
          property: scaleProperty,
          to: adjustCentering ? 1.2 : 1.15,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      const scaleDownAnimation = new Animation( {
        duration: adjustCentering ? 0.2 : 0.15,
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

    const asyncCounter = new AsyncCounter( this.cardNodeCells.length, callback );

    this.cardNodeCells.forEach( cardNode => {
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
    const asyncCounter = new AsyncCounter( this.cardNodeCells.length, callback );

    this.cardNodeCells.forEach( ( cardNode, index ) => {
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

  /**
   * Check if all of the data is in order, by using the cells associated with the card node.  Note that means
   * it is using the cell the card may be animating to.
   */
  public isDataSorted(): boolean {

    for ( let i = 1; i < this.cardNodeCells.length; i++ ) {
      const previousValue = this.cardNodeCells[ i - 1 ].soccerBall.valueProperty.value;
      const value = this.cardNodeCells[ i ].soccerBall.valueProperty.value;

      if ( previousValue !== null && value !== null && value < previousValue ) {
        return false;
      }
    }
    return true;
  }

  public isAnyCardMoving(): boolean {
    return _.some( this.cardNodeCells, cardNode => cardNode.positionProperty.value.x !== this.getHomePosition( cardNode ).x );
  }

  private getHomePosition( cardNode: CardNode ): Vector2 {
    const homeIndex = this.cardNodeCells.indexOf( cardNode );
    return new Vector2( getCardPositionX( homeIndex ), 0 );
  }

  public animateToHomeCell( cardNode: CardNode, duration: number, animationReason: 'valueChanged' | null = null ): void {
    cardNode.animateTo( this.getHomePosition( cardNode ), duration, animationReason );
  }

  public setAtHomeCell( cardNode: CardNode ): void {
    cardNode.positionProperty.value = this.getHomePosition( cardNode );
  }

  /**
   * Find the cell the dragged card is closest to
   */
  private getClosestCell( x: number ): number {
    if ( this.cardNodeCells.length === 0 ) {
      return 0;
    }
    else {
      const cellIndices = _.range( this.cardNodeCells.length );
      return _.minBy( cellIndices, index => Math.abs( x - getCardPositionX( index ) ) )!;
    }
  }

  private getCardNode( soccerBall: SoccerBall ): CardNode | null {
    return this.cardNodeCells.find( cardNode => cardNode.soccerBall === soccerBall ) || null;
  }

  private sortData( animationReason: 'valueChanged' | null = null ): void {

    // If the card is visible, the value property should be non-null
    const sorted = _.sortBy( this.cardNodeCells, cardNode => cardNode.soccerBall.valueProperty.value );
    this.cardNodeCells.length = 0;
    this.cardNodeCells.push( ...sorted );
    this.cardNodeCells.forEach( cardNode => this.animateToHomeCell( cardNode, 0.5, animationReason ) );
    this.cardNodeCellsChangedEmitter.emit();
  }

  private getDragRange(): Range {
    const maxX = this.cardNodeCells.length > 0 ? getCardPositionX( this.cardNodeCells.length - 1 ) : 0;
    return new Range( 0, maxX );
  }

  /**
   * Play sound effects whenever two cards pass each other. If the user is dragging it, that card gets precedence for choosing the pitch.  Moving to the right is a higher pitch. If one card animates past another, that movement direction chooses the pitch. If both cards are animating, use an in-between pitch.
   */
  public step( dt: number ): void {

    // Only consider cards that landed more than 0.1 seconds ago, to avoid an edge case that was mistakenly playing audio when soccer balls land
    const activeCardNodes = this.cardNodes.filter( cardNode => cardNode.cardModel.isActiveProperty.value && cardNode.timeSinceLanded > 0.1 && cardNode.animationReason !== 'valueChanged' );

    // Determine the sort order to see which cards have swapped
    const newOrder = _.sortBy( activeCardNodes, cardNode => cardNode.positionProperty.value.x );

    // Consider only cards which are both in the old and new lists
    const oldList = this.lastStepOrder.filter( cardNode => newOrder.includes( cardNode ) );
    const newList = newOrder.filter( cardNode => this.lastStepOrder.includes( cardNode ) );

    const swappedPairs: Array<{ first: CardNode; second: CardNode; direction: string }> = [];

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
      const directionToPlayFromInteraction = pair.first.isDragging && !pair.second.isDragging ? pair.direction :
                                             pair.second.isDragging && !pair.first.isDragging ? opposite( pair.direction ) :
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

    this.cardNodes.forEach( cardNode => {
      cardNode.timeSinceLanded += dt;
    } );
  }
}

const CardNodeContainerIO = new IOType( 'CardNodeContainerIO', {
  valueType: CardNodeContainer,
  methods: {
    getData: {
      returnType: ArrayIO( NumberIO ),
      parameterTypes: [],
      implementation: function( this: CardNodeContainer ) {
        return this.cardNodeCells.filter( cardNode => cardNode.soccerBall.valueProperty.value !== null ).map( cardNode => cardNode.soccerBall.valueProperty.value );
      },
      documentation: 'Gets the data points the cards in the order they appear.'
    }
  }
} );

centerAndVariability.register( 'CardNodeContainer', CardNodeContainer );