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
import CASQueryParameters from '../CASQueryParameters.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
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

class CASModel {
  readonly objectGroup: PhetioGroup<CASObject, [ CASObjectType, Omit<CASObjectOptions, 'tandem'> ]>;
  readonly objectType: CASObjectType;
  readonly isSortingDataProperty: BooleanProperty;
  readonly isShowingTopMeanProperty: BooleanProperty;
  readonly isShowingTopMedianProperty: BooleanProperty;
  readonly isShowingBottomMedianProperty: BooleanProperty; // TODO: Rename isShowingPlayAreaMedianProperty?
  readonly isShowingBottomMeanProperty: BooleanProperty; // TODO: Rename isShowingPlayAreaMeanProperty?
  readonly isShowingPredictMeanProperty: BooleanProperty;
  readonly isShowingPredictMedianProperty: BooleanProperty;
  readonly cardModelGroup: PhetioGroup<CardModel, [ CASObject ]>; // Only instrumented and enabled if includeCards === true
  readonly includeCards: boolean;

  readonly maxNumberOfObjects: number;
  protected readonly rangeProperty: Property<Range>;
  readonly numberOfRemainingObjectsProperty: DerivedProperty<number, [ count: number ]>;
  readonly medianValueProperty: Property<number | null>;
  readonly objectValueChangedEmitter: Emitter<[ CASObject ]>;

  constructor( objectType: CASObjectType, maxNumberOfObjects: number, providedOptions: CASModelOptions ) {

    const options = optionize<CASModelOptions, CASModelSelfOptions, {}>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    this.objectType = objectType;

    this.maxNumberOfObjects = maxNumberOfObjects;

    this.objectGroup = new PhetioGroup( ( tandem, objectType: CASObjectType, providedOptions ) => {

      // Assign the tandem to the options
      const options = merge( {}, providedOptions, { tandem: tandem } );

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

    this.rangeProperty = new Property<Range>( new Range( 1, 16 ) );

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
    this.isShowingPredictMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPredictMeanProperty' )
    } );
    this.isShowingPredictMedianProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPredictMedianProperty' )
    } );

    this.medianValueProperty = new Property<number | null>( null );

    const updateMedian = () => {
      const values = this.objectGroup.filter( casObject => casObject.valueProperty.value !== null )
        .map( casObject => casObject.valueProperty.value! )
        .sort( ( a: number, b: number ) => a - b );

      // TODO: Why does this print twice at the same time?
      // console.log( values );

      // Odd number of values, take the central value
      if ( values.length % 2 === 1 ) {
        const midIndex = ( values.length - 1 ) / 2;
        this.medianValueProperty.value = values[ midIndex ];
        assert && assert( !isNaN( this.medianValueProperty.value ) );
      }
      else if ( values.length % 2 === 0 && values.length >= 2 ) {

        // Even number of values, average the two middle-most values
        const mid1Index = ( values.length - 2 ) / 2;
        const mid2Index = ( values.length - 0 ) / 2;
        const mid1Value = values[ mid1Index ];
        const mid2Value = values[ mid2Index ];
        this.medianValueProperty.value = ( mid1Value + mid2Value ) / 2;
        assert && assert( !isNaN( this.medianValueProperty.value ) );
      }
      else {

        // Not enough values for the median to be defined
        this.medianValueProperty.value = null;
      }
    };

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
      casObject.valueProperty.link( updateMedian );

      // Signal to listeners that a value changed
      casObject.valueProperty.link( () => this.objectValueChangedEmitter.emit( casObject ) );
    };
    this.objectGroup.forEach( objectCreatedListener );
    this.objectGroup.elementCreatedEmitter.addListener( objectCreatedListener );

    this.includeCards = options.includeCards;

    this.numberOfRemainingObjectsProperty = new DerivedProperty( [ this.objectGroup.countProperty ], count => {
      return this.maxNumberOfObjects - count;
    } );

    // Populate with initial objects for debugging
    for ( let i = 0; i < CASQueryParameters.objects; i++ ) {
      const targetX = dotRandom.nextIntBetween( this.rangeProperty.value.min, this.rangeProperty.value.max );
      this.createObject( {
        value: targetX
      } );
    }

    // Stack the objects. This is a brute force algorithm that duplicates effort, but ends up with the objects
    // correctly stacked.  Since this is only used for development with ?objects=... we decided it does not
    // need to be rewritten.
    this.objectGroup.forEach( object => this.moveToTop( object ) );

    // Signify whenever any object's value changes
    this.objectValueChangedEmitter = new Emitter<[ CASObject ]>( {
      parameters: [ { valueType: CASObject } ]
    } );
  }

  protected createObject( options: Omit<CASObjectOptions, 'tandem'> ): CASObject {
    const casObject = this.objectGroup.createNextElement( this.objectType, options );

    const dragPositionListener = ( dragPosition: Vector2, oldPosition: Vector2 ) => {
      casObject.valueProperty.value = Utils.roundSymmetric( this.rangeProperty.value.constrainValue( dragPosition.x ) );

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
      return !o.isAnimatingProperty.value && o.valueProperty.value === casObject.valueProperty.value && casObject !== o;
    } );
  }

  /**
   * Set the position of the parameter object to be on top of the other objects at that target position.
   */
  protected moveToTop( casObject: CASObject ): void {

    const objectsAtTarget = this.getOtherObjectsAtTarget( casObject );

    // Sort from bottom to top, so they can be re-stacked. The specified object will appear at the top.
    const sorted = [ ...objectsAtTarget.sort( object => object.positionProperty.value.y ), casObject ];

    // collapse the rest of the stack. NOTE: This assumes the radii are the same.
    let position = casObject.objectType.radius;
    sorted.forEach( object => {
      object.positionProperty.value = new Vector2( casObject.valueProperty.value!, position );
      position += object.objectType.radius * 2;
    } );
  }

  protected objectValueBecameNonNull( casObject: CASObject ): void {
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
    this.isSortingDataProperty.reset();
    this.isShowingTopMeanProperty.reset();
    this.isShowingTopMedianProperty.reset();
    this.isShowingBottomMeanProperty.reset();
    this.isShowingBottomMedianProperty.reset();
    this.clearData();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
    this.objectGroup.forEach( casObject => casObject.step( dt ) );
  }
}

centerAndSpread.register( 'CASModel', CASModel );
export default CASModel;