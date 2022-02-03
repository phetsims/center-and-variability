// Copyright 2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import SpreadScreen from './spread/SpreadScreen.js';
import centerAndSpreadStrings from './centerAndSpreadStrings.js';
import MedianScreen from './median/MedianScreen.js';
import MeanAndMedianScreen from './mean-and-median/MeanAndMedianScreen.js';
import LabScreen from './lab/LabScreen.js';

const centerAndSpreadTitleString = centerAndSpreadStrings[ 'center-and-spread' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Klusendorf, Sam Reid',
    team: 'Dor Abrahamson, Kelly Findley, Marily Hartzell, Ariel Paul, Kathy Perkins, David Webb',
    qualityAssurance: 'Logan Bray, Clifford Hardin, Brooklyn Lash, Emily Miller, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer'
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( centerAndSpreadTitleString, [
    new MedianScreen( { tandem: Tandem.ROOT.createTandem( 'medianScreen' ) } ),
    new MeanAndMedianScreen( { tandem: Tandem.ROOT.createTandem( 'meanAndMedianScreen' ) } ),
    new SpreadScreen( { tandem: Tandem.ROOT.createTandem( 'spreadScreen' ) } ),
    new LabScreen( { tandem: Tandem.ROOT.createTandem( 'labScreen' ) } )
  ], simOptions );
  sim.start();
} );