// Copyright 2022-2023, University of Colorado Boulder

/**
 * Minimal model element for each CardNode, in order to support PhET-iO State.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import SoccerBall from '../../soccer-common/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { SoccerBallPhase } from '../../soccer-common/model/SoccerBallPhase.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type CardModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class CardModel extends PhetioObject {

  public readonly soccerBall: SoccerBall;
  public readonly isActiveProperty: TReadOnlyProperty<boolean>;

  public constructor( soccerBall: SoccerBall, providedOptions: CardModelOptions ) {

    const options = optionize<CardModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );

    super( options );
    this.soccerBall = soccerBall;
    this.isActiveProperty = new DerivedProperty( [ soccerBall.soccerBallPhaseProperty ], phase =>
      phase === SoccerBallPhase.STACKED || phase === SoccerBallPhase.STACKING, {
      tandem: options.tandem.createTandem( 'isActiveProperty' ),
      phetioValueType: BooleanIO
    } );

    this.addLinkedElement( this.soccerBall, {
      tandem: options.tandem.createTandem( 'soccerBall' )
    } );
  }
}

centerAndVariability.register( 'CardModel', CardModel );