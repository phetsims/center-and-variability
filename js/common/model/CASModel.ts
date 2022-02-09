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
import CASObject from './CASObject.js';
import CASObjectType from './CASObjectType.js';
import merge from '../../../../phet-core/js/merge.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import CASQueryParameters from '../CASQueryParameters.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';

type CASModelSelfOptions = {
  tandem: Tandem
};
export type CASModelOptions = CASModelSelfOptions & {};

class CASModel {
  readonly objectGroup: PhetioGroup<CASObject>;
  readonly objectType: CASObjectType;
  readonly rangeProperty: Property<Range>;

  constructor( objectType: CASObjectType, providedOptions: CASModelOptions ) {

    const options = optionize<CASModelOptions, CASModelSelfOptions, {}>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    this.objectType = objectType;

    this.objectGroup = new PhetioGroup( ( tandem, objectType: CASObjectType, providedOptions ) => {

      // TODO: Optionize
      const options = merge( { tandem: tandem }, providedOptions );
      return new CASObject( objectType, options );
    }, [ objectType, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( CASObject.CASObjectIO ),
      tandem: options.tandem.createTandem( objectType === CASObjectType.SOCCER_BALL ? 'soccerBallGroup' : 'dataPointGroup' )
    } );

    // TODO: min and max should be constructor options
    this.rangeProperty = new Property<Range>( new Range( 1, 16 ) );

    for ( let i = 0; i < CASQueryParameters.objects; i++ ) {
      const targetX = dotRandom.nextIntBetween( this.rangeProperty.value.min, this.rangeProperty.value.max );
      this.createObject( {
        targetX: targetX,
        value: targetX
      } );
    }

    // Stack the objects. TODO: A simpler way?
    this.objectGroup.forEach( object => this.moveToTop( object ) );
  }

  // TODO: need options type for CASObject that doesn't include phetio things
  protected createObject( options: any ): CASObject {
    const casObject = this.objectGroup.createNextElement( this.objectType, options );

    // TODO: when the positionProperty changes from animation, sync the dragPositionProperty to it
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

  /**
   * Resets the model.
   */
  reset(): void {
    this.objectGroup.clear();
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