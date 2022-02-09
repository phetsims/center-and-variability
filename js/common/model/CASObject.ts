// Copyright 2022, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import CASObjectType from './CASObjectType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CASConstants from '../CASConstants.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';

type CASObjectSelfOptions = {
  position?: Vector2,
  velocity?: Vector2,
  targetX: number,
  value?: number | null
};
export type CASObjectOptions =
  CASObjectSelfOptions
  & PhetioObjectOptions
  & Required<Pick<PhetioObjectOptions, 'tandem'>>;

class CASObject extends PhetioObject {

  // When dragging, the object snaps to each tickmark
  readonly dragPositionProperty: Vector2Property;
  readonly positionProperty: Vector2Property; // in model coordinates
  readonly velocityProperty: Vector2Property;
  readonly isAnimatingProperty: BooleanProperty;
  static CASObjectIO: IOType;
  readonly objectType: CASObjectType;

  // Where the object is animating to
  private readonly targetX: number;

  // The value that particpates in the data set.
  valueProperty: Property<number | null>;

  constructor( objectType: CASObjectType, providedOptions: CASObjectOptions ) {

    const options = optionize<CASObjectOptions, CASObjectSelfOptions, PhetioObjectOptions>( {
      position: Vector2.ZERO,
      velocity: Vector2.ZERO,
      tandem: Tandem.REQUIRED,
      phetioType: CASObject.CASObjectIO,
      phetioDynamicElement: true,
      value: null
    }, providedOptions );

    super( options );

    this.objectType = objectType;

    this.targetX = options.targetX;

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );
    this.velocityProperty = new Vector2Property( options.velocity, {
      tandem: objectType === CASObjectType.SOCCER_BALL ?
              options.tandem.createTandem( 'velocityProperty' ) :
              Tandem.OPT_OUT
    } );
    this.isAnimatingProperty = new BooleanProperty( false, {
      tandem: objectType === CASObjectType.SOCCER_BALL ?
              options.tandem.createTandem( 'isAnimatingProperty' ) :
              Tandem.OPT_OUT
    } );
    this.dragPositionProperty = new Vector2Property( options.position );
    this.valueProperty = new Property<number | null>( options.value, {
      tandem: options.tandem.createTandem( 'valueProperty' ),
      phetioType: Property.PropertyIO( NullableIO( NumberIO ) )
    } );
  }

  step( dt: number ): void {
    if ( this.isAnimatingProperty.value ) {

      // TODO: sometimes the ball seems to "hitch" a little bit.  Should we average old and new velocities for this?
      this.velocityProperty.value = this.velocityProperty.value.plusXY( 0, CASConstants.GRAVITY * dt );
      let x = this.positionProperty.value.x + this.velocityProperty.value.x * dt;
      let y = this.positionProperty.value.y + this.velocityProperty.value.y * dt;

      let landed = false;

      if ( y <= this.objectType.radius ) {
        x = this.targetX;
        y = this.objectType.radius;
        landed = true;
        this.valueProperty.value = this.targetX;
      }

      this.positionProperty.value = new Vector2( x, y );

      if ( landed ) {
        this.isAnimatingProperty.value = false;
      }
    }
  }

  dispose(): void {
    super.dispose();
    this.positionProperty.dispose();
    this.velocityProperty.dispose();
    this.isAnimatingProperty.dispose();
    this.valueProperty.dispose();
  }

  toStateObject() {
    return {
      objectType: this.objectType.toString(),
      targetX: this.targetX
    };
  }
}

CASObject.CASObjectIO = new IOType( 'CASObjectIO', {
  valueType: CASObject,
  toStateObject: ( casObject: CASObject ) => casObject.toStateObject(),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [
      stateObject.objectType === 'SOCCER_BALL' ? CASObjectType.SOCCER_BALL : CASObjectType.DATA_POINT, {
        targetX: stateObject.targetX
      } ];
  },
  stateSchema: {
    objectType: EnumerationIO( CASObjectType ),
    targetX: NumberIO
  }
} );

centerAndSpread.register( 'CASObject', CASObject );
export default CASObject;