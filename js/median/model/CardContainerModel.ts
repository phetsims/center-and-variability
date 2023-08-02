// Copyright 2023, University of Colorado Boulder

/**
 * Model for the cardContainerNode. Creates card models, tracks their position and order in the accordionBox and infoDialog,
 * handles step animation and cardMovementSounds.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import centerAndVariability from '../../centerAndVariability.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVQueryParameters from '../../common/CAVQueryParameters.js';
import CardModel from './CardModel.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import cardMovement1_mp3 from '../../../sounds/cardMovement1_mp3.js';
import cardMovement2_mp3 from '../../../sounds/cardMovement2_mp3.js';
import cardMovement3_mp3 from '../../../sounds/cardMovement3_mp3.js';
import cardMovement4_mp3 from '../../../sounds/cardMovement4_mp3.js';
import cardMovement5_mp3 from '../../../sounds/cardMovement5_mp3.js';
import cardMovement6_mp3 from '../../../sounds/cardMovement6_mp3.js';
import MedianModel from './MedianModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const cardMovementSounds = [
  cardMovement1_mp3,
  cardMovement2_mp3,
  cardMovement3_mp3,
  cardMovement4_mp3,
  cardMovement5_mp3,
  cardMovement6_mp3
];

export const cardMovementSoundClips = cardMovementSounds.map( sound => new SoundClip( sound, {
  initialOutputLevel: 0.2,
  additionalAudioNodes: []
} ) );
cardMovementSoundClips.forEach( soundClip => soundManager.addSoundGenerator( soundClip ) );

type SelfOptions = {

  // accordionBox is the full-featured interactive version with drag input and sound effects
  // info is the non-interactive version used in the info dialog
  parentContext: 'info' | 'accordion';
};

type CardContainerModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem' > &
  StrictOmit<PhetioObjectOptions, 'phetioType' | 'phetioState'>;

export default class CardContainerModel extends PhetioObject {

  // Fires if the cardCells may have changed
  public readonly cardCellsChangedEmitter: TEmitter = new Emitter<[]>();

  // All cards are created on start-up
  public readonly cards: CardModel[];

  // For sonification, order the active, non-displaced cards appeared in the last step
  private lastStepOrder: CardModel[] = [];

  public readonly parentContext: 'info' | 'accordion';

  // Indicates whether the user has ever dragged a card. It's used to hide the drag indicator arrow after
  // the user dragged a card
  public readonly hasDraggedCardProperty: TReadOnlyProperty<boolean>;
  public readonly dragIndicationCardProperty: Property<CardModel | null>;
  public readonly totalDragDistanceProperty: Property<number>;
  public readonly hasKeyboardMovedCardProperty = new BooleanProperty( false );
  public readonly numActiveCardsProperty: Property<number>;

  public constructor( medianModel: MedianModel, providedOptions: CardContainerModelOptions ) {

    const options = optionize<CardContainerModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: CardContainerModel.CardContainerModelIO,
      phetioState: false
    }, providedOptions );

    super( options );

    this.parentContext = options.parentContext;

    // Accumulated card drag distance, for purposes of hiding the drag indicator node
    this.totalDragDistanceProperty = new NumberProperty( 0 );

    this.hasDraggedCardProperty = new DerivedProperty( [ this.totalDragDistanceProperty, this.hasKeyboardMovedCardProperty ], ( totalDragDistance, hasKeyboardMovedCard ) => {
      return totalDragDistance > 15 || hasKeyboardMovedCard;
    } );

    this.dragIndicationCardProperty = new Property<CardModel | null>( null, {
      phetioReadOnly: true,
      phetioValueType: NullableIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: this.parentContext === 'accordion' ? options.tandem.createTandem( 'dragIndicationCardProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Tracks which card the drag indication icon is pointing to. This is for internal use only.'
    } );

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
        if ( isActive && !isSettingPhetioStateProperty.value ) {
          const cardCells = this.getCardsInCellOrder();
          this.numActiveCardsProperty.value = cardCells.length;
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

    if ( options.parentContext === 'accordion' ) {
      this.cardCellsChangedEmitter.addListener( () => {
        medianModel.areCardsSortedProperty.value = this.isDataSorted();
      } );

      const updateDragIndicationCardProperty = () => {

        const leftCard = this.getCardsInCellOrder()[ 0 ];
        const rightCard = this.getCardsInCellOrder()[ 1 ];

        // if the user has not yet dragged a card and there are multiple cards showing, fade in the drag indicator
        if ( !this.hasDraggedCardProperty.value && leftCard && rightCard ) {
          this.dragIndicationCardProperty.value = leftCard;
        }

        // if the user has dragged a card and the hand indicator is showing, fade the hand indicator out
        if ( this.hasDraggedCardProperty.value || !leftCard || !rightCard ) {
          this.dragIndicationCardProperty.value = null;
        }
      };

      this.cardCellsChangedEmitter.addListener( updateDragIndicationCardProperty );
      this.hasDraggedCardProperty.link( updateDragIndicationCardProperty );
      this.cards.forEach( card => card.soccerBall.valueProperty.lazyLink( updateDragIndicationCardProperty ) );
    }

    medianModel.selectedSceneModelProperty.value.resetEmitter.addListener( () => {
      this.totalDragDistanceProperty.reset();
      this.hasKeyboardMovedCardProperty.reset();
    } );
  }

  public getDragRange( this: CardContainerModel ): Range {
    const cardCells = this.getCardsInCellOrder();
    const maxX = cardCells.length > 0 ? this.getCardPositionX( cardCells.length - 1 ) : 0;
    return new Range( 0, maxX );
  }

  public getCardPositionX( index: number ): number {
    return index * ( CAVConstants.CARD_DIMENSION + CAVConstants.CARD_SPACING );
  }

  /**
   * Play sound effects whenever two cards pass each other. If the user is dragging it, that card gets precedence for choosing the pitch.
   * Moving to the right is a higher pitch. If one card animates past another, that movement direction chooses the pitch.
   * If both cards are animating, use an in-between pitch.
   */
  public step( dt: number ): void {

    // Only consider cards that landed more than 0.1 seconds ago, to avoid an edge case that was mistakenly playing audio when soccer balls land
    const activeCards = this.cards.filter( card => card.isActiveProperty.value && card.timeSinceLanded > 0.1 && card.animationReason !== 'valueChanged' );

    // Determine the sort order to see which cards have swapped
    const newOrder = _.sortBy( activeCards, card => card.positionProperty.value.x );

    // Consider only cards which are both in the old and new lists
    const oldList = this.lastStepOrder.filter( cardNode => newOrder.includes( cardNode ) );
    const newList = newOrder.filter( cardNode => this.lastStepOrder.includes( cardNode ) );

    const swappedPairs: Array<{ first: CardModel; second: CardModel; direction: string }> = [];

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
      const directionToPlayFromInteraction = pair.first.isDraggingProperty.value && !pair.second.isDraggingProperty.value ? pair.direction :
                                             pair.second.isDraggingProperty.value && !pair.first.isDraggingProperty.value ? opposite( pair.direction ) :
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

    this.getCardsInCellOrder().forEach( card => {
      card.timeSinceLanded += dt;
    } );
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
    return _.sortBy( cardsInCells, ( card => card.indexProperty.value ) );
  }

  public sortData( animationReason: 'valueChanged' | null = null ): void {
    // If the card is visible, the value property should be non-null
    const sorted = _.sortBy( this.getCardsInCells(), card => card.soccerBall.valueProperty.value );
    sorted.forEach( ( card, index ) => {
      card.indexProperty.value = index;
      this.animateToHomeCell( card, 0.5, animationReason );
    } );
    this.cardCellsChangedEmitter.emit();
  }

  /**
   * Check if all of the data is in order, by using the cells associated with the card node.  Note that means
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
          const sorted = _.sortBy( this.getCardsInCells(), ( card => card.indexProperty.value ) );
          return sorted.map( card => card.soccerBall.valueProperty.value );
        },
        documentation: 'Gets the values of the cards in the order they appear.'
      }
    }
  } );
}

centerAndVariability.register( 'CardContainerModel', CardContainerModel );