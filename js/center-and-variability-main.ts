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
// import VariabilityScreen from './variability/VariabilityScreen.js';
import centerAndVariabilityStrings from './centerAndVariabilityStrings.js';
import MedianScreen from './median/MedianScreen.js';
import MeanAndMedianScreen from './mean-and-median/MeanAndMedianScreen.js';
import GlobalOptionsNode from './common/view/GlobalOptionsNode.js';
// import LabScreen from './lab/LabScreen.js';

const centerAndVariabilityTitleString = centerAndVariabilityStrings[ 'center-and-variability' ].title;


const simOptions = {
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Klusendorf, Sam Reid',
    team: 'Kelly Findley, Marilyn Hartzell, Ariel Paul, Kathy Perkins, David Webb',
    qualityAssurance: 'Nancy Salpepi, Kathryn Woessner, Devon Quispe',
    graphicArts: 'Mariah Hermsmeyer'
  },
  createOptionsDialogContent: ( tandem: Tandem ) => new GlobalOptionsNode( tandem )
};

simLauncher.launch( () => {
  const sim = new Sim( centerAndVariabilityTitleString, [
    new MedianScreen( { tandem: Tandem.ROOT.createTandem( 'medianScreen' ) } ),
    new MeanAndMedianScreen( { tandem: Tandem.ROOT.createTandem( 'meanAndMedianScreen' ) } )
    // , new VariabilityScreen( { tandem: Tandem.ROOT.createTandem( 'variabilityScreen' ) } )
    // , new LabScreen( { tandem: Tandem.ROOT.createTandem( 'labScreen' ) } )
  ], simOptions );
  sim.start();
} );