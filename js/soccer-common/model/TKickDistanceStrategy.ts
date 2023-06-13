// Copyright 2023, University of Colorado Boulder
import dotRandom from '../../../../dot/js/dotRandom.js';

/**
 * Strategies for how the kick distances are generated. State is represented in the CAVSceneModel for save/load and phet-io
 * customizability.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export type TKickDistanceStrategy = {
  reset(): void;
  getNextKickDistance( kickNumber: number ): number;
  toStateObject(): string;
};

// These values are used in the state object, should be changed with caution, because changes to the state API
// would require migration rules.
const PROBABILITY_DISTRIBUTION_KEY = 'probabilityDistributionByDistance';
const EXACT_DISTANCE_KEY = 'exactDistanceByIndex';

export class DistributionStrategy implements TKickDistanceStrategy {

  public constructor( public distribution: ReadonlyArray<number> ) {
  }

  public getNextKickDistance( kickNumber: number ): number {
    phet.chipper.queryParameters.dev && console.log( this.toStateObject() );
    return dotRandom.sampleProbabilities( this.distribution ) + 1;
  }

  public reset(): void {

    // Nothing to do
  }

  public toStateObject(): string {
    return `${PROBABILITY_DISTRIBUTION_KEY}[${this.distribution.join( ', ' )}]`;
  }

  public static fromStateObject( stateObject: string ): DistributionStrategy {
    const distribution = stateObject.substring( PROBABILITY_DISTRIBUTION_KEY.length + 1, stateObject.length - 1 ).split( ',' ).map( x => Number( x ) );
    return new DistributionStrategy( distribution );
  }
}

export class ExactDistancesStrategy implements TKickDistanceStrategy {
  public constructor( public readonly exactDistances: ReadonlyArray<number> ) {
  }

  public getNextKickDistance( kickNumber: number ): number {
    phet.chipper.queryParameters.dev && console.log( this.toStateObject() );
    return this.exactDistances[ kickNumber ];
  }

  public reset(): void {

    // Nothing to do
  }

  public toStateObject(): string {
    return `${EXACT_DISTANCE_KEY}[${this.exactDistances.join( ', ' )}]`;
  }

  public static fromStateObject( stateObject: string ): ExactDistancesStrategy {
    const exactDistances = stateObject.substring( EXACT_DISTANCE_KEY.length + 1, stateObject.length - 1 ).split( ',' ).map( x => Number( x ) );
    return new ExactDistancesStrategy( exactDistances );
  }
}