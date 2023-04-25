// Copyright 2022-2023, University of Colorado Boulder

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

export default class CardModel extends PhetioObject {

  public cavObject: CAVObject;
  public static readonly CardModelIO = new IOType( 'CardModelIO', {
    valueType: CardModel,
    toStateObject: ( cardModel: CardModel ) => CAVObjectReferenceIO.toStateObject( cardModel.cavObject ),
    stateObjectToCreateElementArguments: ( stateObject: ReferenceIOState ) => {
      return [ CAVObjectReferenceIO.fromStateObject( stateObject ) ];
    },
    stateSchema: {
      phetioID: StringIO
    }
  } );

  public constructor( cavObject: CAVObject, providedOptions?: CardModelOptions ) {

    const options = optionize<CardModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: CardModel.CardModelIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );
    this.cavObject = cavObject;

    this.addLinkedElement( cavObject, {
      tandem: options.tandem.createTandem( cavObject.objectType === CAVObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' )
    } );
  }
}

centerAndVariability.register( 'CardModel', CardModel );