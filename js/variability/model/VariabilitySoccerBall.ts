// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of VariabilitySoccerBall that adds variability-specific measures.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 *
 */

import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVSoccerBall from '../../common/model/CAVSoccerBall.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class VariabilitySoccerBall extends CAVSoccerBall {

  // Is the soccer ball part of the first quartile boundary for its data set
  public readonly isQ1ObjectProperty: BooleanProperty;

  // Is the soccer ball part of the third quartile boundary for its data set
  public readonly isQ3ObjectProperty: BooleanProperty;

  public constructor( isFirstSoccerBall: boolean, tandem: Tandem ) {

    super( isFirstSoccerBall, tandem );

    this.isQ1ObjectProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isQ1ObjectProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.isQ3ObjectProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isQ3ObjectProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
  }

  public static override createSoccerBall( isFirstSoccerBall: boolean, tandem: Tandem ): VariabilitySoccerBall {
    return new VariabilitySoccerBall( isFirstSoccerBall, tandem );
  }

  public override reset(): void {

    // Reset our own state first so that when super reset() is called, it is ok to trigger the resetEmitter
    this.isQ1ObjectProperty.reset();
    this.isQ3ObjectProperty.reset();

    super.reset();
  }
}

centerAndVariability.register( 'VariabilitySoccerBall', VariabilitySoccerBall );