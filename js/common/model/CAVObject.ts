// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Animation from '../../../../twixt/js/Animation.js';
import centerAndVariability from '../../centerAndVariability.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import CAVObjectType from './CAVObjectType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVConstants from '../CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import Emitter from '../../../../axon/js/Emitter.js';
import { AnimationMode } from './AnimationMode.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

type SelfOptions = {
  position?: Vector2;
  velocity?: Vector2;
  value?: number | null;
  isFirstObject?: boolean;
};
export type CAVObjectOptions =
  SelfOptions
  & PhetioObjectOptions
  & PickRequired<PhetioObjectOptions, 'tandem'>;

// TODO: Separate into SoccerBall and DataPoint
export default class CAVObject extends PhetioObject {

  // Continuous value for the drag listener. When dragging, the object snaps to each tickmark
  public readonly dragPositionProperty: Vector2Property;

  // Continuous position during animation. After landing, it's discrete.
  public readonly positionProperty: Vector2Property;
  public readonly velocityProperty: Vector2Property;
  public readonly animationModeProperty: Property<AnimationMode>;
  public readonly isMedianObjectProperty: BooleanProperty;
  public readonly isShowingAnimationHighlightProperty: BooleanProperty;
  public readonly objectType: CAVObjectType;
  public readonly isFirstObject: boolean;
  public readonly disposedEmitter: TEmitter = new Emitter();

  // Where the object is animating to, or null if not yet animating
  public targetX: number | null = null;

  // The value that participates in the data set.
  public valueProperty: Property<number | null>;

  public static readonly CAVObjectIO = new IOType<CAVObject, CAVObjectStateType>( 'CAVObjectIO', {
    valueType: CAVObject,

    // TODO: Delete most of this, see https://github.com/phetsims/center-and-variability/issues/160
    toStateObject: ( cavObject: CAVObject ) => cavObject.toStateObject(),
    stateObjectToCreateElementArguments: ( stateObject: CAVObjectStateType ) => {
      return [ {
        targetX: stateObject.targetX,
        isFirstObject: stateObject.isFirstObject
      } ];
    },
    stateSchema: {
      objectType: EnumerationIO( CAVObjectType ),
      targetX: NullableIO( NumberIO ),
      isFirstObject: BooleanIO
    }
  } );
  public readonly dragStartedEmitter: TEmitter = new Emitter();
  public animation: Animation | null = null;
  public readonly isActiveProperty: BooleanProperty;

  public constructor( objectType: CAVObjectType, providedOptions: CAVObjectOptions ) {

    const options = optionize<CAVObjectOptions, SelfOptions, PhetioObjectOptions>()( {
      position: Vector2.ZERO,
      velocity: Vector2.ZERO,
      phetioType: CAVObject.CAVObjectIO,
      value: null,
      isFirstObject: false
    }, providedOptions );

    super( options );

    this.objectType = objectType;
    this.isFirstObject = options.isFirstObject;

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );
    this.velocityProperty = new Vector2Property( options.velocity, {
      tandem: objectType === CAVObjectType.SOCCER_BALL ?
              options.tandem.createTandem( 'velocityProperty' ) :
              Tandem.OPT_OUT
    } );
    this.animationModeProperty = new EnumerationProperty( AnimationMode.NONE, {
      tandem: options.tandem.createTandem( 'animationModeProperty' )
    } );
    this.dragPositionProperty = new Vector2Property( options.position );
    this.valueProperty = new Property<number | null>( options.value, {
      hasListenerOrderDependencies: true, // TODO: https://github.com/phetsims/center-and-variability/issues/143
      tandem: options.tandem.createTandem( 'valueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );
    this.isMedianObjectProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMedianObjectProperty' )
    } );
    this.isShowingAnimationHighlightProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingAnimationHighlightProperty' )
    } );
    this.isActiveProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isActiveProperty' )
    } );
  }

  public step( dt: number ): void {
    if ( this.animationModeProperty.value === AnimationMode.FLYING ) {

      assert && assert( this.targetX !== null, 'targetX should be non-null when animating' );

      const xCoordinates = rk4( this.positionProperty.value.x, this.velocityProperty.value.x, 0, dt );
      const yCoordinates = rk4( this.positionProperty.value.y, this.velocityProperty.value.y, CAVConstants.GRAVITY, dt );

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
        this.animationModeProperty.value = AnimationMode.NONE;
      }
    }
  }

  public reset(): void {
    this.positionProperty.reset();
    this.velocityProperty.reset();
    this.animationModeProperty.reset();
    this.valueProperty.reset();
    this.dragPositionProperty.reset();
    this.isMedianObjectProperty.reset();
    this.isShowingAnimationHighlightProperty.reset();
    this.isActiveProperty.reset();
    this.targetX = null;
  }

  // TODO: Delete for https://github.com/phetsims/center-and-variability/issues/160
  public toStateObject(): CAVObjectStateType {
    return {
      objectType: this.objectType.toString(),
      targetX: this.targetX,
      isFirstObject: this.isFirstObject
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

type CAVObjectStateType = { objectType: string; targetX: number | null; isFirstObject: boolean };

centerAndVariability.register( 'CAVObject', CAVObject );