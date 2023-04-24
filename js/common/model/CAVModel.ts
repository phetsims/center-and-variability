// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for the model in every screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVObject, { CAVObjectOptions } from './CAVObject.js';
import CAVObjectType from './CAVObjectType.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CardModel from './CardModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TModel from '../../../../joist/js/TModel.js';

type SelfOptions = {
  tandem: Tandem;
  includeCards: boolean;
  instrumentMeanPredictionProperty: boolean;
  dataPointFill: string;
};
export type CAVModelOptions = SelfOptions;

// constants
const HIGHLIGHT_ANIMATION_TIME_STEP = 0.25; // in seconds

export default class CAVModel implements TModel {
  public readonly objectGroup: PhetioGroup<CAVObject, [ CAVObjectType, StrictOmit<CAVObjectOptions, 'tandem'> ]>;
  public readonly objectType: CAVObjectType;
  public readonly isSortingDataProperty: BooleanProperty;
  public readonly isShowingTopMeanProperty: BooleanProperty;
  public readonly isShowingTopMedianProperty: BooleanProperty;
  public readonly isShowingPlayAreaMedianProperty: BooleanProperty;
  public readonly isShowingPlayAreaMeanProperty: BooleanProperty;
  public readonly isShowingPlayAreaVariabilityProperty: BooleanProperty; // TODO: only used in screen 3
  public readonly isShowingMeanPredictionProperty: BooleanProperty;
  public readonly isShowingMedianPredictionProperty: BooleanProperty;

  // This is used like a view attribute, but passing it through views led to too much complexity
  // TODO: Do we want to move this to the view?
  // TODO: Or at the instantiation site, could do `model instanceof VariabilityModel? gray : black`
  public readonly dataPointFill: string;

  // TODO: Why is the CardModel in the base class that applies to all screens?
  // For PhET-iO State, it is difficult to power 2 views from one model, see https://github.com/phetsims/phet-io/issues/1688#issuecomment-1032967603
  // Therefore, we introduce a minimal model element for the cards, so they can be managed by the state
  // Only instrumented and enabled if includeCards === true
  public readonly cardModelGroup: PhetioGroup<CardModel, [ CAVObject ]>;

  public readonly includeCards: boolean;
  protected readonly maxNumberOfObjects: number;
  public readonly physicalRange = new Range( 1, 15 );

  // This is the number that we can still add to the PhetioGroup
  protected readonly numberOfRemainingObjectsProperty: TReadOnlyProperty<number>;
  public readonly medianValueProperty: Property<number | null>;
  public readonly meanValueProperty: Property<number | null>;

  // Indicates the max and min values in the data set, or null if there are no values in the data set
  public readonly dataRangeProperty: Property<Range | null>;
  public readonly maxValueProperty: TReadOnlyProperty<number | null>;
  public readonly minValueProperty: TReadOnlyProperty<number | null>;
  public readonly rangeValueProperty: TReadOnlyProperty<number | null>;

  // Signify whenever any object's value or position changes
  public readonly objectChangedEmitter: TEmitter<[ CAVObject ]> = new Emitter<[ CAVObject ]>( {
    parameters: [ { valueType: CAVObject } ]
  } );

  // Null until the user has made a prediction.
  public readonly medianPredictionProperty: NumberProperty;
  public readonly meanPredictionProperty: NumberProperty;

  protected readonly timeProperty: NumberProperty;

  // Indicates how far the show median animation has progressed, or null if not animating. Not PhET-iO instrumented since
  // it represents a transient value.
  private highlightAnimationIndex: number | null = null;

  private lastHighlightAnimationStepTime = 0;
  public readonly isMedianAnimationCompleteProperty = new BooleanProperty( false );
  protected readonly objectValueBecameNonNullEmitter: TEmitter<[ CAVObject ]>;
  public readonly resetEmitter: TEmitter = new Emitter();
  public readonly numberOfDataPointsProperty: NumberProperty;

