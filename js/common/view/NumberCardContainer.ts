// Copyright 2022, University of Colorado Boulder

/**
 * Manages creation, dragging, positioning of CardNode instances.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Color, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASModel from '../model/CASModel.js';
import CASObject from '../model/CASObject.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CardNode from './CardNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import CardModel from '../model/CardModel.js';

// constants
const CARD_SPACING = 10;
const getCardPositionX = ( index: number ) => index * ( CardNode.CARD_WIDTH + CARD_SPACING );

type NumberCardContainerSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class NumberCardContainer extends Node {
  public readonly cardNodeCells: CardNode[];
  private readonly model: CASModel;
  private readonly numberCardGroup: PhetioGroup<CardNode>;
  private readonly areCardsSortedProperty: BooleanProperty;
  private readonly medianBarsNode: Node;
  private readonly cardModelGroup: PhetioGroup<CardModel>;

  constructor( model: CASModel, providedOptions?: NumberCardOptions ) {

    const options = optionize<NumberCardOptions, NumberCardContainerSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED,
      phetioType: NumberCardContainerIO,
      phetioState: true
    }, providedOptions );

    super( options );

    this.model = model;

    // Each card is associated with one "cell", no two cards can be associated with the same cell.  The leftmost cell is 0.
    // The cells linearly map to locations across the screen.
    this.cardNodeCells = [];

    this.areCardsSortedProperty = new BooleanProperty( false );

    // For PhET-iO State, it is difficult to power 2 views from one model, see https://github.com/phetsims/phet-io/issues/1688#issuecomment-1032967603
    // Therefore, we introduce a minimial model element for the cards, so they can be managed by the state
    this.cardModelGroup = new PhetioGroup<CardModel>( ( tandem, casObject ) => {
      assert && assert( casObject, 'casObject should be defined' );
      return new CardModel( casObject, {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( CardModel.CardModelIO ),
      tandem: options.tandem.createTandem( 'cardModelGroup' )
    } );

    this.numberCardGroup = new PhetioGroup<CardNode>( ( tandem, cardModel ) => {
      return new CardNode( cardModel.casObject, new Vector2( 0, 0 ), () => this.getDragRange(), {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'numberCardNodeGroup' ),
      supportsDynamicState: false
    } );

    // TODO: Redraw as real u bars
    this.medianBarsNode = new Rectangle( 0, 0, 200, 10, {
      fill: Color.RED
    } );
    // this.addChild( this.medianBarsNode );

    // TODO: If we eventually have a model PhetioGroup for the cards, we will listen to them instead.
    const objectCreatedListener = this.createObjectCreatedListener();
    model.objectGroup.forEach( objectCreatedListener );
    model.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    this.cardModelGroup.elementDisposedEmitter.addListener( cardModel => {
      const cardNode = this.getNumberCardNode( cardModel.casObject );

      // cardNode may not exist if the ball was still in the air
      if ( cardNode ) {
        this.numberCardGroup.disposeElement( cardNode );
      }
    } );

    model.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {
        this.sortData();
      }
    } );

    this.cardModelGroup.elementCreatedEmitter.addListener( cardModel => {

      // TODO: Get rid of type annotation once PhetioGroup is TS
      const cardNode: CardNode = this.numberCardGroup.createCorrespondingGroupElement( cardModel.tandem.name, cardModel );
      this.addChild( cardNode );

      // Update the position of all cards (via animation) whenever any card is dragged
      cardNode.positionProperty.link( this.createDragPositionListener( cardNode ) );

      // When a card is dropped, send it to its home cell
      cardNode.dragListener.isPressedProperty.link( isPressed => {
        if ( !isPressed && !phet.joist.sim.isSettingPhetioStateProperty.value ) {
          this.sendToHomeCell( cardNode, true, 0.2 );
        }
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
      }
    } );
  }

  // Listen for when objects are created, also called for pre-existing objects.
  createObjectCreatedListener() {
    const objectCreatedListener = ( casObject: CASObject ) => {

      const listener = ( value: number | null ) => {

        if ( value !== null && !this.getNumberCardNode( casObject ) ) {

          // if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
          this.cardModelGroup.createNextElement( casObject );

          // Only create the card once, then no need to listen further
          casObject.valueProperty.unlink( listener );
          // }
        }
      };
      casObject.valueProperty.link( listener );

      // A ball landed OR a value changed
      casObject.valueProperty.link( value => {
        if ( this.model.isSortingDataProperty.value && value !== null ) {
          this.sortData();
        }
      } );
    };
    return objectCreatedListener;
  }

  step( dt: number ): void {

    // TODO: the median bars working
    // this.medianBarsNode.visible = this.isDataSorted() && this.cardNodeCells.length > 0;
    //
    // if ( this.medianBarsNode.visible ) {
    //   this.medianBarsNode.center =
    //     this.cardNodeCells[ Utils.roundSymmetric( this.cardNodeCells.length / 2 ) ].centerBottom.plusXY( 0, 10 );
    // }
  }

  // The listener which is linked to the cardNode.positionProperty
  createDragPositionListener( cardNode: CardNode ): ( position: Vector2 ) => void {
    return ( position: Vector2 ) => {
      if ( cardNode.dragListener.isPressedProperty.value ) {

        const originalCell = this.cardNodeCells.indexOf( cardNode );

        // Find the closest cell to the dragged card
        const closestCell = this.getClosestCell( position.x );

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
        }
      }
    };
  }

  /**
   * Check if all of the data is in order, by using the cells associated with the card node.  Note that means
   * it is using the cell the card may be animating to.
   */
  isDataSorted() {
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

  sendToHomeCell( cardNode: CardNode, animate = true, duration = 0.3 ): void {
    const homeIndex = this.cardNodeCells.indexOf( cardNode );
    const homePosition = new Vector2( getCardPositionX( homeIndex ), 0 );

    if ( animate ) {
      cardNode.animateTo( homePosition, duration );
    }
    else {
      cardNode.positionProperty.value = homePosition;
    }
  }

  /**
   * Find the cell the dragged card is closest to
   */
  getClosestCell( x: number ): number {
    if ( this.cardNodeCells.length === 0 ) {
      return 0;
    }
    else {
      const cellIndices = _.range( this.cardNodeCells.length );
      return _.minBy( cellIndices, index => Math.abs( x - getCardPositionX( index ) ) )!;
    }
  }

  getNumberCardNode( casObject: CASObject ): CardNode | null {
    return this.cardNodeCells.find( cardNode => cardNode.casObject === casObject ) || null;
  }

  sortData(): void {

    // If the card is visible, the value property should be non-null
    const sorted = _.sortBy( this.cardNodeCells, cardNode => cardNode.casObject.valueProperty.value );
    this.cardNodeCells.length = 0;
    this.cardNodeCells.push( ...sorted );

    this.cardNodeCells.forEach( cardNode => {
      this.sendToHomeCell( cardNode, true, 0.5 );
    } );
  }

  getDragRange(): Range {
    const maxX = this.cardNodeCells.length > 0 ? getCardPositionX( this.cardNodeCells.length - 1 ) : 0;
    return new Range( 0, maxX );
  }

  reset(): void {
    this.cardNodeCells.length = 0;
    this.numberCardGroup.clear();
    this.cardModelGroup.clear();
  }
}

// Track the order of the cards as self-state, so that the downstream sim can get the cards in the desired cells
const CardNodeReferenceIO = ReferenceIO( Node.NodeIO );
const NumberCardContainerIO = new IOType( 'NumberCardContainerIO', {
  valueType: NumberCardContainer,
  toStateObject: ( n: NumberCardContainer ) => {
    return {
      cardNodes: n.cardNodeCells.map( cardNode => CardNodeReferenceIO.toStateObject( cardNode ) )
    };
  },
  applyState: ( n: NumberCardContainer, state: any ) => {
    const cardNodes = state.cardNodes.map( ( element: any ) => CardNodeReferenceIO.fromStateObject( element ) );
    n.cardNodeCells.length = 0;
    n.cardNodeCells.push( ...cardNodes );
    n.cardNodeCells.forEach( cardNode => {
      n.sendToHomeCell( cardNode, false );
    } );
  },
  stateSchema: {
    cardNodes: ArrayIO( ReferenceIO( CardNodeReferenceIO ) )
  }
} );

centerAndSpread.register( 'NumberCardContainer', NumberCardContainer );
export default NumberCardContainer;