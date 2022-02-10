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
  private readonly cardNodeMap: Map<CASObject, NumberCardNode>;

  constructor( model: CASModel, providedOptions?: NumberCardOptions ) {

    const options = optionize<NumberCardOptions, NumberCardContainerSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.cardNodeMap = new Map<CASObject, NumberCardNode>();

    const getDragRange = () => {
      const numberCardNodes = this.getVisibleNumberCardNodes();
      const maxX = numberCardNodes.length > 0 ? getCardPositionX( numberCardNodes.length - 1 ) : 0;
      return new Range( 0, maxX );
    };

    const numberCardGroup = new PhetioGroup<NumberCardNode>( ( tandem, casObject ) => {
      return new NumberCardNode( casObject, new Vector2( 0, 0 ), getDragRange, {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'numberCardNodeGroup' ),
      supportsDynamicState: false
    } );

    // TODO: If we eventually have a model PhetioGroup for the cards, we will listen to them instead.
    const objectCreatedListener = ( casObject: CASObject ) => {

      // TODO: Get rid of type annotation once PhetioGroup is TS
      const numberCardNode: NumberCardNode = numberCardGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject );
      numberCardNode.visible = false;
      this.addChild( numberCardNode );
      this.cardNodeMap.set( casObject, numberCardNode );

      numberCardNode.positionProperty.link( position => {

        // Update the position of all cards (via animation) whenever any card is dragged
        numberCardNode.dragListener.isPressedProperty.value && this.updateDroppedCardPositions();
      } );
      numberCardNode.dragListener.isPressedProperty.link( isPressed => {
        if ( !isPressed ) {
          this.updateDroppedCardPositions();
        }
      } );

      const listener = ( value: number | null ) => {
        if ( value !== null ) {

          // TODO: Better logic around this positioning.  This is so it sorts last.
          // TODO: It would be better to sort it into the nearest open spot, even if the user dragged a card far to the right.

          let positionX = getCardPositionX( this.getVisibleNumberCardNodes().length ) + distanceBetweenCards / 2;
          if ( model.isSortingDataProperty.value ) {
            const newValue = numberCardNode.casObject.valueProperty.value!;
            const existingCardNodesWithValue = this.getVisibleNumberCardNodes().filter(
              cardNode => cardNode.casObject.valueProperty.value! <= newValue );

            const sameValueCards = existingCardNodesWithValue.map( cardNode => cardNode.positionProperty.value.x );
            const largestXValue = sameValueCards.length > 0 ? _.max( sameValueCards ) : -10000;

            positionX = largestXValue! + distanceBetweenCards / 2;
          }
          numberCardNode.positionProperty.value = new Vector2( positionX, 0 );

          numberCardNode.visible = true;
          this.updateDroppedCardPositions( [ numberCardNode ] );
          numberCardNode.positionProperty.value = numberCardNode.translation;

          // Only show the card at the moment valueProperty becomes non-null.  After that, the card updates but is
          // always visible.
          casObject.valueProperty.unlink( listener );
        }
      };
      casObject.valueProperty.link( listener );

      // A ball landed OR a value changed
      numberCardNode.casObject.valueProperty.link( value => {
        if ( model.isSortingDataProperty.value && value !== null ) {
          sortData();
        }
      } );
    };
    model.objectGroup.forEach( objectCreatedListener );
    model.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const viewNode = this.cardNodeMap.get( casObject )!;

      // TODO: This is failing in the PhET-iO state wrapper.
      // TODO: Solve this by creating CardModelElements which are stateful.  This will solve the problem
      // because the state-setting order defers all properties until after groups are set.
      // TODO: We tried workarounds in PropertyStateHandler#61 with dontDefer, but that isn't general

      // viewNode may not exist if the ball was still in the air
      if ( viewNode ) {
        numberCardGroup.disposeElement( viewNode );
      }
    } );

    const sortData = () => {
      const visibleCardNodes = this.getVisibleNumberCardNodes();

      // If the card is visible, the value property should be non-null
      const sorted = _.sortBy( visibleCardNodes, cardNode => cardNode.casObject.valueProperty.value );

      for ( let i = 0; i < sorted.length; i++ ) {
        const cardNode = sorted[ i ];

        const destination = new Vector2( getCardPositionX( i ), 0 );

        // speed = distance/time
        // time = distance/speed
        const time = 0.4;
        cardNode.animateTo( destination, time );
      }
    };

    model.isSortingDataProperty.link( isSortingData => {
      if ( isSortingData ) {
        sortData();
      }
    } );
  }

  // TODO: Improve handling around "cells" -- NumberCards knowing which spot each card occupies
  /**
   * Animate all non-dragged cards to the nearest open cell, while leaving the spot closest to any dragged cards 
   * available.
   * 
   * @param cardsToImmediatelyMove
   */
  updateDroppedCardPositions( cardsToImmediatelyMove: NumberCardNode[] = [] ) {

    // Only consider the visible cards
    const numberCardNodes = this.getVisibleNumberCardNodes();
    if ( numberCardNodes.length > 0 ) {

      const sorted = _.sortBy( numberCardNodes, this.sortRule.bind( this ) );
      for ( let i = 0; i < sorted.length; i++ ) {
        if ( !sorted[ i ].dragListener.isPressed ) {

          const cardNode = sorted[ i ];

          const destination = new Vector2( getCardPositionX( i ), 0 );

          if ( cardsToImmediatelyMove.includes( cardNode ) ) {
            cardNode.positionProperty.value = destination;
          }
          else {
            cardNode.animateTo( destination, 0.3 );
          }
        }
      }
    }
  }

  getVisibleNumberCardNodes() {
    return Array.from( this.cardNodeMap.values() ).filter( cardNode => cardNode.casObject.valueProperty.value !== null );
  }

  sortRule( cardNode: NumberCardNode ) {

    if ( cardNode.dragListener.isPressed ) {

      // Find the spot the dragged card is closest to
      let bestMatch = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      for ( let i = 0; i < this.getVisibleNumberCardNodes().length; i++ ) {
        const proposedX = getCardPositionX( i );
        const distance = Math.abs( cardNode.positionProperty.value.x - proposedX );
        if ( distance < bestDistance ) {
          bestMatch = proposedX;
          bestDistance = distance;
        }
      }

      if ( cardNode.dragListener.isPressed ) {

        // Dragging to the right
        if ( cardNode.positionProperty.value.x < bestMatch ) {

          // To break the tie, give precedence to the dragged card
          bestMatch += 1E-6;
        }
        else {

          // dragging to the left
          bestMatch -= 1E-6;
        }
      }
      return bestMatch;
    }
    else {
      if ( cardNode.animationTo ) {
        return cardNode.animationTo.x;
      }
      else {
        return cardNode.positionProperty.value.x;
      }
    }
  }

  reset() {
    this.cardNodeMap.clear();
  }
}

const distanceBetweenCards = NumberCardNode.CARD_WIDTH + CARD_SPACING;
const getCardPositionX = ( index: number ) => index * distanceBetweenCards;

centerAndSpread.register( 'NumberCardContainer', NumberCardContainer );
export default NumberCardContainer;