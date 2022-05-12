// Copyright 2022, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import centerAndVariability from '../centerAndVariability.js';

const CAVQueryParameters = QueryStringMachine.getAll( {

  // TODO: It would be nice if QueryStringMachine supported mapping to EnumerationValue
  // TODO SR: Or should we bring back StringEnumerationProperty in https://github.com/phetsims/axon/issues/394?
  // TODO SR: Or both?
  plotType: {
    type: 'string',
    validValues: [ 'dotPlot', 'linePlot' ],
    defaultValue: 'linePlot',
    public: true
  }
} );

centerAndVariability.register( 'CAVQueryParameters', CAVQueryParameters );
export default CAVQueryParameters;