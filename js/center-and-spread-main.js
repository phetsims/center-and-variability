// Copyright 2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CenterAndSpreadScreen from './center-and-spread/CenterAndSpreadScreen.js';
import centerAndSpreadStrings from './centerAndSpreadStrings.js';

const centerAndSpreadTitleString = centerAndSpreadStrings[ 'center-and-spread' ].title;

const simOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
  credits: {
    leadDesign: '',
    softwareDevelopment: '',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( centerAndSpreadTitleString, [
    new CenterAndSpreadScreen( { tandem: Tandem.ROOT.createTandem( 'centerAndSpreadScreen' ) } )
  ], simOptions );
  sim.start();
} );