// Copyright 2022-2023, University of Colorado Boulder

/**
 * Manages creation, dragging, positioning of CardNode instances.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { LinearGradient, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVModel from '../model/CAVModel.js';
import CAVObject from '../model/CAVObject.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import CardNode from './CardNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import CardModel from '../model/CardModel.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Panel from '../../../../sun/js/Panel.js';
import CAVConstants from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MedianBarNode from './MedianBarNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Easing from '../../../../twixt/js/Easing.js';
import Animation from '../../../../twixt/js/Animation.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import AsyncCounter from '../model/AsyncCounter.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import DragIndicatorArrowNode from './DragIndicatorArrowNode.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

// constants
const CARD_SPACING = 10;
const getCardPositionX = ( index: number ) => index * ( CardNode.CARD_WIDTH + CARD_SPACING );

type SelfOptions = EmptySelfOptions;
export type CardNodeContainerOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class CardNodeContainer extends Node {

  // Each card is associated with one "cell", no two cards can be associated with the same cell.  The leftmost cell is 0.
  // The cells linearly map to locations across the screen.
  public readonly cardNodeCells: CardNode[] = [];

  // Fires if the cardNodeCells may have changed
  public readonly cardNodeCellsChangedEmitter: TEmitter = new Emitter<[]>();

  private readonly model: CAVModel;
  private readonly cardNodeGroup: PhetioGroup<CardNode, [ CardModel ]>;
  private readonly medianBarNode = new MedianBarNode( {
    notchDirection: 'up',
    barStyle: 'split'
  } );
  private readonly dragIndicatorArrowNode: ArrowNode;

  // Indicates whether the user has ever dragged a card. It's used to hide the drag indicator arrow after
  // the user dragged a card
  private readonly hasDraggedCardProperty: TReadOnlyProperty<boolean>;
  private readonly cardLayer = new Node();
  private isReadyForCelebration = false;
  private remainingCelebrationAnimations: ( () => void )[] = [];
  private dataSortedNodeAnimation: Animation | null = null;
  private wasSortedBefore = true;

  public constructor( model: CAVModel, providedOptions: CardNodeContainerOptions ) {

    const options = optionize<CardNodeContainerOptions, SelfOptions, NodeOptions>()( {
      phetioType: CardNodeContainerIO,
      phetioState: true
    }, providedOptions );

    super( options );

    this.model = model;

    // TODO-UX: maybe this should be converted to track distance for individual cards, see https://github.com/phetsims/center-and-variability/issues/150
    // Accumulated card drag distance, for purposes of hiding the drag indicator node
    const totalDragDistanceProperty = new NumberProperty( 0 );
    this.hasDraggedCardProperty = new DerivedProperty( [ totalDragDistanceProperty ], totalDragDistance => {
      return totalDragDistance > 15;
    } );

    this.cardNodeGroup = new PhetioGroup( ( tandem, cardModel ) => {
      return new CardNode( cardModel, new Vector2( 0, 0 ), () => this.getDragRange(), {
        tandem: tandem
      } );
    }, () => [ model.cardModelGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: model.includeCards ? options.tandem.createTandem( 'cardNodeGroup' ) : Tandem.OPT_OUT,
      supportsDynamicState: false
    } );

    this.addChild( this.medianBarNode );

    const objectCreatedListener = ( casObject: CAVObject ) => {

      // A ball landed OR a value changed
      casObject.valueProperty.link( value => {
        if ( this.model.isSortingDataProperty.value && value !== null ) {

          // TODO: Much of this listener code moved to the CAVModel. Should this move there as well?  We could make
          // the model track cardModelCells instead of the view tracking cardNodeCells
          this.sortData();
        }
      } );
    };

    model.objectGroup.forEach( objectCreatedListener );
    model.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    model.cardModelGroup.elementDisposedEmitter.addListener( cardModel => {
      const cardNode = this.getCardNode( cardModel.casObject )!;
      assert && assert( cardNode, 'card node should exist' );

      arrayRemove( this.cardNodeCells, cardNode );

      this.cardNodeGroup.disposeElement( cardNode );
      this.cardNodeCellsChangedEmitter.emit();
    } );

    model.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {
        this.sortData();
      }
    } );

    const dataSortedTextNode = new Text( CenterAndVariabilityStrings.youSortedTheData, {
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

    model.cardModelGroup.elementCreatedEmitter.addListener( cardModel => {

      const cardNode = this.cardNodeGroup.createCorrespondingGroupElement( cardModel.tandem.name, cardModel );
      this.cardLayer.addChild( cardNode );

      // Update the position of all cards (via animation) whenever any card is dragged
      cardNode.positionProperty.link( this.createDragPositionListener( cardNode ) );

      // When a card is dropped, send it to its home cell
      cardNode.dragListener.isPressedProperty.link( isPressed => {

        if ( isPressed ) {

          // TODO: multitouch concerns.  Should it be null|true|false?  Or maybe after celebration, set it to true because we know it is sorted?
          this.wasSortedBefore = this.isDataSorted();
        }

        if ( !isPressed && !phet.joist.sim.isSettingPhetioStateProperty.value ) {

          // Animate the dropped card home
          this.sendToHomeCell( cardNode, true, 0.2 );

          if ( this.isReadyForCelebration ) {
            const inProgressAnimations = this.cardNodeCells.filter( cardNode => cardNode.animation )
              .map( cardNode => cardNode.animation! );

            // Setup a callback for animation when all current animations finish
            const asyncCounter = new AsyncCounter( inProgressAnimations.length, () => {

              // we know at least one card exists because we're in a dragListener link
              const leftmostCard = this.cardNodeCells[ 0 ]!;

              if ( leftmostCard ) {
                dataSortedNode.centerX = getCardPositionX( ( this.cardNodeCells.length - 1 ) / 2 ) + leftmostCard.width / 2;
                dataSortedNode.bottom = leftmostCard.top - 7;
              }
              else {
                dataSortedNode.centerX = getCardPositionX( ( this.cardNodeCells.length - 1 ) / 2 );
                dataSortedNode.bottom = -7.5;
              }

              if ( dataSortedNode.left < 0 ) {
                dataSortedNode.left = 0;
              }
              dataSortedNode.visible = true;
              dataSortedNode.opacity = 1;

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

      let targetIndex = this.cardNodeCells.length;
      if ( this.model.isSortingDataProperty.value ) {
        const newValue = cardNode.casObject.valueProperty.value!;
        const existingLowerCardNodes = this.cardNodeCells.filter( cardNode => cardNode.casObject.valueProperty.value! <= newValue );

        const lowerNeighborCardNode = _.maxBy( existingLowerCardNodes, cardNode => this.cardNodeCells.indexOf( cardNode ) );
        targetIndex = lowerNeighborCardNode ? this.cardNodeCells.indexOf( lowerNeighborCardNode ) + 1 : 0;
      }

      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.cardNodeCells.splice( targetIndex, 0, cardNode );
        this.sendToHomeCell( cardNode, false );

        // Animate all displaced cards
        for ( let i = targetIndex; i < this.cardNodeCells.length; i++ ) {
          this.sendToHomeCell( this.cardNodeCells[ i ] );
        }

        this.cardNodeCellsChangedEmitter.emit();
      }
    } );

    this.dragIndicatorArrowNode = new DragIndicatorArrowNode( {
      tandem: options.tandem.createTandem( 'dragIndicatorArrowNode' )
    } );

    // Add or remove the arrow node child
    const dragIndicatorContainer = new Node();
    this.addChild( dragIndicatorContainer );

    const updateDragIndicator = () => {

      const leftCard = this.cardNodeCells[ 0 ];
      const rightCard = this.cardNodeCells[ 1 ];

      const hasPressedCard = this.hasDraggedCardProperty.value;

      const newChildren = leftCard && rightCard && !hasPressedCard ? [ this.dragIndicatorArrowNode ] : [];

      if ( newChildren.length !== dragIndicatorContainer.children.length ) {
        dragIndicatorContainer.children = newChildren;

        if ( leftCard && rightCard ) {
          this.dragIndicatorArrowNode.centerBottom = leftCard.bounds.centerTop.plusXY( 0, -8 );
        }
      }
    };
    this.cardNodeCellsChangedEmitter.addListener( updateDragIndicator );
    this.hasDraggedCardProperty.link( updateDragIndicator );

    const medianTextNode = new Text( '', {
      font: CAVConstants.BUTTON_FONT
    } );
    const medianReadoutPanel = new Panel( medianTextNode, {
      stroke: 'lightgray',
      lineWidth: 0.6,
      cornerRadius: 4
    } );
    this.addChild( medianReadoutPanel );

    model.medianValueProperty.link( medianValue => {

      // TODO-PHET_IO: Re-center when the text changes since it could have a different width
      medianTextNode.string = StringUtils.fillIn( CenterAndVariabilityStrings.medianEqualsValue, { value: model.medianValueProperty.value } );
    } );

    const updateMedianNode = () => {

      const leftmostCard = this.cardNodeCells[ 0 ];

      const MARGIN_X = CARD_SPACING / 2 - MedianBarNode.HALF_SPLIT_WIDTH;
      const MARGIN_Y = 5;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( model.isShowingTopMedianProperty.value && this.isDataSorted() && leftmostCard ) {
        const barY = leftmostCard.bottom + MARGIN_Y;

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
        medianReadoutPanel.top = leftmostCard.bottom + MARGIN_Y + 13;
        medianReadoutPanel.visible = model.isShowingTopMedianProperty.value;
      }
      else {
        medianReadoutPanel.visible = false;
      }
    };
    this.cardNodeCellsChangedEmitter.addListener( updateMedianNode );
    model.medianValueProperty.link( updateMedianNode );
    model.isShowingTopMedianProperty.link( updateMedianNode );
    model.objectChangedEmitter.addListener( updateMedianNode );

    this.model.resetEmitter.addListener( () => {
      totalDragDistanceProperty.reset();
      dataSortedNode.visible = false;
      if ( this.dataSortedNodeAnimation ) {
        this.dataSortedNodeAnimation.stop();
        this.dataSortedNodeAnimation = null;
      }
    } );
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

          // Just animated the displaced occupant
          this.sendToHomeCell( currentOccupant, true );

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
        () => this.animateCelebration1( callback ),
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
  private animateCelebration1( callback: () => void ): void {

    const asyncCounter = new AsyncCounter( this.cardNodeCells.length, callback );

    this.cardNodeCells.forEach( cardNode => {
      const initialScale = cardNode.getScaleVector().x;
      const center = cardNode.center.copy();

      const scaleProperty = new NumberProperty( initialScale );
      scaleProperty.link( scale => cardNode.setScaleMagnitude( scale ) );

      const scaleUpAnimation = new Animation( {
        duration: 0.2,
        targets: [ {
          property: scaleProperty,
          to: initialScale * 1.2,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      const updatePosition = () => {
        cardNode.center = center;
      };
      scaleUpAnimation.updateEmitter.addListener( updatePosition );

      const scaleDownAnimation = new Animation( {
        duration: 0.2,
        targets: [ {
          property: scaleProperty,
          to: initialScale,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );
      scaleDownAnimation.updateEmitter.addListener( updatePosition );
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
  private isDataSorted(): boolean {
    let lastValue = null;
    for ( let i = 0; i < this.cardNodeCells.length; i++ ) {
      const value = this.cardNodeCells[ i ].casObject.valueProperty.value!;

      if ( lastValue !== null && value < lastValue ) {
        return false;
      }
      lastValue = value;
    }
    return true;
  }

  // TODO: Do we like the way these are optional?
  // TODO: Separate into two methods: animateToHomeCell vs setAtHomeCell
  public sendToHomeCell( cardNode: CardNode, animate = true, duration = 0.3, callback = _.noop ): void {
    const homeIndex = this.cardNodeCells.indexOf( cardNode );
    const homePosition = new Vector2( getCardPositionX( homeIndex ), 0 );

    if ( animate ) {
      cardNode.animateTo( homePosition, duration, callback );
    }
    else {
      cardNode.positionProperty.value = homePosition;
      callback();
    }
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

  private getCardNode( casObject: CAVObject ): CardNode | null {
    return this.cardNodeCells.find( cardNode => cardNode.casObject === casObject ) || null;
  }

  private sortData(): void {

    // If the card is visible, the value property should be non-null
    const sorted = _.sortBy( this.cardNodeCells, cardNode => cardNode.casObject.valueProperty.value );
    this.cardNodeCells.length = 0;
    this.cardNodeCells.push( ...sorted );
    this.cardNodeCells.forEach( cardNode => this.sendToHomeCell( cardNode, true, 0.5 ) );
    this.cardNodeCellsChangedEmitter.emit(); // TODO: OK if this fires false positives?
  }

  private getDragRange(): Range {
    const maxX = this.cardNodeCells.length > 0 ? getCardPositionX( this.cardNodeCells.length - 1 ) : 0;
    return new Range( 0, maxX );
  }
}

type CardNodeContainerState = {
  cardNodes: ReferenceIOState[];
};

// Track the order of the cards as self-state, so that the downstream sim can get the cards in the desired cells
const CardNodeReferenceIO = ReferenceIO( Node.NodeIO );
const CardNodeContainerIO = new IOType( 'CardNodeContainerIO', {
  valueType: CardNodeContainer,
  toStateObject: ( cardNodeContainer: CardNodeContainer ) => {
    return {
      cardNodes: cardNodeContainer.cardNodeCells.map( cardNode => CardNodeReferenceIO.toStateObject( cardNode ) )
    };
  },
  applyState: ( cardNodeContainer: CardNodeContainer, state: CardNodeContainerState ) => {
    const cardNodes = state.cardNodes.map( ( element: ReferenceIOState ) => CardNodeReferenceIO.fromStateObject( element ) );
    cardNodeContainer.cardNodeCells.length = 0;
    cardNodeContainer.cardNodeCells.push( ...cardNodes );
    cardNodeContainer.cardNodeCells.forEach( cardNode => {
      cardNodeContainer.sendToHomeCell( cardNode, false );
    } );

    cardNodeContainer.cardNodeCellsChangedEmitter.emit();
  },
  stateSchema: {
    cardNodes: ArrayIO( ReferenceIO( CardNodeReferenceIO ) )
  }
} );

centerAndVariability.register( 'CardNodeContainer', CardNodeContainer );