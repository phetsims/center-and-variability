// Copyright 2022, University of Colorado Boulder

/**
 * Soccer balls are animated and hence track their velocity.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CASObject, { CASObjectOptions } from './CASObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SoccerBallSelfOptions = {};
export type SoccerBallOptions = SoccerBallSelfOptions & CASObjectOptions;

class SoccerBall extends CASObject {
  private readonly velocityProperty: NumberProperty;
  static SoccerBallIO: IOType;

  constructor( providedOptions: SoccerBallOptions ) {

    const options = optionize<SoccerBallOptions, SoccerBallSelfOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.velocityProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'velocityProperty' )
    } );
  }

  /**
   * Resets the model.
   */
  reset() {
    super.reset();
    this.velocityProperty.reset();
  }
}

// TODO: Why isn't that automatically done for us?
SoccerBall.SoccerBallIO = new IOType( 'SoccerBallIO', {
  valueType: SoccerBall,
  toStateObject: ( soccerBall: SoccerBall ) => ( { position: Vector2.Vector2IO.toStateObject( soccerBall.positionProperty.value ) } ),
  stateToArgsForConstructor: ( stateObject: any ) => [ Vector2.Vector2IO.fromStateObject( stateObject.position ) ],
  stateSchema: {
    position: Vector2.Vector2IO
  }
} );

centerAndSpread.register( 'SoccerBall', SoccerBall );
export default SoccerBall;