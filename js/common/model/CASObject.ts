// Copyright 2022, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions, RequiredTandem } from '../../../../tandem/js/PhetioObject.js';
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
import Emitter from '../../../../axon/js/Emitter.js';

type CASObjectSelfOptions = {
  position?: Vector2;
  velocity?: Vector2;
  value?: number | null;
  isFirstObject?: boolean;
};
export type CASObjectOptions =
  CASObjectSelfOptions
  & PhetioObjectOptions
  & RequiredTandem;

class CASObject extends PhetioObject {

  // Continuous value for the drag listener. When dragging, the object snaps to each tickmark
  readonly dragPositionProperty: Vector2Property;

  // Continuous position during animation. After landing, it's discrete.
  readonly positionProperty: Vector2Property;
  readonly velocityProperty: Vector2Property;
  readonly isAnimatingProperty: BooleanProperty;
  readonly isMedianObjectProperty: BooleanProperty;
  readonly isShowingAnimationHighlightProperty: BooleanProperty;
  readonly objectType: CASObjectType;
  readonly isFirstObject: boolean;

  // Where the object is animating to, or null if not yet animating
  targetX: number | null;

  // The value that participates in the data set.
  valueProperty: Property<number | null>;

  static CASObjectIO: IOType;
  readonly dragStartedEmitter: Emitter;

  constructor( objectType: CASObjectType, providedOptions: CASObjectOptions ) {

    const options = optionize<CASObjectOptions, CASObjectSelfOptions, PhetioObjectOptions>( {
      position: Vector2.ZERO,
      velocity: Vector2.ZERO,
      tandem: Tandem.REQUIRED,
      phetioType: CASObject.CASObjectIO,
      phetioDynamicElement: true,
      value: null,
      isFirstObject: false
    }, providedOptions );

    super( options );

    this.objectType = objectType;
    this.targetX = null;
    this.isFirstObject = options.isFirstObject;

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
    this.isMedianObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMedianObjectProperty' )
    } );
    this.isShowingAnimationHighlightProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingAnimationHighlightProperty' )
    } );
    this.dragStartedEmitter = new Emitter();
  }

  step( dt: number ): void {
    if ( this.isAnimatingProperty.value ) {

      assert && assert( this.targetX !== null, 'targetX should be non-null when animating' );

      const xCoordinates = rk4( this.positionProperty.value.x, this.velocityProperty.value.x, 0, dt );
      const yCoordinates = rk4( this.positionProperty.value.y, this.velocityProperty.value.y, CASConstants.GRAVITY, dt );

      let x = xCoordinates[ 0 ];
      let y = yCoordinates[ 0 ];

      this.velocityProperty.value.x = xCoordinates[ 1 ];
      this.velocityProperty.value.y = yCoordinates[ 1 ];

      let landed = false;

      if ( y <= this.objectType.radius ) {
        x = this.targetX!;
        y = this.objectType.radius;
        landed = true;
        this.valueProperty.value = this.targetX!;
      }

      this.positionProperty.value = new Vector2( x, y );

      if ( landed ) {
        this.isAnimatingProperty.value = false;
        this.dragPositionProperty.value = this.positionProperty.value;
      }
    }
  }

  dispose(): void {
    super.dispose();
    this.positionProperty.dispose();
    this.velocityProperty.dispose();
    this.isAnimatingProperty.dispose();
    this.valueProperty.dispose();
    this.dragPositionProperty.dispose();
    this.isMedianObjectProperty.dispose();
    this.isShowingAnimationHighlightProperty.dispose();
  }

  toStateObject() {
    return {
      objectType: this.objectType.toString(),
      targetX: this.targetX
    };
  }
}

/**
 * 4th order Runge Kutte integration under constant acceleration.  We use this more sophisticated algorithm instead of
 * x=x0+v0t+1/2at^2 because that looked too much like the ball ended a little to the left of the target location,
 * and jumped slightly to the side.
 * See https://mtdevans.com/2013/05/fourth-order-runge-kutta-algorithm-in-javascript-with-demo/
 */
const rk4 = ( x: number, v: number, a: number, dt: number ) => {
  const v2 = v + a * dt / 2;
  const v4 = v + a * dt;

  const xResult = x + dt * ( v + 4 * v2 + v4 ) / 6;
  const vResult = v + a * dt;

  return [ xResult, vResult ];
};

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
    targetX: NullableIO( NumberIO )
  }
} );

centerAndSpread.register( 'CASObject', CASObject );
export default CASObject;