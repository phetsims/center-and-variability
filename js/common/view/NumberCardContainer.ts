// Copyright 2022, University of Colorado Boulder

/**
 * Manages creation, dragging, positioning of NumberCardNode instances.
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
import NumberCardNode from './NumberCardNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const CARD_SPACING = 10;
const getCardPositionX = ( index: number ) => index * ( NumberCardNode.CARD_WIDTH + CARD_SPACING );

type NumberCardContainerSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class NumberCardContainer extends Node {
  private readonly cardNodeCells: NumberCardNode[];
  private readonly model: CASModel;
  private readonly numberCardGroup: PhetioGroup<NumberCardNode>;
  private readonly areCardsSortedProperty: BooleanProperty;
  private readonly medianBarsNode: Node;

  constructor( model: CASModel, providedOptions?: NumberCardOptions ) {

    const options = optionize<NumberCardOptions, NumberCardContainerSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.model = model;

    // Each card is associated with one "cell", no two cards can be associated with the same cell.  The leftmost cell is 0.
    // The cells linearly map to locations across the screen.
    this.cardNodeCells = [];

    this.areCardsSortedProperty = new BooleanProperty( false );

    this.numberCardGroup = new PhetioGroup<NumberCardNode>( ( tandem, casObject ) => {
      return new NumberCardNode( casObject, new Vector2( 0, 0 ), () => this.getDragRange(), {
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
    this.addChild( this.medianBarsNode );

    // TODO: If we eventually have a model PhetioGroup for the cards, we will listen to them instead.
    const objectCreatedListener = this.createObjectCreatedListener();
    model.objectGroup.forEach( objectCreatedListener );
    model.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const numberCardNode = this.getNumberCardNode( casObject );

      // TODO: This is failing in the PhET-iO state wrapper.
      // TODO: Solve this by creating CardModelElements which are stateful.  This will solve the problem
      // because the state-setting order defers all properties until after groups are set.
      // TODO: We tried workarounds in PropertyStateHandler#61 with dontDefer, but that isn't general

      // numberCardNode may not exist if the ball was still in the air
      if ( numberCardNode ) {
        this.numberCardGroup.disposeElement( numberCardNode );
      }
    } );

    model.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {
        this.sortData();
      }
    } );
  }

  // Listen for when objects are created, also called for pre-existing objects.
  createObjectCreatedListener() {
    const objectCreatedListener = ( casObject: CASObject ) => {

      const listener = ( value: number | null ) => {

        if ( value !== null && !this.getNumberCardNode( casObject ) ) {

          // TODO: Get rid of type annotation once PhetioGroup is TS
          const numberCardNode: NumberCardNode = this.numberCardGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject );
          this.addChild( numberCardNode );

          // Update the position of all cards (via animation) whenever any card is dragged
          numberCardNode.positionProperty.link( this.createDragPositionListener( numberCardNode ) );

          // When a card is dropped, send it to its home cell
          numberCardNode.dragListener.isPressedProperty.link( isPressed => {
            if ( !isPressed ) {
              this.sendToHomeCell( numberCardNode, true, 0.2 );
            }
          } );

          let targetIndex = this.cardNodeCells.length;
          if ( this.model.isSortingDataProperty.value ) {
            const newValue = numberCardNode.casObject.valueProperty.value!;
            const existingLowerCardNodes = this.cardNodeCells.filter( cardNode => cardNode.casObject.valueProperty.value! <= newValue );

            const lowerNeighborCardNode = _.maxBy( existingLowerCardNodes, cardNode => this.cardNodeCells.indexOf( cardNode ) );
            targetIndex = lowerNeighborCardNode ? this.cardNodeCells.indexOf( lowerNeighborCardNode ) + 1 : 0;
          }

          this.cardNodeCells.splice( targetIndex, 0, numberCardNode );
          this.sendToHomeCell( numberCardNode, false );

          // Animate all displaced cards
          for ( let i = targetIndex; i < this.cardNodeCells.length; i++ ) {
            this.sendToHomeCell( this.cardNodeCells[ i ] );
          }

          // Only create the card once, then no need to listen further
          casObject.valueProperty.unlink( listener );
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
    this.medianBarsNode.visible = this.isDataSorted() && this.cardNodeCells.length > 0;

    if ( this.medianBarsNode.visible ) {
      this.medianBarsNode.center =
        this.cardNodeCells[ Utils.roundSymmetric( this.cardNodeCells.length / 2 ) ].centerBottom.plusXY( 0, 10 );
    }
  }

  // The listener which is linked to the numberCardNode.positionProperty
  createDragPositionListener( numberCardNode: NumberCardNode ): ( position: Vector2 ) => void {
    return ( position: Vector2 ) => {
      if ( numberCardNode.dragListener.isPressedProperty.value ) {

        const originalCell = this.cardNodeCells.indexOf( numberCardNode );

        // Find the closest cell to the dragged card
        const closestCell = this.getClosestCell( position.x );

        const currentOccupant = this.cardNodeCells[ closestCell ];

        // No-op if the dragged card is near its home cell
        if ( currentOccupant !== numberCardNode ) {

          // it's just a pairwise swap
          this.cardNodeCells[ closestCell ] = numberCardNode;
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

  sendToHomeCell( numberCardNode: NumberCardNode, animate = true, duration = 0.3 ): void {
    const homeIndex = this.cardNodeCells.indexOf( numberCardNode );
    const homePosition = new Vector2( getCardPositionX( homeIndex ), 0 );

    if ( animate ) {
      numberCardNode.animateTo( homePosition, duration );
    }
    else {
      numberCardNode.positionProperty.value = homePosition;
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

  getNumberCardNode( casObject: CASObject ): NumberCardNode | null {
    return this.cardNodeCells.find( cardNode => cardNode.casObject === casObject ) || null;
  }

  sortData(): void {

    // If the card is visible, the value property should be non-null
    const sorted = _.sortBy( this.cardNodeCells, cardNode => cardNode.casObject.valueProperty.value );
    this.cardNodeCells.length = 0;
    this.cardNodeCells.push( ...sorted );

    this.cardNodeCells.forEach( numberCardNode => {
      this.sendToHomeCell( numberCardNode, true, 0.5 );
    } );
  }

  getDragRange(): Range {
    const maxX = this.cardNodeCells.length > 0 ? getCardPositionX( this.cardNodeCells.length - 1 ) : 0;
    return new Range( 0, maxX );
  }

  reset(): void {
    this.cardNodeCells.length = 0;
  }
}

centerAndSpread.register( 'NumberCardContainer', NumberCardContainer );
export default NumberCardContainer;