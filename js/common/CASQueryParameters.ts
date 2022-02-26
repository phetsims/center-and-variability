// Copyright 2022, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import centerAndSpread from '../centerAndSpread.js';

const CASQueryParameters = QueryStringMachine.getAll( {

  // Internal use only
} );

centerAndSpread.register( 'CASQueryParameters', CASQueryParameters );
export default CASQueryParameters;