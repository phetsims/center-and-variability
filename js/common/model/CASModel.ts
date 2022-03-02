// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the model in every screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASObject, { CASObjectOptions } from './CASObject.js';
import CASObjectType from './CASObjectType.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import CardModel from './CardModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';

type CASModelSelfOptions = {
  tandem: Tandem,
  includeCards: boolean
};
export type CASModelOptions = CASModelSelfOptions & {};

// constants
const HIGHLIGHT_ANIMATION_TIME_STEP = 0.25; // in seconds

class CASModel {
  readonly objectGroup: PhetioGroup<CASObject, [ CASObjectType, Omit<CASObjectOptions, 'tandem'> ]>;
  readonly objectType: CASObjectType;
  readonly isSortingDataProperty: BooleanProperty;
  readonly isShowingTopMeanProperty: BooleanProperty;
  readonly isShowingTopMedianProperty: BooleanProperty;
  readonly isShowingBottomMedianProperty: BooleanProperty; // TODO: Rename isShowingPlayAreaMedianProperty?
  readonly isShowingBottomMeanProperty: BooleanProperty; // TODO: Rename isShowingPlayAreaMeanProperty?
  readonly isShowingMeanPredictionProperty: BooleanProperty;
  readonly isShowingMedianPredictionProperty: BooleanProperty;
  readonly cardModelGroup: PhetioGroup<CardModel, [ CASObject ]>; // Only instrumented and enabled if includeCards === true
  readonly includeCards: boolean;

  readonly maxNumberOfObjects: number;

  // TODO: rename to allowedRange or something
  readonly range: Range;

  // This is the number that we can still add to the PhetioGroup
  readonly numberOfRemainingObjectsProperty: DerivedProperty<number, [ count: number ]>;
  readonly medianValueProperty: Property<number | null>;
  readonly meanValueProperty: Property<number | null>;

  // TODO: Rename to rangeProperty
  readonly dataRangeProperty: Property<Range | null>;
  readonly objectChangedEmitter: Emitter<[ CASObject ]>;

  // Null until the user has made a prediction.
  readonly medianPredictionProperty: NumberProperty;
  readonly meanPredictionProperty: NumberProperty;

  protected readonly timeProperty: NumberProperty;
  readonly highlightAnimationIndexProperty: Property<number | null>;
  private lastHighlightAnimationStepTime: number;
  readonly isMedianAnimationCompleteProperty: BooleanProperty;

