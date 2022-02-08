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

type NumberCardContainerSelfOptions = {};
export type NumberCardOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

// constants
const spacing = 5;

class NumberCardContainer extends Node {

  constructor( model: CASModel, providedOptions?: NumberCardOptions ) {

    const options = optionize<NumberCardOptions, NumberCardContainerSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    const numberCardGroup = new PhetioGroup<NumberCardNode>( ( tandem, casObject ) => {
      return new NumberCardNode( casObject, new Vector2( 0, 0 ), {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'numberCardNodeGroup' ),
      supportsDynamicState: false
    } );

    const map = new Map<CASObject, NumberCardNode>();

    // TODO: If we eventually have a model PhetioGroup for the cards, we will listen to them instead.
    const listenForObjectLanding = ( casObject: CASObject ) => {
      const numberCardNode = numberCardGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject, {} );
      numberCardNode.visible = false;
      this.addChild( numberCardNode );
      map.set( casObject, numberCardNode );

      const listener = ( value: number | null ) => {
        if ( value !== null ) {

          let x = 0;
          const visibleCards = numberCardGroup.getArray().filter( cardNode => cardNode.visible );
          if ( visibleCards.length > 0 ) {
            const rightmostCard = _.maxBy( visibleCards, ( card: NumberCardNode ) => card.bounds.maxX )!;
            x = rightmostCard.right + spacing;
          }
          numberCardNode.positionProperty.value = new Vector2( x, 0 );
          numberCardNode.visible = true;

          // Only show the card at the moment valueProperty becomes non-null.  After that, the card updates but is
          // always visible.
          casObject.valueProperty.unlink( listener );
        }
      };
      casObject.valueProperty.link( listener );
    };
    model.objectGroup.forEach( listenForObjectLanding );
    model.objectGroup.elementCreatedEmitter.addListener( listenForObjectLanding );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const viewNode = map.get( casObject )!;

      // TODO: This is failing in the PhET-iO state wrapper.
      // TODO: Solve this by creating CardModelElements which are stateful.  This will solve the problem
      // because the state-setting order defers all properties until after groups are set.
      // TODO: We tried workarounds in PropertyStateHandler#61 with dontDefer, but that isn't general

      // viewNode may not exist if the ball was still in the air
      if ( viewNode ) {
        numberCardGroup.disposeElement( viewNode );
      }
    } );
  }
}

centerAndSpread.register( 'NumberCardContainer', NumberCardContainer );
export default NumberCardContainer;