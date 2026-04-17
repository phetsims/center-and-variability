// Copyright 2022-2025, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CenterAndVariabilityStrings from './CenterAndVariabilityStrings.js';
import SimulationPreferencesContentNode from './common/view/SimulationPreferencesContentNode.js';
import MeanAndMedianScreen from './mean-and-median/MeanAndMedianScreen.js';
import MedianScreen from './median/MedianScreen.js';
import VariabilityScreen from './variability/VariabilityScreen.js';

const centerAndVariabilityTitleStringProperty = CenterAndVariabilityStrings[ 'center-and-variability' ].titleStringProperty;
const preferencesModel = new PreferencesModel( {
  simulationOptions: {
    customPreferences: [ {
      createContent: tandem => new SimulationPreferencesContentNode( phet.joist.sim.topLayer, tandem.createTandem( 'simPreferences' ) )
    } ]
  }
} );

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'Cathy Carter, Amanda McGarry',
    softwareDevelopment: 'Matthew Blackman, Chris Klusendorf, Sam Reid, Marla Schulz',
    team: 'Kelly Findley, Marilyn Hartzell, Ariel Paul, Kathy Perkins, Taliesin Smith, David Webb',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Emily Miller, Matthew Moore, Valentina Pérez, Devon Quispe, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer, Amanda McGarry'
  },
  preferencesModel: preferencesModel,
  phetioDesigned: true,
  webgl: true
};

simLauncher.launch( () => {
  const sim = new Sim( centerAndVariabilityTitleStringProperty, [
    new MedianScreen( { tandem: Tandem.ROOT.createTandem( 'medianScreen' ) } ),
    new MeanAndMedianScreen( { tandem: Tandem.ROOT.createTandem( 'meanAndMedianScreen' ) } ),
    new VariabilityScreen( { tandem: Tandem.ROOT.createTandem( 'variabilityScreen' ) } )
  ], simOptions );
  sim.start();
} );