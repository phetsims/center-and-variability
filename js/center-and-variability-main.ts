// Copyright 2022-2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CenterAndVariabilityStrings from './CenterAndVariabilityStrings.js';
import MedianScreen from './median/MedianScreen.js';
import SimulationPreferencesContentNode from './common/view/SimulationPreferencesContentNode.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import MeanAndMedianScreen from './mean-and-median/MeanAndMedianScreen.js';
import VariabilityScreen from './variability/VariabilityScreen.js';
import SoccerCommonPreferencesModel from '../../soccer-common/js/model/SoccerCommonPreferencesModel.js';
import KickerCharacterSets from '../../soccer-common/js/view/KickerCharacterSets.js';

const centerAndVariabilityTitleStringProperty = CenterAndVariabilityStrings[ 'center-and-variability' ].titleStringProperty;
const preferencesModel = new SoccerCommonPreferencesModel();

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'Cathy Carter, Amanda McGarry',
    softwareDevelopment: 'Matthew Blackman, Chris Klusendorf, Sam Reid, Marla Schulz',
    team: 'Kelly Findley, Marilyn Hartzell, Ariel Paul, Kathy Perkins, David Webb',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Emily Miller, Devon Quispe, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer'
  },
  preferencesModel: new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: tandem => new SimulationPreferencesContentNode( phet.joist.sim.topLayer, tandem.createTandem( 'simPreferences' ) )
      } ]
    },
    localizationOptions: {
      characterSets: KickerCharacterSets.CHARACTER_SETS
    }
  } ),
  phetioDesigned: true
};

simLauncher.launch( () => {
  const sim = new Sim( centerAndVariabilityTitleStringProperty, [
    new MedianScreen( preferencesModel, { tandem: Tandem.ROOT.createTandem( 'medianScreen' ) } ),
    new MeanAndMedianScreen( preferencesModel, { tandem: Tandem.ROOT.createTandem( 'meanAndMedianScreen' ) } ),
    new VariabilityScreen( preferencesModel, { tandem: Tandem.ROOT.createTandem( 'variabilityScreen' ) } )
  ], simOptions );
  sim.start();
} );