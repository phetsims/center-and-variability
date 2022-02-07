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

type CASObjectSelfOptions = {
  position?: Vector2,
  velocity?: Vector2,
  targetX: number
};
export type CASObjectOptions =
  CASObjectSelfOptions
  & PhetioObjectOptions
  & Required<Pick<PhetioObjectOptions, 'tandem'>>;

class CASObject extends PhetioObject {
  readonly positionProperty: Vector2Property; // in model coordinates
  readonly velocityProperty: Vector2Property;
  static CASObjectIO: IOType;
  readonly objectType: CASObjectType;
  private readonly targetX: number;

  constructor( objectType: CASObjectType, providedOptions: CASObjectOptions ) {

    const options = optionize<CASObjectOptions, CASObjectSelfOptions, PhetioObjectOptions>( {
      position: Vector2.ZERO,
      velocity: Vector2.ZERO,
      tandem: Tandem.REQUIRED,
      phetioType: CASObject.CASObjectIO,
      phetioDynamicElement: true
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
  }

  step( dt: number ) {
    const GRAVITY_ACCELERATION = new Vector2( 0, -9.8 );

    let x = this.positionProperty.value.x + this.velocityProperty.value.x * dt;
    let y = this.positionProperty.value.y + this.velocityProperty.value.y * dt + 1 / 2 * ( -9.8 ) * dt * dt;

    if ( y <= this.objectType.radius ) {
      x = this.targetX;
      y = this.objectType.radius;

      // TODO: after landing, pop to the top of the stack and become interactive
    }

    // velocity = v0+at
    this.velocityProperty.value = this.velocityProperty.value.plus( GRAVITY_ACCELERATION.timesScalar( dt ) );
    this.positionProperty.value = new Vector2( x, y );
  }

  dispose() {
    super.dispose();
    this.positionProperty.dispose();
    this.velocityProperty.dispose();
  }
}

CASObject.CASObjectIO = new IOType( 'CASObjectIO', {
  valueType: CASObject,
  toStateObject: ( casObject: CASObject ) => ( {
    objectType: casObject.objectType.toString()
  } ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [
      stateObject.objectType === 'SOCCER_BALL' ? CASObjectType.SOCCER_BALL : CASObjectType.DATA_POINT, {} ]; // TODO: Empty curly braces???
  },
  stateSchema: {
    objectType: EnumerationIO( CASObjectType ),
    radius: NumberIO
  }
} );

centerAndSpread.register( 'CASObject', CASObject );
export default CASObject;