// Copyright 2022-2025, University of Colorado Boulder

/**
 * The MeanAndMedianScreen represents the entire Mean & Median screen in the simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import meanAndMedianScreenIcon_png from '../../images/meanAndMedianScreenIcon_png.js';
import centerAndVariability from '../centerAndVariability.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import MeanAndMedianModel from './model/MeanAndMedianModel.js';
import MeanAndMedianKeyboardHelpNode from './view/MeanAndMedianKeyboardHelpNode.js';
import MeanAndMedianScreenView from './view/MeanAndMedianScreenView.js';
import CAVSoccerSceneModel from '../common/model/CAVSoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianScreenOptions = SelfOptions & StrictOmit<CAVScreenOptions, 'name' | 'homeScreenIcon' | 'createKeyboardHelpNode'>;

export default class MeanAndMedianScreen extends CAVScreen<CAVSoccerSceneModel, MeanAndMedianModel, MeanAndMedianScreenView> {

  public constructor( providedOptions: MeanAndMedianScreenOptions ) {

    const options = optionize<MeanAndMedianScreenOptions, SelfOptions, CAVScreenOptions>()( {
      name: CenterAndVariabilityStrings.screen.meanAndMedianStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( meanAndMedianScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      createKeyboardHelpNode: () => new MeanAndMedianKeyboardHelpNode(),
      screenButtonsHelpText: CenterAndVariabilityStrings.a11y.meanAndMedianScreenHelpTextStringProperty
    }, providedOptions );

    super(
      () => new MeanAndMedianModel( {
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