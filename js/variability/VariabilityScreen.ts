// Copyright 2022-2024, University of Colorado Boulder

/**
 * Screen for the "Variability" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import { Image } from '../../../scenery/js/imports.js';
import centerAndVariability from '../centerAndVariability.js';
import VariabilityModel from './model/VariabilityModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import VariabilityScreenView from './view/VariabilityScreenView.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';
import variabilityScreenIcon_png from '../../images/variabilityScreenIcon_png.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import VariabilityKeyboardHelpNode from './view/VariabilityKeyboardHelpNode.js';

type SelfOptions = EmptySelfOptions;
type VariabilityScreenOptions = SelfOptions & StrictOmit<CAVScreenOptions, 'name' | 'homeScreenIcon' | 'createKeyboardHelpNode'>;

export default class VariabilityScreen extends CAVScreen<VariabilityModel, VariabilityScreenView> {

  public constructor( providedOptions: VariabilityScreenOptions ) {

    const options = optionize<VariabilityScreenOptions, SelfOptions, CAVScreenOptions>()( {
      name: CenterAndVariabilityStrings.screen.variabilityStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( variabilityScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      createKeyboardHelpNode: () => new VariabilityKeyboardHelpNode()
    }, providedOptions );

    super(
      () => new VariabilityModel( {
        tandem: options.tandem.createTandem( 'model' )
      } ),
      ( model: VariabilityModel ) => new VariabilityScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndVariability.register( 'VariabilityScreen', VariabilityScreen );