// Copyright 2023, University of Colorado Boulder

/**
 * CardContainerModel is the core model responsible for managing the behavior and state of cards in a container.
 * It handles card creation, positioning, animations, and interactions within both the accordion box and info dialog.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import centerAndVariability from '../../centerAndVariability.js';
import CardModel from './CardModel.js';

import MedianModel from './MedianModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CAVConstants from '../../common/CAVConstants.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import Emitter from '../../../../axon/js/Emitter.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import RepresentationContext from '../../common/model/RepresentationContext.js';

type SelfOptions = {

  // 'accordionBox': the full-featured interactive version with drag input and sound effects
  // 'info': the non-interactive version used in the info dialog
  parentContext: RepresentationContext;
};

export type CardContainerModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'> &
  StrictOmit<PhetioObjectOptions, 'phetioType' | 'phetioState'>;

export default class CardContainerModel extends PhetioObject {

  // Fires if the cardCells may have changed
  public readonly cardCellsChangedEmitter: TEmitter = new Emitter<[]>();

  // All cards are created on start-up
  public readonly cards: CardModel[];

  public readonly parentContext: 'info' | 'accordion';

  public readonly numActiveCardsProperty: Property<number>;

  public constructor( medianModel: MedianModel, providedOptions: CardContainerModelOptions ) {

    const options = optionize<CardContainerModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: CardContainerModel.CardContainerModelIO,
      phetioState: false,
      isDisposable: false
    }, providedOptions );

    super( options );

    this.parentContext = options.parentContext;
    this.numActiveCardsProperty = new Property<number>( 0 );

    // Allocate all the card models at start-up.
    this.cards = medianModel.selectedSceneModelProperty.value.soccerBalls.map( ( soccerBall, index ) => {
      const card = new CardModel( this, soccerBall, new Vector2( 0, 0 ), {
        tandem: options.tandem.createTandem( 'cards' ).createTandem1Indexed( 'card', index )
      } );

      const removeCardCell = ( card: CardModel ) => {
        this.cardCellsChangedEmitter.emit();
        card.indexProperty.reset();
      };

      card.soccerBall.valueProperty.lazyLink( value => {

        // When a ball's value is null it has been removed from the data set.
        if ( value === null ) {
          removeCardCell( card );
        }

        // A ball landed OR a value changed
        if ( ( medianModel.isSortingDataProperty.value && value !== null ) || options.parentContext === 'info' ) {
          this.sortData( 'valueChanged' );
        }

        if ( options.parentContext === 'accordion' ) {
          medianModel.areCardsSortedProperty.value = this.isDataSorted();
        }
      } );

      card.isActiveProperty.link( isActive => {
        if ( this.cards && !isSettingPhetioStateProperty.value ) {
          this.numActiveCardsProperty.value = this.getCardsInCellOrder().length;
        }

        if ( isActive && !isSettingPhetioStateProperty.value ) {
          const cardCells = this.getCardsInCellOrder();
          let targetIndex = cardCells.length;

          // We want to auto-sort cards in the infoDialog no matter what the value for isSortingDataProperty is.
          if ( medianModel.isSortingDataProperty.value || options.parentContext === 'info' ) {

            const newValue = card.soccerBall.valueProperty.value!;
            const existingLowerCards = cardCells.filter( card => card.soccerBall.valueProperty.value! <= newValue );

            const lowerNeighborCard = _.maxBy( existingLowerCards, card => cardCells.indexOf( card ) );

            if ( lowerNeighborCard !== undefined ) {
              assert && assert( lowerNeighborCard.indexProperty.value !== null, `The lower neighbor must have a valid cell Position. lowerNeighborCellPosition: ${lowerNeighborCard.indexProperty.value}` );
              targetIndex = lowerNeighborCard.indexProperty.value! + 1;
            }
            else {
              targetIndex = 0;
            }
          }

          card.timeSinceLanded = 0;
          card.indexProperty.value = targetIndex;
          this.setAtHomeCell( card );

          // Animate all displaced cards

          // Animate all displaced cards
          for ( let i = targetIndex; i < this.getCardsInCellOrder().length; i++ ) {
            const cardCells = this.getCardsInCellOrder();
            cardCells[ i ].indexProperty.value = i;
            cardCells[ i ].positionProperty.value = cardCells[ i ].positionProperty.value.plusXY( 1, 0 );
            this.animateToHomeCell( cardCells[ i ], 0.3 );
          }

          this.cardCellsChangedEmitter.emit();
        }
        else if ( !isActive ) {
          removeCardCell( card );
        }
      } );

      return card;
    } );
  }

  public getCardPositionX( index: number ): number {
    return index * ( CAVConstants.CARD_DIMENSION + CAVConstants.CARD_SPACING );
  }

  private getHomePosition( card: CardModel ): Vector2 {
    assert && assert( card.indexProperty.value !== null, `The card's cell position cannot be null. indexProperty: ${card.indexProperty.value}` );
    return new Vector2( this.getCardPositionX( card.indexProperty.value! ), 0 );
  }

  public setAtHomeCell( card: CardModel ): void {
    card.positionProperty.value = this.getHomePosition( card );
  }

  public animateToHomeCell( card: CardModel, duration: number, animationReason: 'valueChanged' | null = null ): void {
    card.animateTo( this.getHomePosition( card ), duration, animationReason );
  }

  /**
   * Find the cell the dragged card is closest to
   */
  public getClosestCell( x: number ): number {
    const cardCells = this.getCardsInCellOrder();
    if ( cardCells.length === 0 ) {
      return 0;
    }
    else {
      const cellIndices = _.range( cardCells.length );
      return _.minBy( cellIndices, index => Math.abs( x - this.getCardPositionX( index ) ) )!;
    }
  }

  public getActiveCards(): CardModel[] {
    return this.cards.filter( card => card.isActiveProperty.value );
  }

  /**
   * To be in a cell a card must both be active and have an assigned index
   */
  public getCardsInCells(): CardModel[] {
    return this.getActiveCards().filter( card => card.indexProperty.value !== null );
  }

  public getCardsInCellOrder(): CardModel[] {
    const cardsInCells = this.getCardsInCells();
    return _.sortBy( cardsInCells, card => card.indexProperty.value );
  }

  public sortData( animationReason: 'valueChanged' | null = null ): void {

    // If the card is visible, the value Property should be non-null.
    const cardsSortedByValue = _.sortBy( this.getCardsInCells(), card => card.soccerBall.valueProperty.value );
    cardsSortedByValue.forEach( ( card, index ) => {
      card.indexProperty.value = index;
      this.animateToHomeCell( card, 0.5, animationReason );
    } );
    this.cardCellsChangedEmitter.emit();
  }

  /**
   * Check if all the data is in order, by using the cells associated with the card node.  Note that means
   * it is using the cell the card may be animating to.
   */
  public isDataSorted(): boolean {
    const cardCells = this.getCardsInCellOrder();
    for ( let i = 1; i < cardCells.length; i++ ) {
      const previousValue = cardCells[ i - 1 ].soccerBall.valueProperty.value;
      const value = cardCells[ i ].soccerBall.valueProperty.value;

      if ( previousValue !== null && value !== null && value < previousValue ) {
        return false;
      }
    }
    return true;
  }

  private static CardContainerModelIO = new IOType( 'CardContainerModelIO', {
    valueType: CardContainerModel,
    methods: {
      getData: {
        returnType: ArrayIO( NumberIO ),
        parameterTypes: [],
        implementation: function( this: CardContainerModel ) {
          return this.getCardsInCellOrder().map( card => card.soccerBall.valueProperty.value );
        },
        documentation: 'Gets the values of the cards in the order they appear.'
      }
    }
  } );
}

centerAndVariability.register( 'CardContainerModel', CardContainerModel );