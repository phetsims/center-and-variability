// Copyright 2022, University of Colorado Boulder

/**
 * Minimal model element for each CardNode, in order to support PhET-iO State.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import CAVObject from './CAVObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CAVObjectType from './CAVObjectType.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const CAVObjectReferenceIO = ReferenceIO( CAVObject.CAVObjectIO );

type SelfOptions = EmptySelfOptions;
type CardModelOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class CardModel extends PhetioObject {

  public casObject: CAVObject;
  public static CardModelIO: IOType;

  public constructor( casObject: CAVObject, providedOptions?: CardModelOptions ) {

    const options = optionize<CardModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: CardModel.CardModelIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );
    this.casObject = casObject;

    this.addLinkedElement( casObject, {
      tandem: options.tandem.createTandem( casObject.objectType === CAVObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' )
    } );
  }
}

CardModel.CardModelIO = new IOType( 'CardModelIO', {
  valueType: CardModel,
  toStateObject: ( cardModel: CardModel ) => CAVObjectReferenceIO.toStateObject( cardModel.casObject ),
  stateToArgsForConstructor: ( stateObject: ReferenceIOState ) => {
    return [ CAVObjectReferenceIO.fromStateObject( stateObject ) ];
  },
  stateSchema: {
    phetioID: StringIO
  }
} );

centerAndVariability.register( 'CardModel', CardModel );
export default CardModel;