// Copyright 2022, University of Colorado Boulder

/**
 * Manages creation, dragging, positioning of NumberCardNode instances.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASModel from '../model/CASModel.js';
import CASObject from '../model/CASObject.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import NumberCardNode from './NumberCardNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';

// constants
const CARD_SPACING = 10;

type NumberCardContainerSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class NumberCardContainer extends Node {
  private cardNodeCells: NumberCardNode[];

  constructor( model: CASModel, providedOptions?: NumberCardOptions ) {

    const options = optionize<NumberCardOptions, NumberCardContainerSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    // Each card is associated with one "cell", no two cards can be associated with the same cell.  The leftmost cell is 0.
    // The cells linearly map to locations across the screen.
    this.cardNodeCells = [];

    const numberCardGroup = new PhetioGroup<NumberCardNode>( ( tandem, casObject ) => {
      return new NumberCardNode( casObject, new Vector2( 0, 0 ), () => this.getDragRange(), {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'numberCardNodeGroup' ),
      supportsDynamicState: false
    } );

    // TODO: If we eventually have a model PhetioGroup for the cards, we will listen to them instead.
    const objectCreatedListener = ( casObject: CASObject ) => {

      const listener = ( value: number | null ) => {

        if ( value !== null && !this.getCardNode( casObject ) ) {

          // TODO: Get rid of type annotation once PhetioGroup is TS
          // TODO: Compute the correct cell index on init
          const numberCardNode: NumberCardNode = numberCardGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject );
          this.addChild( numberCardNode );

          // Update the position of all cards (via animation) whenever any card is dragged
          numberCardNode.positionProperty.link( position => {
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
                this.sendToHomeCell( currentOccupant );
              }
            }
          } );

          // When a card is dropped, send it to its home cell
          numberCardNode.dragListener.isPressedProperty.link( isPressed => {
            if ( !isPressed ) {
              this.sendToHomeCell( numberCardNode );
            }
          } );

          // TODO: Better logic around this positioning.  This is so it sorts last.
          // TODO: It would be better to sort it into the nearest open spot, even if the user dragged a card far to the right.

          let targetIndex = this.cardNodeCells.length;
          if ( model.isSortingDataProperty.value ) {
            const newValue = numberCardNode.casObject.valueProperty.value!;
            const existingLowerCardNodes = this.cardNodeCells.filter( cardNode => cardNode.casObject.valueProperty.value! <= newValue );

            const lowerNeighborCardNode = _.maxBy( existingLowerCardNodes, cardNode => this.cardNodeCells.indexOf( cardNode ) );
            targetIndex = lowerNeighborCardNode ? this.cardNodeCells.indexOf( lowerNeighborCardNode ) + 1 : 0;
          }

          this.cardNodeCells.splice( targetIndex, 0, numberCardNode );
          this.sendToHomeCell( numberCardNode, false );

          // TODO: Do we still need this??
          numberCardNode.positionProperty.value = numberCardNode.translation;

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
        if ( model.isSortingDataProperty.value && value !== null ) {
          this.sortData();
        }
      } );
    };
    model.objectGroup.forEach( objectCreatedListener );
    model.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const viewNode = this.getCardNode( casObject );

      // TODO: This is failing in the PhET-iO state wrapper.
      // TODO: Solve this by creating CardModelElements which are stateful.  This will solve the problem
      // because the state-setting order defers all properties until after groups are set.
      // TODO: We tried workarounds in PropertyStateHandler#61 with dontDefer, but that isn't general

      // viewNode may not exist if the ball was still in the air
      if ( viewNode ) {
        numberCardGroup.disposeElement( viewNode );
      }
    } );

    model.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {
        this.sortData();
      }
    } );
  }

  sendToHomeCell( numberCardNode: NumberCardNode, animate: boolean = true ) {
    const homeIndex = this.cardNodeCells.indexOf( numberCardNode );
    const homePosition = new Vector2( getCardPositionX( homeIndex ), 0 );

    if ( animate ) {
      numberCardNode.animateTo( homePosition, 0.5 );
    }
    else {
      numberCardNode.positionProperty.value = homePosition;
    }
  }

  getClosestCell( x: number ) {

    // Find the spot the dragged card is closest to
    let bestMatch = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for ( let i = 0; i < this.cardNodeCells.length; i++ ) {
      const proposedX = getCardPositionX( i );
      const distance = Math.abs( x - proposedX );
      if ( distance < bestDistance ) {
        bestMatch = i;
        bestDistance = distance;
      }
    }

    return bestMatch;
  }

  getCardNode( casObject: CASObject ) {
    return this.cardNodeCells.find( cardNode => cardNode.casObject === casObject );
  }

  sortData() {

    // If the card is visible, the value property should be non-null
    const sorted = _.sortBy( this.cardNodeCells, cardNode => cardNode.casObject.valueProperty.value );
    this.cardNodeCells.length = 0;
    this.cardNodeCells.push( ...sorted );

    this.cardNodeCells.forEach( numberCardNode => {
      this.sendToHomeCell( numberCardNode );
    } );
  }

  getDragRange() {
    const maxX = this.cardNodeCells.length > 0 ? getCardPositionX( this.cardNodeCells.length - 1 ) : 0;
    return new Range( 0, maxX );
  }

  reset() {
    this.cardNodeCells.length = 0;
  }
}

const distanceBetweenCards = NumberCardNode.CARD_WIDTH + CARD_SPACING;
const getCardPositionX = ( index: number ) => index * distanceBetweenCards;

centerAndSpread.register( 'NumberCardContainer', NumberCardContainer );
export default NumberCardContainer;