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
import CASObjectType from '../model/CASObjectType.js';
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
      tandem: options.tandem.createTandem( model.objectType === CASObjectType.SOCCER_BALL ? 'soccerBallNodeGroup' : 'dataPointNodeGroup' ),
      supportsDynamicState: false
    } );

    const map = new Map<CASObject, CASObjectNode>();

    const listenForObjectLanding = ( casObject: CASObject ) => {
      const listener = ( value: number | null ) => {
        if ( value !== null ) {
          const casObjectNode = numberCardGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject, {} );
          this.addChild( casObjectNode );
          map.set( casObject, casObjectNode );

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
      numberCardGroup.disposeElement( viewNode );
    } );
  }
}

centerAndSpread.register( 'NumberCardContainer', NumberCardContainer );
export default NumberCardContainer;