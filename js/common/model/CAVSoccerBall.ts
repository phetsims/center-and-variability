// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of SoccerBall. Tracks whether the ball is a median object, q1 object, q3 object,
 * and whether the animation highlight is visible.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerBall, { SoccerBallOptions } from '../../soccer-common/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';


type CAVSoccerBallOptions = EmptySelfOptions & SoccerBallOptions;

export default class CAVSoccerBall extends SoccerBall {
  public readonly isMedianObjectProperty: BooleanProperty;
  public readonly isQ1ObjectProperty: BooleanProperty;
  public readonly isQ3ObjectProperty: BooleanProperty;
  public readonly isAnimationHighlightVisibleProperty: BooleanProperty;

  public constructor( isFirstSoccerBall: boolean, providedOptions: CAVSoccerBallOptions ) {

    const options = providedOptions;

    super( isFirstSoccerBall, options );

    this.isMedianObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMedianObjectProperty' )
    } );
    this.isQ1ObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isQ1ObjectProperty' )
    } );
    this.isQ3ObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isQ3ObjectProperty' )
    } );
    this.isAnimationHighlightVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isAnimationHighlightVisibleProperty' )
    } );
  }

  public static createSoccerBall( isFirstSoccerBall: boolean, options: { tandem: Tandem } ): CAVSoccerBall {
    return new CAVSoccerBall( isFirstSoccerBall, options );
  }

  public override reset(): void {
    super.reset();

    this.isMedianObjectProperty.reset();
    this.isQ1ObjectProperty.reset();
    this.isQ3ObjectProperty.reset();
    this.isAnimationHighlightVisibleProperty.reset();
  }
}

centerAndVariability.register( 'CAVSoccerBall', CAVSoccerBall );