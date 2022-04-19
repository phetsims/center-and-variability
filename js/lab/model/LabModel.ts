// Copyright 2022, University of Colorado Boulder

/**
 * Model for the "Lab" screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import CAVObjectType from '../../common/model/CAVObjectType.js';
import CAVConstants from '../../common/CAVConstants.js';

type SelfOptions = {};
type LabModelOptions = SelfOptions & CAVModelOptions;

class LabModel extends CAVModel {

  constructor( options: LabModelOptions ) {

    options = optionize<LabModelOptions, SelfOptions, CAVModelOptions>()( {
      tandem: Tandem.REQUIRED
    }, options );

    super( CAVObjectType.DATA_POINT, CAVConstants.NUMBER_OF_OBJECTS_LARGE, options );
  }

  /**
   * Resets the model.
   */
  override reset(): void {
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  override step( dt: number ): void {
  }
}

centerAndVariability.register( 'LabModel', LabModel );
export default LabModel;