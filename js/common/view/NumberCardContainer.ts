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
import CASObjectNode from './CASObjectNode.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import NumberCardNode from './NumberCardNode.js';

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

    const numberCardGroup = new PhetioGroup( ( tandem, casObject ) => {
      let x = 0;
      if ( numberCardGroup.countProperty.value > 0 ) {

        // @ts-ignore TODO: Fix types
        const rightmostCard = _.maxBy( numberCardGroup.getArray(), ( card: NumberCardNode ) => card.bounds.maxX )!;
        x = rightmostCard.right + spacing;
      }
      return new NumberCardNode( casObject, {
        x: x,
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'numberCardNodeGroup' ),
      supportsDynamicState: false
    } );

    const map = new Map<CASObject, CASObjectNode>();

    const listenForObjectLanding = ( casObject: CASObject ) => {
      const listener = ( value: number | null ) => {
        if ( value !== null ) {
          const numberCardNode = numberCardGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject, {} );
          this.addChild( numberCardNode );
          map.set( casObject, numberCardNode );

          // Only create the card at the moment valueProperty becomes non-null.  After that, the card updates but new
          // cards are not created
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