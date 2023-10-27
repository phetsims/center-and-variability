// Copyright 2022-2023, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import centerAndVariability from '../centerAndVariability.js';
import { AFRICA_MODEST_QUERY_VALUE, AFRICA_QUERY_VALUE, USA_QUERY_VALUE } from '../../../soccer-common/js/SoccerCommonQueryParameters.js';

const CAVQueryParameters = QueryStringMachine.getAll( {

  // The maximum number of soccer balls that can be kicked within a scene on the 'Mean and Median' and 'Variability' screens
  maxKicks: {
    type: 'number',
    defaultValue: 15,
    validValues: [ 5, 10, 15, 20, 25, 30 ],
    public: true
  },

  // The type of plot shown in the accordion box on the 'Mean & Median' and 'Variability' screens
  // Data points appear as circles for 'dotPlot', and as X's for 'linePlot'
  plotType: {
    type: 'string',
    validValues: [ 'dotPlot', 'linePlot' ],
    defaultValue: 'linePlot',
    public: true
  },

  // Whether to show outliers separately from the box-and-whisker plot in the IQR accordion box of the 'Variability' screen
  showOutliers: {
    type: 'flag',
    public: true
  },

  // Affects the pitch of sounds played when picking up, moving, or dropping a card in the accordion box of the 'Median' screen
  cardMovementSoundPlaybackRate: {
    type: 'number',
    defaultValue: 1.5
  },
  regionAndCulture: {
    type: 'string',
    validValues: [ USA_QUERY_VALUE, AFRICA_QUERY_VALUE, AFRICA_MODEST_QUERY_VALUE ],
    defaultValue: USA_QUERY_VALUE
  }
} );

centerAndVariability.register( 'CAVQueryParameters', CAVQueryParameters );
export default CAVQueryParameters;