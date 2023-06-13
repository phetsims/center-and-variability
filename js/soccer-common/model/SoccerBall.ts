// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class for a manipulable data point which could be a soccer ball or, in the lab screen, a colored sphere.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

// TODO: This needs to move to the common repo, see: https://github.com/phetsims/center-and-variability/issues/222
// Can the isQ1ObjectProperty be stripped out? If so we'll want everything except for:
// isMedianObjectProperty, isQ1ObjectProperty, isQ3ObjectProperty... we also probably don't need
// isAnimationHighlightVisibleProperty


import Animation from '../../../../twixt/js/Animation.js';
import soccerCommon from '../soccerCommon.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import Emitter from '../../../../axon/js/Emitter.js';
import { SoccerBallPhase } from './SoccerBallPhase.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import SoccerPlayer from './SoccerPlayer.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberTone from './NumberTone.js';
import SoccerCommonConstants from '../SoccerCommonConstants.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
export type SoccerBallOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

// Global counter for debugging
let count = 0;

export default class SoccerBall extends PhetioObject {

  // Continuous value for the drag listener. When dragging, the object snaps to each tickmark. This is an implementation
  // detail for the drag listener that is only used for deltas, and the absolute value does not matter.
  // Therefore, it should not be reset (because resetting it would take the model through an incorrect transient state).
  public readonly dragPositionProperty: Vector2Property;

  // Continuous position during animation. After landing, it's discrete.
  public readonly positionProperty: Vector2Property;
  public readonly velocityProperty: Vector2Property;
  public readonly soccerBallPhaseProperty: Property<SoccerBallPhase>;

  // Where the object is animating to, or null if not yet animating
  public targetXProperty: Property<number | null>;

  // The value that participates in the data set.
  public valueProperty: Property<number | null>;

  public readonly dragStartedEmitter: TEmitter = new Emitter();
  public readonly resetEmitter: TEmitter = new Emitter();

  public animation: Animation | null = null;
  public soccerPlayer: SoccerPlayer | null = null;

  // Global index for debugging
  public readonly index = count++;

  public readonly soccerBallLandedEmitter = new Emitter<[ SoccerBall ]>( {
    parameters: [ { valueType: SoccerBall } ]
  } );

  public constructor( public readonly isFirstSoccerBall: boolean, providedOptions: SoccerBallOptions ) {

    const options = optionize<SoccerBallOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );
    super( options );

    this.positionProperty = new Vector2Property( new Vector2( 0, SoccerCommonConstants.SOCCER_BALL_RADIUS ), {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      valueComparisonStrategy: 'equalsFunction',
      phetioReadOnly: true
    } );
    this.velocityProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: options.tandem.createTandem( 'velocityProperty' )
    } );
    this.soccerBallPhaseProperty = new EnumerationProperty( isFirstSoccerBall ? SoccerBallPhase.READY : SoccerBallPhase.INACTIVE, {
      tandem: options.tandem.createTandem( 'soccerBallPhaseProperty' )
    } );
    this.dragPositionProperty = new Vector2Property( this.positionProperty.value.copy() );
    this.valueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'valueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.targetXProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'targetXProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );
  }

  // this doesn't change the soccerBallPhaseProperty of the soccerBall - that is done by the ball animationEnded callback
  public clearAnimation(): void {
    if ( this.animation ) {
      this.animation.stop();
      this.animation = null;
    }
  }

  public step( dt: number ): void {
    if ( this.soccerBallPhaseProperty.value === SoccerBallPhase.FLYING ) {

      assert && assert( this.targetXProperty.value !== null, 'targetXProperty.value should be non-null when animating' );

      const xCoordinates = rk4( this.positionProperty.value.x, this.velocityProperty.value.x, 0, dt );
      const yCoordinates = rk4( this.positionProperty.value.y, this.velocityProperty.value.y, SoccerCommonConstants.GRAVITY, dt );

      let x = xCoordinates[ 0 ];
      let y = yCoordinates[ 0 ];

      this.velocityProperty.value.x = xCoordinates[ 1 ];
      this.velocityProperty.value.y = yCoordinates[ 1 ];

      let landed = false;

      if ( y <= SoccerCommonConstants.SOCCER_BALL_RADIUS ) {
        x = this.targetXProperty.value!;
        y = SoccerCommonConstants.SOCCER_BALL_RADIUS;
        landed = true;
        this.valueProperty.value = this.targetXProperty.value!;
      }

      this.positionProperty.value = new Vector2( x, y );

      if ( landed ) {
        this.soccerBallLandedEmitter.emit( this );
        NumberTone.play( x );
      }
    }
  }

  /**
   * Restore the initial conditions.
   *
   * NOTE: Do not reset the dragPositionProperty, since it is an implementation detail for the drag listener. Resetting
   * would take listeners through an incorrect transient state.
   */
  public reset(): void {
    this.clearAnimation();
    this.positionProperty.reset();
    this.velocityProperty.reset();
    this.soccerBallPhaseProperty.reset();
    this.valueProperty.reset();

    this.targetXProperty.value = null;
    this.soccerPlayer = null;

    this.resetEmitter.emit();
  }

  // TODO: https://github.com/phetsims/center-and-variability/issues/222 check if the order matters, etc.
  // public resetTemplateMethod(): void {
  //
  //   // Override if there are subclass things to reset
  // }
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

soccerCommon.register( 'SoccerBall', SoccerBall );