  constructor( objectType: CASObjectType, maxNumberOfObjects: number, providedOptions: CASModelOptions ) {

    const options = optionize<CASModelOptions, CASModelSelfOptions, {}>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    this.objectType = objectType;

    this.maxNumberOfObjects = maxNumberOfObjects;

    this.objectGroup = new PhetioGroup( ( tandem, objectType: CASObjectType, providedOptions ) => {

      // Assign the tandem to the options
      const options = merge( providedOptions, {

        // If it's the first element in the group, mark as isFirstObject. For creating archetype, the objectGroup does
        // not yet exist, so just mark it as first
        isFirstObject: this.objectGroup ? this.objectGroup.count === 0 : true,
        tandem: tandem
      } );

      return new CASObject( objectType, options );
    }, [ objectType, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( CASObject.CASObjectIO ),
      tandem: options.tandem.createTandem( objectType === CASObjectType.SOCCER_BALL ? 'soccerBallGroup' : 'dataPointGroup' )
    } );

    // For PhET-iO State, it is difficult to power 2 views from one model, see https://github.com/phetsims/phet-io/issues/1688#issuecomment-1032967603
    // Therefore, we introduce a minimal model element for the cards, so they can be managed by the state
    this.cardModelGroup = new PhetioGroup( ( tandem, casObject ) => {
      assert && assert( casObject, 'casObject should be defined' );
      return new CardModel( casObject, {
        tandem: tandem
      } );
    }, [ this.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( CardModel.CardModelIO ),
      tandem: options.includeCards ? options.tandem.createTandem( 'cardModelGroup' ) : Tandem.OPT_OUT
    } );

    this.range = new Range( 1, 15 );

    this.isSortingDataProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isSortingDataProperty' )
    } );
    this.isShowingTopMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingTopMeanProperty' )
    } );
    this.isShowingTopMedianProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingTopMedianProperty' )
    } );
    this.isShowingBottomMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingBottomMeanProperty' )
    } );
    this.isShowingBottomMedianProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingBottomMedianProperty' )
    } );
    this.isShowingMeanPredictionProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMeanPredictionProperty' )
    } );
    this.isShowingMedianPredictionProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMedianPredictionProperty' )
    } );

    this.medianValueProperty = new Property<number | null>( null );
    this.meanValueProperty = new Property<number | null>( null );
    this.dataRangeProperty = new Property<Range | null>( null );
    this.medianPredictionProperty = new NumberProperty( 1 );
    this.meanPredictionProperty = new NumberProperty( 1 );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' )
    } );

    // TODO: Instrument for PhET-iO or convert to number.  Should it be phet-io instrumented for the state wrapper?
    this.highlightAnimationIndexProperty = new Property<number | null>( null );
    this.lastHighlightAnimationStepTime = 0;

    // TODO: Would an enum like 'not-yet-started' vs 'in-progress' vs 'complete' be clearer?
    this.isMedianAnimationCompleteProperty = new BooleanProperty( false );

    // TODO: This should be on the prototype
    const updateMeanAndMedian = () => {
      const objectsInDataSet = this.objectGroup.filter( casObject => casObject.valueProperty.value !== null );
      const sortedObjects = _.sortBy( objectsInDataSet, casObject => casObject.valueProperty.value );

      // TODO: Why does this print twice at the same time?
      // console.log( values );
      const medianValues: number[] = [];

      // Odd number of values, take the central value
      if ( sortedObjects.length % 2 === 1 ) {
        const midIndex = ( sortedObjects.length - 1 ) / 2;
        this.medianValueProperty.value = sortedObjects[ midIndex ].valueProperty.value!;
        medianValues.push( this.medianValueProperty.value );

        assert && assert( !isNaN( this.medianValueProperty.value ) );
      }
      else if ( sortedObjects.length % 2 === 0 && sortedObjects.length >= 2 ) {

        // Even number of values, average the two middle-most values
        const mid1Index = ( sortedObjects.length - 2 ) / 2;
        const mid2Index = ( sortedObjects.length - 0 ) / 2;
        const mid1Value = sortedObjects[ mid1Index ].valueProperty.value!;
        const mid2Value = sortedObjects[ mid2Index ].valueProperty.value!;
        this.medianValueProperty.value = ( mid1Value + mid2Value ) / 2;

        medianValues.push( mid1Value );
        medianValues.push( mid2Value );

        assert && assert( !isNaN( this.medianValueProperty.value ) );
      }
      else {

        // Not enough values for the median to be defined
        this.medianValueProperty.value = null;
      }

      const medianObjects: CASObject[] = [];

      const takeTopObjects = ( median: number, numberToTake: number ) => {
        const objectsWithMedianValue = this.objectGroup.filter( casObject => casObject.valueProperty.value === median );
        const sortedObjects = _.sortBy( objectsWithMedianValue, casObject => casObject.positionProperty.value.y );
        medianObjects.push( ...sortedObjects.slice( -numberToTake ) );
      };

      if ( medianValues.length === 1 ) {
        takeTopObjects( medianValues[ 0 ], 1 );
      }
      else if ( medianValues.length === 2 && medianValues[ 0 ] === medianValues[ 1 ] ) {
        takeTopObjects( medianValues[ 0 ], 2 );
      }
      else {
        takeTopObjects( medianValues[ 0 ], 1 );
        takeTopObjects( medianValues[ 1 ], 1 );
      }

      this.objectGroup.forEach( object => {
        object.isMedianObjectProperty.value = medianObjects.includes( object );
      } );

      if ( objectsInDataSet.length > 0 ) {
        this.meanValueProperty.value = _.mean( objectsInDataSet.map( casObject => casObject.valueProperty.value ) );

        const min = sortedObjects[ 0 ].valueProperty.value!;
        const max = sortedObjects[ sortedObjects.length - 1 ].valueProperty.value!;
        this.dataRangeProperty.value = new Range( min, max );
      }
      else {
        this.meanValueProperty.value = null;
        this.dataRangeProperty.value = null;
      }
    };

    this.isShowingBottomMedianProperty.link( updateMeanAndMedian );

    // Trigger CardModel creation when a ball lands.
    const objectCreatedListener = ( casObject: CASObject ) => {
      const listener = ( value: number | null ) => {
        if ( value !== null && !phet.joist.sim.isSettingPhetioStateProperty.value ) {
          if ( options.includeCards ) {
            this.cardModelGroup.createNextElement( casObject );
          }
          this.objectValueBecameNonNull( casObject );
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

    // Signify whenever any object's value or position changes
    this.objectChangedEmitter = new Emitter<[ CASObject ]>( {
      parameters: [ { valueType: CASObject } ]
    } );

    // Don't show animation on startup
    this.isShowingTopMedianProperty.lazyLink( isShowingTopMedian => {
      if ( isShowingTopMedian ) {
        this.highlightAnimationIndexProperty.value = 0;
        this.lastHighlightAnimationStepTime = this.timeProperty.value;
      }
      else {
        this.clearAnimation();
        this.isMedianAnimationCompleteProperty.value = false;
      }
    } );
  }

  protected createObject( options: Omit<CASObjectOptions, 'tandem'> ): CASObject {
    const casObject = this.objectGroup.createNextElement( this.objectType, options );

    const dragPositionListener = ( dragPosition: Vector2, oldPosition: Vector2 ) => {
      casObject.valueProperty.value = Utils.roundSymmetric( this.range.constrainValue( dragPosition.x ) );

      this.moveToTop( casObject );
    };
    casObject.dragPositionProperty.lazyLink( dragPositionListener );

    // this is an n^2 operation, but that is okay because n small.
    this.objectGroup.elementDisposedEmitter.addListener( o => {
      if ( o === casObject ) {
        o.dragPositionProperty.unlink( dragPositionListener );
      }
    } );

    return casObject;
  }

  /**
   * Returns all other objects at the target position of the provided object.
   */
  protected getOtherObjectsAtTarget( casObject: CASObject ): CASObject[] {
    return this.objectGroup.filter( ( o: CASObject ) => {
      return o.valueProperty.value === casObject.valueProperty.value && casObject !== o;
    } );
  }

  /**
   * Set the position of the parameter object to be on top of the other objects at that target position.
   */
  protected moveToTop( casObject: CASObject ): void {

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

  // TODO: Should this be an emitter?  We say yes.
  protected objectValueBecameNonNull( casObject: CASObject ): void {
    this.updateAnimation();
  }

  /**
   * Clears out the data and the cards
   */
  clearData(): void {
    this.objectGroup.clear();
    this.cardModelGroup.clear();
  }

  /**
   * Resets the model.
   */
  reset(): void {
    this.medianPredictionProperty.reset();
    this.meanPredictionProperty.reset();
    this.isSortingDataProperty.reset();
    this.isShowingTopMeanProperty.reset();
    this.isShowingTopMedianProperty.reset();
    this.isShowingBottomMeanProperty.reset();
    this.isShowingBottomMedianProperty.reset();
    this.isShowingMeanPredictionProperty.reset();
    this.isShowingMedianPredictionProperty.reset();
    this.highlightAnimationIndexProperty.reset();
    this.timeProperty.reset();
    this.isMedianAnimationCompleteProperty.reset();
    this.clearData();
  }

  clearAnimation() {
    this.highlightAnimationIndexProperty.value = null;
    this.objectGroup.forEach( casObject => casObject.isShowingAnimationHighlightProperty.set( false ) );
  }

  updateAnimation() {

    // TODO: copied from updateMeanAndMedian
    const objectsInDataSet = this.objectGroup.filter( casObject => casObject.valueProperty.value !== null );
    const sortedObjects = _.sortBy( objectsInDataSet, [ casObject => casObject.valueProperty.value, casObject => casObject.positionProperty.value.y ] );

    for ( let i = 0; i < sortedObjects.length / 2; i++ ) {
      const isHighlighted = i === this.highlightAnimationIndexProperty.value;
      sortedObjects[ i ].isShowingAnimationHighlightProperty.value = isHighlighted;

      const upperIndex = sortedObjects.length - 1 - i;
      sortedObjects[ upperIndex ].isShowingAnimationHighlightProperty.value = isHighlighted;
    }

    const isAnimationFinished = this.highlightAnimationIndexProperty.value !== null &&
                                this.highlightAnimationIndexProperty.value >= sortedObjects.length / 2;

    if ( isAnimationFinished ) {
      this.clearAnimation();
      this.isMedianAnimationCompleteProperty.value = true;
    }
    else if ( this.highlightAnimationIndexProperty.value !== null &&
              this.timeProperty.value > this.lastHighlightAnimationStepTime + HIGHLIGHT_ANIMATION_TIME_STEP ) {

      // if the animation has already started, step it to the next animation index
      this.highlightAnimationIndexProperty.value++;
      this.lastHighlightAnimationStepTime = this.timeProperty.value;
    }
  }

  /**
   * Steps the model.
   *
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
    this.timeProperty.value += dt;

    this.updateAnimation();

    this.objectGroup.forEach( casObject => casObject.step( dt ) );
  }
}

centerAndSpread.register( 'CASModel', CASModel );
export default CASModel;