// Copyright 2022, University of Colorado Boulder

/**
 * Minimal model element for each CardNode, in order to support PhET-iO State.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import CASObject from './CASObject.js';
import centerAndSpread from '../../centerAndSpread.js';
import PhetioObject, { PhetioObjectOptions, RequiredTandem } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CASObjectType from './CASObjectType.js';

const CASObjectReferenceIO = ReferenceIO( CASObject.CASObjectIO );

type CardModelSelfOptions = {};
type CardModelOptions = CardModelSelfOptions & PhetioObjectOptions & RequiredTandem<PhetioObjectOptions>;

class CardModel extends PhetioObject {

  casObject: CASObject;
  static CardModelIO: IOType;

  constructor( casObject: CASObject, providedOptions?: CardModelOptions ) {

    const options = optionize<CardModelOptions, CardModelSelfOptions, PhetioObjectOptions>( {
      phetioType: CardModel.CardModelIO
    }, providedOptions );

    super( options );
    this.casObject = casObject;

    this.addLinkedElement( casObject, {
      tandem: options.tandem.createTandem( casObject.objectType === CASObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' )
    } );
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