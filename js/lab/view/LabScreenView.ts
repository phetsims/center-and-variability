// Copyright 2022, University of Colorado Boulder

/**
 * ScreenView for the "Lab" screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import LabModel from '../model/LabModel.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type LabScreenViewOptions = CAVScreenViewOptions;

class LabScreenView extends CAVScreenView {

  public constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<LabScreenViewOptions, EmptySelfOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, ModelViewTransform2.createIdentity(), options );
  }
}

centerAndVariability.register( 'LabScreenView', LabScreenView );
export default LabScreenView;