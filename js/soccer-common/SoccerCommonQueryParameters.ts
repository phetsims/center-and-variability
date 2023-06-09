// Copyright 2023, University of Colorado Boulder

/**
 * Query parameters supported by this repo.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from './soccerCommon.js';

const SoccerCommonQueryParameters = QueryStringMachine.getAll( {
  slowAnimation: {
    type: 'flag'
  },
  sameSpot: {
    type: 'flag'
  }
} );

soccerCommon.register( 'SoccerCommonQueryParameters', SoccerCommonQueryParameters );
export default SoccerCommonQueryParameters;