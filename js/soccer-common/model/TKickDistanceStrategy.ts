// Copyright 2023, University of Colorado Boulder
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVConstants from '../../common/CAVConstants.js';

/**
 * Strategies for how the kick distances are generated. State is represented in the CAVSceneModel for save/load and phet-io
 * customizability.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

// TODO: This may need to move to the common repo, see: https://github.com/phetsims/center-and-variability/issues/222
// It doesn't seem necessary to bring over all the distributions strategies, but maybe that would be easiest?

export type TKickDistanceStrategy = {
  reset(): void;
  getNextKickDistance( kickNumber: number ): number;
  toStateObject(): string;
};

// These values are used in the state object, should be changed with caution, because changes to the state API
// would require migration rules.
const RANDOM_SKEW_KEY = 'randomSkew';
const PROBABILITY_DISTRIBUTION_KEY = 'probabilityDistributionByDistance';
const EXACT_DISTANCE_KEY = 'exactDistanceByIndex';

export class DistributionStrategy implements TKickDistanceStrategy {

  public constructor( public distribution: ReadonlyArray<number> ) {
  }

  public getNextKickDistance( kickNumber: number ): number {
    phet.chipper.queryParameters.dev && console.log( this.toStateObject() );
    assert && assert( this.distribution.length === CAVConstants.PHYSICAL_RANGE.getLength() + 1, 'weight array should match the model range' );
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

export class RandomSkewStrategy extends DistributionStrategy {

  public constructor( currentDistribution: ReadonlyArray<number> = RandomSkewStrategy.chooseDistribution() ) {
    super( currentDistribution );
  }

  public override reset(): void {
    this.distribution = RandomSkewStrategy.chooseDistribution();
    phet.chipper.queryParameters.dev && console.log( 'Reset RandomSkewStrategy: ' + this.toStateObject() + ', ' + this.distribution.join( ', ' ) );
  }

  private static chooseDistribution(): ReadonlyArray<number> {
    return dotRandom.nextBoolean() ? CAVConstants.LEFT_SKEWED_DATA : CAVConstants.RIGHT_SKEWED_DATA;
  }

  public override toStateObject(): string {
    const name = this.distribution === CAVConstants.LEFT_SKEWED_DATA ? 'currentlyLeftSkewed' : 'currentlyRightSkewed';
    return `${RANDOM_SKEW_KEY}[${name}]`;
  }

  public static override fromStateObject( stateObject: string ): RandomSkewStrategy {
    return new RandomSkewStrategy( stateObject === RANDOM_SKEW_KEY + '[currentlyLeftSkewed]' ? CAVConstants.LEFT_SKEWED_DATA :
                                   CAVConstants.RIGHT_SKEWED_DATA );
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

export function kickDistanceStrategyFromStateObject( stateObject: string ): TKickDistanceStrategy {
  if ( stateObject.startsWith( RANDOM_SKEW_KEY ) ) {
    return RandomSkewStrategy.fromStateObject( stateObject );
  }
  else if ( stateObject.startsWith( PROBABILITY_DISTRIBUTION_KEY ) ) {
    return DistributionStrategy.fromStateObject( stateObject );
  }
  else if ( stateObject.startsWith( EXACT_DISTANCE_KEY ) ) {
    return ExactDistancesStrategy.fromStateObject( stateObject );
  }
  else {
    assert && assert( false, `Unknown distribution type ${stateObject}` );
    throw new Error( `Unknown distribution type ${stateObject}` );
  }
}