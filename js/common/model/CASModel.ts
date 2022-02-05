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
export type CASModelOptions = CASModelSelfOptions & PhetioObjectOptions & Required<Pick<PhetioObjectOptions, 'tandem'>>; // TODO: Do we like the inline exports?  SR: Yes

class CASModel {
  readonly objectGroup: PhetioGroup<CASObject>;
  readonly objectType: CASObjectType;

  constructor( objectType: CASObjectType, providedOptions: CASModelOptions ) {

    const options = optionize<CASModelOptions, CASModelSelfOptions, PhetioObjectOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    this.objectType = objectType;

    // @public {PhetioGroup}
    this.objectGroup = new PhetioGroup( ( tandem, objectType: CASObjectType, options ) => {

      // TODO: Optionize please
      options.tandem = tandem;

      return new CASObject( objectType, options );
    }, [ objectType, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( CASObject.CASObjectIO ),
      tandem: options.tandem.createTandem( objectType === CASObjectType.SOCCER_BALL ? 'soccerBallGroup' : 'dataPointGroup' )
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