  public constructor( objectType: CAVObjectType, maxNumberOfObjects: number, providedOptions: CAVModelOptions ) {

    const options = optionize<CAVModelOptions, SelfOptions>()( {}, providedOptions );

    this.dataPointFill = options.dataPointFill;
    this.objectType = objectType;
    this.maxNumberOfObjects = maxNumberOfObjects;

    this.objectGroup = new PhetioGroup( ( tandem, objectType: CAVObjectType, providedOptions: StrictOmit<CAVObjectOptions, 'tandem'> ) => {

      const options = optionize<StrictOmit<CAVObjectOptions, 'tandem'>, EmptySelfOptions, CAVObjectOptions>()( {
        // If it's the first element in the group, mark as isFirstObject. For creating archetype, the objectGroup does
        // not yet exist, so just mark it as first
        isFirstObject: this.objectGroup ? this.objectGroup.count === 0 : true,
        tandem: tandem
      }, providedOptions );

      const casObject = new CAVObject( objectType, options );

      // TODO: Should some or all of this move into CAVObject or CAVObjectNode?
      const dragPositionListener = ( dragPosition: Vector2 ) => {
        casObject.valueProperty.value = Utils.roundSymmetric( this.physicalRange.constrainValue( dragPosition.x ) );

        this.moveToTop( casObject );
      };
      casObject.dragPositionProperty.lazyLink( dragPositionListener );
      casObject.disposedEmitter.addListener( () => casObject.dragPositionProperty.unlink( dragPositionListener ) );

      return casObject;
    }, [ objectType, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( CAVObject.CAVObjectIO ),
      tandem: options.tandem.createTandem( objectType === CAVObjectType.SOCCER_BALL ? 'soccerBallGroup' : 'dataPointGroup' )
    } );

    this.cardModelGroup = new PhetioGroup( ( tandem, casObject ) => {
      assert && assert( casObject, 'casObject should be defined' );
      return new CardModel( casObject, {
        tandem: tandem
      } );
    }, () => [ this.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( CardModel.CardModelIO ),
      tandem: options.includeCards ? options.tandem.createTandem( 'cardModelGroup' ) : Tandem.OPT_OUT
    } );

    this.isSortingDataProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isSortingDataProperty' )
    } );
    this.isShowingTopMeanProperty = new BooleanProperty( false, {
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'isShowingTopMeanProperty' ) : Tandem.OPT_OUT
    } );
    this.isShowingTopMedianProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingTopMedianProperty' )
    } );
    this.isShowingPlayAreaMeanProperty = new BooleanProperty( false, {
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'isShowingPlayAreaMeanProperty' ) : Tandem.OPT_OUT
    } );
    this.isShowingPlayAreaMedianProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPlayAreaMedianProperty' )
    } );
    this.isShowingMeanPredictionProperty = new BooleanProperty( false, {
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'isShowingMeanPredictionProperty' ) : Tandem.OPT_OUT
    } );
    this.isShowingMedianPredictionProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMedianPredictionProperty' )
    } );
    this.isShowingPlayAreaVariabilityProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPlayAreaVariabilityProperty' )
    } );

    this.medianValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'medianValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );
    this.meanValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'meanValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );
    this.dataRangeProperty = new Property<Range | null>( null );

    // TODO: phet-io instrumentation for all screens? probably
    this.maxValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.max;
    } );
    this.minValueProperty = new DerivedProperty( [ this.dataRangeProperty ], dataRange => {
      return dataRange === null ? null : dataRange.min;
    } );
    this.rangeValueProperty = new DerivedProperty( [ this.maxValueProperty, this.minValueProperty ], ( max, min ) => {
      if ( max === null || min === null ) {
        return null;
      }
      else {
        return max - min;
      }
    } );
    this.numberOfDataPointsProperty = new NumberProperty( 0 );

    this.medianPredictionProperty = new NumberProperty( 1, {
      range: this.physicalRange,
      tandem: options.tandem.createTandem( 'medianPredictionProperty' )
    } );
    this.meanPredictionProperty = new NumberProperty( 1.5, {
      range: this.physicalRange,
      tandem: options.instrumentMeanPredictionProperty ? options.tandem.createTandem( 'meanPredictionProperty' ) : Tandem.OPT_OUT
    } );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' )
    } );

    const updateMeanAndMedian = () => this.updateMeanAndMedian();
    this.isShowingPlayAreaMedianProperty.link( updateMeanAndMedian );

    // Trigger CardModel creation when a ball lands.
    const objectCreatedListener = ( casObject: CAVObject ) => {
      const listener = ( value: number | null ) => {
        if ( value !== null ) {
          if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
            if ( options.includeCards ) {
              this.cardModelGroup.createNextElement( casObject );
            }
            this.objectValueBecameNonNullEmitter.emit( casObject );
          }
          casObject.valueProperty.unlink( listener ); // Only create the card once, then no need to listen further
        }
      };
      casObject.valueProperty.link( listener );
      casObject.valueProperty.link( updateMeanAndMedian );
      casObject.positionProperty.link( updateMeanAndMedian );

      // Signal to listeners that a value changed
      // TODO: Maybe should combine with temporary listener for one permanent one
      casObject.valueProperty.link( () => this.objectChangedEmitter.emit( casObject ) );
      casObject.positionProperty.link( () => this.objectChangedEmitter.emit( casObject ) );
    };
    this.objectGroup.forEach( objectCreatedListener );
    this.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    this.includeCards = options.includeCards;

    this.numberOfRemainingObjectsProperty = new DerivedProperty( [ this.objectGroup.countProperty ], count => {
      return this.maxNumberOfObjects - count;
    } );

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

    this.objectValueBecameNonNullEmitter = new Emitter<[ CAVObject ]>( {
      parameters: [ { valueType: CAVObject } ]
    } );
    this.objectValueBecameNonNullEmitter.addListener( () => this.updateAnimation() );
  }

  private updateMeanAndMedian(): void {

    const sortedObjects = this.getSortedLandedObjects();
    const medianObjects: CAVObject[] = [];

    // Odd number of values, take the central value
    if ( sortedObjects.length % 2 === 1 ) {
      const midIndex = ( sortedObjects.length - 1 ) / 2;
      this.medianValueProperty.value = sortedObjects[ midIndex ].valueProperty.value!;
      medianObjects.push( sortedObjects[ midIndex ] );

      assert && assert( !isNaN( this.medianValueProperty.value ) );
    }
    else if ( sortedObjects.length % 2 === 0 && sortedObjects.length >= 2 ) {

      // Even number of values, average the two middle-most values
      const mid1Index = ( sortedObjects.length - 2 ) / 2;
      const mid2Index = ( sortedObjects.length - 0 ) / 2;
      const mid1Value = sortedObjects[ mid1Index ].valueProperty.value!;
      const mid2Value = sortedObjects[ mid2Index ].valueProperty.value!;
      this.medianValueProperty.value = ( mid1Value + mid2Value ) / 2;

      medianObjects.push( sortedObjects[ mid1Index ] );
      medianObjects.push( sortedObjects[ mid2Index ] );

      assert && assert( !isNaN( this.medianValueProperty.value ) );
    }
    else {

      // Not enough values for the median to be defined
      this.medianValueProperty.value = null;
    }

    this.objectGroup.forEach( object => {
      object.isMedianObjectProperty.value = medianObjects.includes( object );
    } );

    if ( sortedObjects.length > 0 ) {
      this.meanValueProperty.value = _.mean( sortedObjects.map( casObject => casObject.valueProperty.value ) );

      const min = sortedObjects[ 0 ].valueProperty.value!;
      const max = sortedObjects[ sortedObjects.length - 1 ].valueProperty.value!;
      this.dataRangeProperty.value = new Range( min, max );
    }
    else {
      this.meanValueProperty.value = null;
      this.dataRangeProperty.value = null;
    }

    this.numberOfDataPointsProperty.value = sortedObjects.length;
  }

  /**
   * Returns all other objects at the target position of the provided object.
   */
  public getOtherObjectsAtTarget( casObject: CAVObject ): CAVObject[] {
    return this.objectGroup.filter( ( o: CAVObject ) => {
      return o.valueProperty.value === casObject.valueProperty.value && casObject !== o;
    } );
  }

  /**
   * Set the position of the parameter object to be on top of the other objects at that target position.
   */
  protected moveToTop( casObject: CAVObject ): void {

    const objectsAtTarget = this.getOtherObjectsAtTarget( casObject );

    // Sort from bottom to top, so they can be re-stacked. The specified object will appear at the top.
    const sortedOthers = _.sortBy( objectsAtTarget, object => object.positionProperty.value.y );
    const sorted = [ ...sortedOthers, casObject ];

    // collapse the rest of the stack. NOTE: This assumes the radii are the same.
    let position = casObject.objectType.radius;
    sorted.forEach( object => {
      object.positionProperty.value = new Vector2( casObject.valueProperty.value!, position );
      position += object.objectType.radius * 2;
    } );
  }

  /**
   * Clears out the data and the cards
   */
  public clearData(): void {
    this.objectGroup.clear();
    this.cardModelGroup.clear();
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.medianPredictionProperty.reset();
    this.meanPredictionProperty.reset();
    this.isSortingDataProperty.reset();
    this.isShowingTopMeanProperty.reset();
    this.isShowingTopMedianProperty.reset();
    this.isShowingPlayAreaMeanProperty.reset();
    this.isShowingPlayAreaMedianProperty.reset();
    this.isShowingMeanPredictionProperty.reset();
    this.isShowingMedianPredictionProperty.reset();
    this.highlightAnimationIndex = null;
    this.timeProperty.reset();
    this.isMedianAnimationCompleteProperty.reset();
    this.clearData();
    this.resetEmitter.emit();
  }

  private clearAnimation(): void {
    this.highlightAnimationIndex = null;
    this.objectGroup.forEach( casObject => casObject.isShowingAnimationHighlightProperty.set( false ) );
  }

  public getSortedLandedObjects(): CAVObject[] {
    return _.sortBy( this.objectGroup.filter( casObject => casObject.valueProperty.value !== null ),

      // The numerical value takes predence for sorting
      casObject => casObject.valueProperty.value,

      // Then consider the height within the stack
      casObject => casObject.positionProperty.value.y
    );
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

  /**
   * Steps the model.
   *
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.timeProperty.value += dt;

    this.updateAnimation();

    this.objectGroup.forEach( cavObject => cavObject.step( dt ) );
  }
}

centerAndVariability.register( 'CAVModel', CAVModel );