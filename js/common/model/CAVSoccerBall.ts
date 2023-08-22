// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of SoccerBall. Tracks whether the ball is a median object whether the animation highlight is visible.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CAVSoccerBall extends SoccerBall {

  // Is the soccer ball a median value for the data set?
  public readonly isMedianObjectProperty: BooleanProperty;

  // Is the soccer ball being highlighted as part of the median animation?
  public readonly isAnimationHighlightVisibleProperty: BooleanProperty;

  public constructor( isFirstSoccerBall: boolean, tandem: Tandem ) {

    super( isFirstSoccerBall, tandem );

    this.isMedianObjectProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isMedianObjectProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.isAnimationHighlightVisibleProperty = new BooleanProperty( false );
  }

  public static createSoccerBall( isFirstSoccerBall: boolean, tandem: Tandem ): CAVSoccerBall {
    return new CAVSoccerBall( isFirstSoccerBall, tandem );
  }

  public override reset(): void {

    // Reset our own state first so that when super reset() is called, it is ok to trigger the resetEmitter
    this.isMedianObjectProperty.reset();
    this.isAnimationHighlightVisibleProperty.reset();

    super.reset();
  }
}

centerAndVariability.register( 'CAVSoccerBall', CAVSoccerBall );