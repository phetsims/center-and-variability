// Copyright 2022-2023, University of Colorado Boulder

/**
 * Manages creation, dragging, positioning of CardNode instances.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { InteractiveHighlightingNode, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import CardNode, { PICK_UP_DELTA_X, PICK_UP_DELTA_Y } from './CardNode.js';
import Panel from '../../../../sun/js/Panel.js';
import CAVConstants from '../../common/CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import CardContainerModel from '../model/CardContainerModel.js';
import CardModel from '../model/CardModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

export type CardNodeContainerOptions = EmptySelfOptions & NodeOptions;

export const CARD_LAYER_OFFSET = CAVConstants.CARD_SPACING / 2 - MedianBarNode.HALF_SPLIT_WIDTH + MedianBarNode.LINE_WIDTH;

export default class CardNodeContainer extends InteractiveHighlightingNode {
  protected readonly model: CardContainerModel;
  public readonly cardNodes: CardNode[];
  protected readonly cardMap = new Map<CardModel, CardNode>();
  protected readonly medianBarNode = new MedianBarNode( {
    barStyle: 'split'
  } );

  // Add padding to the card layer to give space for the medianBarNode
  protected readonly cardLayer = new Node( { x: CARD_LAYER_OFFSET } );

  public constructor( model: CardContainerModel,
                      protected readonly sceneModel: CAVSoccerSceneModel,
                      protected readonly medianVisibleProperty: Property<boolean>,
                      providedOptions: CardNodeContainerOptions ) {

    const options = optionize<CardNodeContainerOptions, EmptySelfOptions, NodeOptions>()( {
      phetioInputEnabledPropertyInstrumented: true,
      focusable: true,
      tagName: 'div',
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      isDisposable: false
    }, providedOptions );

    super( options );

    this.model = model;

    // Allocate all the cards at start-up. Each card node must be associated with a card model.
    this.cardNodes = model.cards.map( ( cardModel, index ) => {
      const cardNode = new CardNode( cardModel, {
        tandem: options.tandem?.createTandem( 'cardNodes' ).createTandem1Indexed( 'cardNode', index )
      } );

      this.cardMap.set( cardNode.model, cardNode );

      this.cardLayer.addChild( cardNode );
      return cardNode;
    } );

    this.addChild( this.medianBarNode );
    this.addChild( this.cardLayer );

    const medianTextNode = new Text( new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty, { value: this.sceneModel.medianValueProperty }, {
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
      cornerRadius: 4
    } );
    this.addChild( medianReadoutText );

    const updateMedianNode = () => {

      const cardCells = model.getCardsInCellOrder();
      const leftmostCard = this.cardMap.get( cardCells[ 0 ] );

      const MARGIN_X = CAVConstants.CARD_SPACING / 2 + MedianBarNode.HALF_SPLIT_WIDTH;

      // Distance between the top card to the median bar when the card is not being held
      const MARGIN_Y = PICK_UP_DELTA_Y - 3;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( leftmostCard && ( ( this.medianVisibleProperty.value && model.isDataSorted() ) || model.parentContext === 'info' ) ) {
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
        const centerX = model.getCardPositionX( ( cardCells.length - 1 ) / 2 ) + leftmostCard.width / 2;

        if ( model.parentContext === 'accordion' ) {
          medianReadoutText.centerX = centerX + PICK_UP_DELTA_X;
          if ( medianReadoutText.left < 0 ) {
            medianReadoutText.left = 0;
          }
        }
        else {
          medianReadoutText.centerX = centerX;
        }

        medianReadoutText.bottom = MARGIN_Y - 5;
        medianReadoutText.visible = this.medianVisibleProperty.value || model.parentContext === 'info';
      }
      else {
        medianReadoutText.visible = false;
      }
    };
    model.cardCellsChangedEmitter.addListener( updateMedianNode );
    this.sceneModel.medianValueProperty.link( updateMedianNode );
    this.medianVisibleProperty.link( updateMedianNode );
    this.sceneModel.objectChangedEmitter.addListener( updateMedianNode );
    medianTextNode.boundsProperty.link( updateMedianNode );

    // Only for info Dialog.
    this.pickable = false;
  }

  protected getActiveCardNodesInOrder(): CardNode[] {
    return this.model.getCardsInCellOrder().map( card => this.cardMap.get( card )! );
  }
}

centerAndVariability.register( 'CardNodeContainer', CardNodeContainer );