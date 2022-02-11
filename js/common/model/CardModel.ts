// Copyright 2022, University of Colorado Boulder

/**
 * Minimal model element for each CardNode, in order to support PhET-iO State.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import CASObject from './CASObject.js';
import centerAndSpread from '../../centerAndSpread.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';

const CASObjectReferenceIO = ReferenceIO( CASObject.CASObjectIO );

class CardModel extends PhetioObject {

  casObject: CASObject;
  static CardModelIO: IOType;

  constructor( casObject: CASObject, options?: { tandem: Tandem } ) {

    // @ts-ignore
    options.phetioType = CardModel.CardModelIO;
    super( options );
    this.casObject = casObject;
  }
}

CardModel.CardModelIO = new IOType( 'CardModelIO', {
  valueType: CardModel,
  toStateObject: ( cardModel: CardModel ) => CASObjectReferenceIO.toStateObject( cardModel.casObject ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ CASObjectReferenceIO.fromStateObject( stateObject ) ];
  },
  stateSchema: {
    phetioID: StringIO
  }
} );

centerAndSpread.register( 'CardModel', CardModel );
export default CardModel;