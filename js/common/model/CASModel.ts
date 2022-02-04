// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the model in every screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import centerAndSpread from '../../centerAndSpread.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASObject from './CASObject.js';
import CASObjectType from './CASObjectType.js';

type CASModelSelfOptions = {};
export type CASModelOptions = CASModelSelfOptions & PhetioObjectOptions & Required<Pick<PhetioObjectOptions, 'tandem'>>; // TODO: Do we like the inline exports?

class CASModel {
  objectGroup: PhetioGroup<CASObject>;

  constructor( objectType: CASObjectType, providedOptions: CASModelOptions ) {

    const options = optionize<CASModelOptions, CASModelSelfOptions, PhetioObjectOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // @public {PhetioGroup}
    this.objectGroup = new PhetioGroup( ( tandem, options ) => {

      // TODO: Optionize please
      options.tandem = tandem;

      // TODO: Should not be soccer ball
      return new CASObject( options );
    }, [ { objectType: objectType } ], {
      phetioType: PhetioGroup.PhetioGroupIO( CASObject.CASObjectIO ),
      tandem: options.tandem.createTandem( 'objectGroup' )
    } );
  }

  /**
   * Resets the model.
   */
  reset() {
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  step( dt: number ) {
  }
}

centerAndSpread.register( 'CASModel', CASModel );
export default CASModel;