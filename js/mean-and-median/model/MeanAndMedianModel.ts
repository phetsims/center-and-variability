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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { kickDistanceStrategyFromStateObject, RandomSkewStrategy } from '../../common/model/RandomSkewStrategy.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

// constants
const HIGHLIGHT_ANIMATION_TIME_STEP = 0.25; // in seconds

export default class MeanAndMedianModel extends CAVModel {

  // Indicates how far the show median animation has progressed, or null if not animating. Not PhET-iO instrumented since
  // it represents a transient value.
  private highlightAnimationIndex: number | null = null;

  private lastHighlightAnimationStepTime = 0;
  public readonly isMedianAnimationCompleteProperty = new BooleanProperty( false );
  public readonly isTopMedianVisibleProperty: BooleanProperty;
  public readonly isTopMeanVisibleProperty: BooleanProperty;
  public readonly isMeanPredictionVisibleProperty: BooleanProperty;
  public readonly meanPredictionProperty: NumberProperty;

  public constructor( providedOptions: MeanAndMedianModelOptions ) {

    const options = optionize<MeanAndMedianModelOptions, SelfOptions, CAVModelOptions>()( {
      instrumentMeanPredictionProperty: true
    }, providedOptions );

    const sceneModel = new CAVSoccerSceneModel(
      MAX_KICKS_PROPERTY,
      CAVConstants.MAX_KICKS_VALUES,
      new RandomSkewStrategy(),
      CAVConstants.PHYSICAL_RANGE,
      kickDistanceStrategyFromStateObject, {
        tandem: options.tandem.createTandem( 'sceneModel' )
      } );
    super( MAX_KICKS_PROPERTY, [ sceneModel ], options );

    this.isTopMeanVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isTopMeanVisibleProperty' )
    } );
    this.isTopMeanVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isTopMeanVisibleProperty' )
    } );
    this.isTopMedianVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isTopMedianVisibleProperty' )
    } );

    // Don't show animation on startup or when setting PhET-iO state
    this.isTopMedianVisibleProperty.lazyLink( isTopMedianVisible => {
      if ( isTopMedianVisible ) {

        if ( !isSettingPhetioStateProperty.value ) {
          this.highlightAnimationIndex = 0;
          this.lastHighlightAnimationStepTime = sceneModel.timeProperty.value;
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

    this.meanPredictionProperty = new NumberProperty( 1.5, {
      range: CAVConstants.PHYSICAL_RANGE,
      tandem: options.tandem.createTandem( 'meanPredictionProperty' )
    } );
    this.isMeanPredictionVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMeanPredictionVisibleProperty' )
    } );

    sceneModel.objectValueBecameNonNullEmitter.addListener( () => this.updateAnimation() );
  }

  public override reset(): void {
    super.reset();
    this.highlightAnimationIndex = null;
    this.isMedianAnimationCompleteProperty.reset();
    this.isTopMeanVisibleProperty.reset();
    this.isTopMedianVisibleProperty.reset();
    this.meanPredictionProperty.reset();
    this.isMeanPredictionVisibleProperty.reset();
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.updateAnimation();
  }

  private clearAnimation(): void {
    this.highlightAnimationIndex = null;
    this.selectedSceneModelProperty.value.soccerBalls.forEach( soccerBall => soccerBall.isAnimationHighlightVisibleProperty.set( false ) );
  }

  private updateAnimation(): void {

    const sortedObjects = this.selectedSceneModelProperty.value.getSortedStackedObjects();

    for ( let i = 0; i < sortedObjects.length / 2; i++ ) {
      const isHighlighted = i === this.highlightAnimationIndex;
      sortedObjects[ i ].isAnimationHighlightVisibleProperty.value = isHighlighted;

      const upperIndex = sortedObjects.length - 1 - i;
      sortedObjects[ upperIndex ].isAnimationHighlightVisibleProperty.value = isHighlighted;
    }

    const isAnimationFinished = this.highlightAnimationIndex !== null &&
                                this.highlightAnimationIndex >= sortedObjects.length / 2;

    if ( isAnimationFinished ) {
      this.clearAnimation();
      this.isMedianAnimationCompleteProperty.value = true;
    }
    else if ( this.highlightAnimationIndex !== null &&
              this.selectedSceneModelProperty.value.timeProperty.value > this.lastHighlightAnimationStepTime + HIGHLIGHT_ANIMATION_TIME_STEP ) {

      // if the animation has already started, step it to the next animation index
      this.highlightAnimationIndex++;
      this.lastHighlightAnimationStepTime = this.selectedSceneModelProperty.value.timeProperty.value;
    }
  }
}

centerAndVariability.register( 'MeanAndMedianModel', MeanAndMedianModel );