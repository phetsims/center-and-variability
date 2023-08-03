// Copyright 2022-2023, University of Colorado Boulder

/**
 * "Mean & Median" screen
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
import SoccerCommonPreferencesModel from '../../../soccer-common/js/model/SoccerCommonPreferencesModel.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianScreenOptions = SelfOptions & StrictOmit<CAVScreenOptions, 'name' | 'homeScreenIcon'>;

export default class MeanAndMedianScreen extends CAVScreen<MeanAndMedianModel, MeanAndMedianScreenView> {

  public constructor( preferencesModel: SoccerCommonPreferencesModel, providedOptions: MeanAndMedianScreenOptions ) {

    const options = optionize<MeanAndMedianScreenOptions, SelfOptions, CAVScreenOptions>()( {
      name: CenterAndVariabilityStrings.screen.meanAndMedianStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( meanAndMedianScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
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