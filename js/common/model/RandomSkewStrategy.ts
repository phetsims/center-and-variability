// Copyright 2022-2023, University of Colorado Boulder
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVConstants from '../CAVConstants.js';
import { DistributionStrategy, ExactDistancesStrategy, TKickDistanceStrategy } from '../../soccer-common/model/TKickDistanceStrategy.js';

// These values are used in the state object, should be changed with caution, because changes to the state API
// would require migration rules.
const RANDOM_SKEW_KEY = 'randomSkew';
const PROBABILITY_DISTRIBUTION_KEY = 'probabilityDistributionByDistance';
const EXACT_DISTANCE_KEY = 'exactDistanceByIndex';

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

// TODO: https://github.com/phetsims/center-and-variability/issues/117 this looks fragile,
// can we use state schema where the keys are like type: randomSkew, etc?
// Also keep in mind we have to support Mean: Share and Balance and Center and Variability
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