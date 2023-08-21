// Copyright 2022-2023, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import centerAndVariability from '../centerAndVariability.js';

const CAVQueryParameters = QueryStringMachine.getAll( {

  maxKicks: {
    type: 'number',
    defaultValue: 15,
    validValues: [ 5, 10, 15, 20, 25, 30 ],
    public: true
  },
  plotType: {
    type: 'string',
    validValues: [ 'dotPlot', 'linePlot' ],
    defaultValue: 'linePlot',
    public: true
  },
  showOutliers: {
    type: 'flag',
    public: true
  },
  cardMovementSoundPlaybackRate: {
    type: 'number',
    defaultValue: 1.5
  }
} );

centerAndVariability.register( 'CAVQueryParameters', CAVQueryParameters );
export default CAVQueryParameters;