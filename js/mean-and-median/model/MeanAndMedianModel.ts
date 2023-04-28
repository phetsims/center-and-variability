// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Mean & Median" screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';

// constants
const HIGHLIGHT_ANIMATION_TIME_STEP = 0.25; // in seconds

export default class MeanAndMedianModel extends CAVModel {


  // Indicates how far the show median animation has progressed, or null if not animating. Not PhET-iO instrumented since
  // it represents a transient value.
  private highlightAnimationIndex: number | null = null;

  private lastHighlightAnimationStepTime = 0;
  public readonly isMedianAnimationCompleteProperty = new BooleanProperty( false );

  public constructor( options: CAVModelOptions ) {
    super( options );

    // Don't show animation on startup or when setting PhET-iO state
    this.isShowingTopMedianProperty.lazyLink( isShowingTopMedian => {
      if ( isShowingTopMedian ) {

        if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
          this.highlightAnimationIndex = 0;
          this.lastHighlightAnimationStepTime = this.timeProperty.value;
        }
        else {

          // When setting PhET-iO state, show the arrow right away.
          this.isMedianAnimationCompleteProperty.value = true;
        }
      }
      else {
        this.clearAnimation();
        this.isMedianAnimationCompleteProperty.value = false;
      }
    } );

    this.objectValueBecameNonNullEmitter.addListener( () => this.updateAnimation() );
  }

  public override reset(): void {
    super.reset();
    this.highlightAnimationIndex = null;
    this.isMedianAnimationCompleteProperty.reset();
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.updateAnimation();
  }

  private clearAnimation(): void {
    this.highlightAnimationIndex = null;
    this.soccerBalls.forEach( cavObject => cavObject.isShowingAnimationHighlightProperty.set( false ) );
  }

  private updateAnimation(): void {

    const sortedObjects = this.getSortedLandedObjects();

    for ( let i = 0; i < sortedObjects.length / 2; i++ ) {
      const isHighlighted = i === this.highlightAnimationIndex;
      sortedObjects[ i ].isShowingAnimationHighlightProperty.value = isHighlighted;

      const upperIndex = sortedObjects.length - 1 - i;
      sortedObjects[ upperIndex ].isShowingAnimationHighlightProperty.value = isHighlighted;
    }

    const isAnimationFinished = this.highlightAnimationIndex !== null &&
                                this.highlightAnimationIndex >= sortedObjects.length / 2;

    if ( isAnimationFinished ) {
      this.clearAnimation();
      this.isMedianAnimationCompleteProperty.value = true;
    }
    else if ( this.highlightAnimationIndex !== null &&
              this.timeProperty.value > this.lastHighlightAnimationStepTime + HIGHLIGHT_ANIMATION_TIME_STEP ) {

      // if the animation has already started, step it to the next animation index
      this.highlightAnimationIndex++;
      this.lastHighlightAnimationStepTime = this.timeProperty.value;
    }
  }
}

centerAndVariability.register( 'MeanAndMedianModel', MeanAndMedianModel );