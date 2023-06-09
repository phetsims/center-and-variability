// Copyright 2022-2023, University of Colorado Boulder

/**
 * Minimal model element for each CardNode, in order to support PhET-iO State.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import SoccerBall from '../../soccer-common/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { SoccerBallPhase } from '../../soccer-common/model/SoccerBallPhase.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

type SelfOptions = EmptySelfOptions;
type CardModelOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CardModel {

  public readonly soccerBall: SoccerBall;
  public readonly isActiveProperty: TReadOnlyProperty<boolean>;

  public constructor( soccerBall: SoccerBall, options: CardModelOptions ) {
    this.soccerBall = soccerBall;
    this.isActiveProperty = new DerivedProperty( [ soccerBall.soccerBallPhaseProperty ], phase =>
      phase === SoccerBallPhase.STACKED || phase === SoccerBallPhase.STACKING, {
      tandem: options.tandem.createTandem( 'isActiveProperty' ),
      phetioValueType: BooleanIO
    } );
  }
}

centerAndVariability.register( 'CardModel', CardModel );