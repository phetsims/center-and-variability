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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import CASObjectType from './CASObjectType.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type CASObjectSelfOptions = {
  initialPosition?: Vector2,
  radius?: number
  objectType: CASObjectType // TODO: move to parameter
};
export type CASObjectOptions =
  CASObjectSelfOptions
  & PhetioObjectOptions
  & Required<Pick<PhetioObjectOptions, 'tandem'>>;

class CASObject extends PhetioObject {
  readonly positionProperty: Vector2Property; // in model coordinates
  readonly radius: number;
  readonly velocityProperty: NumberProperty;
  static CASObjectIO: IOType;
  readonly objectType: CASObjectType;

  // TODO: Move velocity here, and just use creative tandems for studio.

  constructor( providedOptions: CASObjectOptions ) {
    console.log( providedOptions.tandem.phetioID );

    const options = optionize<CASObjectOptions, CASObjectSelfOptions, PhetioObjectOptions>( {
      initialPosition: Vector2.ZERO,
      radius: 15,

      // phet-io options
      tandem: Tandem.REQUIRED,
      phetioType: CASObject.CASObjectIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.radius = options.radius;
    this.objectType = options.objectType;

    this.positionProperty = new Vector2Property( options.initialPosition, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );
    this.velocityProperty = new NumberProperty( 0, {
      tandem: options.objectType === CASObjectType.SOCCER_BALL ?
              options.tandem.createTandem( 'velocityProperty' ) :
              Tandem.OPT_OUT
    } );
  }

  reset() {
    this.positionProperty.reset();
  }

  dispose() {
    super.dispose();
    this.positionProperty.dispose();
    this.velocityProperty.dispose();
  }
}

// TODO: Why isn't that automatically done for us?
CASObject.CASObjectIO = new IOType( 'CASObjectIO', {
  valueType: CASObject,
  toStateObject: ( casObject: CASObject ) => ( {
    objectType: casObject.objectType.toString(),
    radius: casObject.radius
  } ),
  stateToArgsForConstructor: ( stateObject: any ) => [ {
    objectType: stateObject.objectType === 'SOCCER_BALL' ? CASObjectType.SOCCER_BALL : CASObjectType.DATA_POINT,
    radius: stateObject.radius
  } ],
  stateSchema: {
    objectType: StringIO,
    radius: NumberIO
  }
} );

centerAndSpread.register( 'CASObject', CASObject );
export default CASObject;