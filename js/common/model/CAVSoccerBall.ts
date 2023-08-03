// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of SoccerBall. Tracks whether the ball is a median object, q1 object, q3 object,
 * and whether the animation highlight is visible.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerBall, { SoccerBallOptions } from '../../../../soccer-common/js/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

export type CAVSoccerBallOptions = EmptySelfOptions & SoccerBallOptions;

export default class CAVSoccerBall extends SoccerBall {
  public readonly isMedianObjectProperty: BooleanProperty;
  public readonly isAnimationHighlightVisibleProperty: BooleanProperty;

  public constructor( isFirstSoccerBall: boolean, providedOptions: CAVSoccerBallOptions ) {

    const options = providedOptions;

    super( isFirstSoccerBall, options );

    this.isMedianObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMedianObjectProperty' ),
      phetioReadOnly: true
    } );
    this.isAnimationHighlightVisibleProperty = new BooleanProperty( false );
  }

  public static createSoccerBall( isFirstSoccerBall: boolean, options: CAVSoccerBallOptions ): CAVSoccerBall {
    return new CAVSoccerBall( isFirstSoccerBall, options );
  }

  public override reset(): void {

    // Reset our own state first so that when super reset() is called, it is ok to trigger the resetEmitter
    this.isMedianObjectProperty.reset();
    this.isAnimationHighlightVisibleProperty.reset();

    super.reset();
  }
}

centerAndVariability.register( 'CAVSoccerBall', CAVSoccerBall );