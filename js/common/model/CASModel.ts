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

type CASModelSelfOptions = {
  tandem: Tandem
};
export type CASModelOptions = CASModelSelfOptions & {};

class CASModel {
  readonly objectGroup: PhetioGroup<CASObject>;
  readonly objectType: CASObjectType;

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
  }

  // TODO: need options type for CASObject that doesn't include phetio things
  protected createObject( options: any ) {
    return this.objectGroup.createNextElement( this.objectType, options );
  }

  /**
   * Returns all other objects at the target position of the provided object.
   */
  protected getOtherObjectsAtTarget( casObject: CASObject ): CASObject[] {
    return this.objectGroup.filter( ( o: CASObject ) => {
      return !o.isAnimatingProperty.value && o.targetX === casObject.targetX && casObject !== o;
    } );
  }

  /**
   * Set the position of the parameter object to be on top of the other objects at that target position.
   */
  protected moveToTop( casObject: CASObject ): void {

    const objectsAtTarget = this.getOtherObjectsAtTarget( casObject );

    if ( objectsAtTarget.length > 0 ) {
      const topObject = _.maxBy( objectsAtTarget, object => object.positionProperty.value.y )!;
      const targetY = topObject.positionProperty.value.y + topObject.objectType.radius + casObject.objectType.radius;
      casObject.positionProperty.value = new Vector2( casObject.targetX, targetY );
    }
    else {
      casObject.positionProperty.value = new Vector2( casObject.targetX, casObject.objectType.radius );
    }
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
  step( dt: number ): void { // TODO: Specify return values everywhere
    this.objectGroup.forEach( casObject => casObject.step( dt ) );
  }
}

centerAndSpread.register( 'CASModel', CASModel );
export default CASModel;