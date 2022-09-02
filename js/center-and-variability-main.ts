// Copyright 2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
// import VariabilityScreen from './variability/VariabilityScreen.js';
import centerAndVariabilityStrings from './centerAndVariabilityStrings.js';
import MedianScreen from './median/MedianScreen.js';
import MeanAndMedianScreen from './mean-and-median/MeanAndMedianScreen.js';
import SimulationPreferencesContentNode from './common/view/SimulationPreferencesContentNode.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
// import LabScreen from './lab/LabScreen.js';

const centerAndVariabilityTitleStringProperty = centerAndVariabilityStrings[ 'center-and-variability' ].titleStringProperty;

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Klusendorf, Sam Reid',
    team: 'Kelly Findley, Marilyn Hartzell, Ariel Paul, Kathy Perkins, David Webb',
    qualityAssurance: 'Clifford Hardin, Emily Miller, Devon Quispe, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer'
  },
  preferencesModel: new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: tandem => new SimulationPreferencesContentNode( tandem.createTandem( 'simPreferences' ) )
      } ]
    }
  } )
};

simLauncher.launch( () => {
  const sim = new Sim( centerAndVariabilityTitleStringProperty, [
    new MedianScreen( { tandem: Tandem.ROOT.createTandem( 'medianScreen' ) } ),
    new MeanAndMedianScreen( { tandem: Tandem.ROOT.createTandem( 'meanAndMedianScreen' ) } )
    // , new VariabilityScreen( { tandem: Tandem.ROOT.createTandem( 'variabilityScreen' ) } )
    // , new LabScreen( { tandem: Tandem.ROOT.createTandem( 'labScreen' ) } )
  ], simOptions );
  sim.start();
} );