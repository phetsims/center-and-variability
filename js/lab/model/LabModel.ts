// Copyright 2022, University of Colorado Boulder

/**
 * Model for the "Lab" screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import CAVObjectType from '../../common/model/CAVObjectType.js';
import CAVConstants from '../../common/CAVConstants.js';

type SelfOptions = EmptySelfOptions;
type LabModelOptions = SelfOptions & CAVModelOptions;

class LabModel extends CAVModel {

  public constructor( options: LabModelOptions ) {

    options = optionize<LabModelOptions, SelfOptions, CAVModelOptions>()( {
      tandem: Tandem.REQUIRED
    }, options );

    super( CAVObjectType.DATA_POINT, CAVConstants.NUMBER_OF_OBJECTS_LARGE, options );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    // See subclass for implementation
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    // See subclass for implementation
  }
}

centerAndVariability.register( 'LabModel', LabModel );
export default LabModel;