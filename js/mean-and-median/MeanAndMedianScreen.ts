// Copyright 2022-2023, University of Colorado Boulder

/**
 * The MeanAndMedianScreen class represents the entire Mean & Median screen
 * in the simulation. It initializes and integrates the corresponding model and view.
 * Additionally, it specifies default configurations such as the name of the screen,
 * an associated icon for the home screen, and a function to create a keyboard help node.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image } from '../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import centerAndVariability from '../centerAndVariability.js';
import MeanAndMedianModel from './model/MeanAndMedianModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import MeanAndMedianScreenView from './view/MeanAndMedianScreenView.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import meanAndMedianScreenIcon_png from '../../images/meanAndMedianScreenIcon_png.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import MeanAndMedianKeyboardHelpNode from './view/MeanAndMedianKeyboardHelpNode.js';
import PreferencesModel from '../../../joist/js/preferences/PreferencesModel.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianScreenOptions = SelfOptions & StrictOmit<CAVScreenOptions, 'name' | 'homeScreenIcon' | 'createKeyboardHelpNode'>;

export default class MeanAndMedianScreen extends CAVScreen<MeanAndMedianModel, MeanAndMedianScreenView> {

  public constructor( preferencesModel: PreferencesModel, providedOptions: MeanAndMedianScreenOptions ) {

    const options = optionize<MeanAndMedianScreenOptions, SelfOptions, CAVScreenOptions>()( {
      name: CenterAndVariabilityStrings.screen.meanAndMedianStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( meanAndMedianScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      createKeyboardHelpNode: () => new MeanAndMedianKeyboardHelpNode()
    }, providedOptions );

    super(
      () => new MeanAndMedianModel( preferencesModel, {
        tandem: options.tandem.createTandem( 'model' )
      } ),
      model => new MeanAndMedianScreenView( model, {
        tandem: options.tandem.createTandem( 'view' )
      } ),
      options
    );
  }
}

centerAndVariability.register( 'MeanAndMedianScreen', MeanAndMedianScreen );