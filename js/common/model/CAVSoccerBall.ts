// Copyright 2023, University of Colorado Boulder

/**
 * CAVSoccerBall is an extension of the basic `SoccerBall. This class serves two additional roles:
 * Firstly, it identifies whether the soccer ball is representative of a median value in a data set.
 * Secondly, it determines if an animation highlight should be made visible for this soccer ball.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CAVSoccerBall extends SoccerBall {

  // This Property identifies whether the soccer ball represents the median value in a dataset.
  public readonly isMedianObjectProperty: BooleanProperty;

  // This Property determines if the soccer ball should be illuminated during a median-based animation.
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