// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of VariabilitySoccerBall that adds variability-specific measures.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 *
 */

import { SoccerBallOptions } from '../../soccer-common/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CAVSoccerBall from '../../common/model/CAVSoccerBall.js';

type CAVSoccerBallOptions = EmptySelfOptions & SoccerBallOptions;

export default class VariabilitySoccerBall extends CAVSoccerBall {
  public readonly isQ1ObjectProperty: BooleanProperty;
  public readonly isQ3ObjectProperty: BooleanProperty;

  public constructor( isFirstSoccerBall: boolean, options: CAVSoccerBallOptions ) {

    super( isFirstSoccerBall, options );

    this.isQ1ObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isQ1ObjectProperty' )
    } );
    this.isQ3ObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isQ3ObjectProperty' )
    } );
  }

  public static override createSoccerBall( isFirstSoccerBall: boolean, options: CAVSoccerBallOptions ): VariabilitySoccerBall {
    return new VariabilitySoccerBall( isFirstSoccerBall, options );
  }

  public override reset(): void {

    // Reset our own state first so that when super reset() is called, it is ok to trigger the resetEmitter
    this.isQ1ObjectProperty.reset();
    this.isQ3ObjectProperty.reset();

    super.reset();
  }
}

centerAndVariability.register( 'VariabilitySoccerBall', VariabilitySoccerBall );