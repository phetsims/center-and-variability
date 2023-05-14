// Copyright 2023, University of Colorado Boulder
import dotRandom from '../../../../dot/js/dotRandom.js';
import CAVConstants from '../CAVConstants.js';

/**
 * Strategies for how the kick distances are generated. State is represented in the CAVSceneModel for save/load and phet-io
 * customizability.
 *
 * TODO: Move some of that phet-io statefulness here? https://github.com/phetsims/center-and-variability/issues/117
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export type TKickDistanceStrategy = {
  reset(): void;
  getNextKickDistance( kickNumber: number ): number;
  getString(): string;
};

export class SameLocationKickDistanceStrategy implements TKickDistanceStrategy {
  public reset(): void {
    // no-op
  }

  public getNextKickDistance( kickNumber: number ): number {

    // TODO: All console.logs should be behind a query parameter or deleted, see https://github.com/phetsims/center-and-variability/issues/117
    console.log( this.getString() );
    return 5;
  }

  public getString(): string {

    // TODO: Combine these strings with the statefulness keys? https://github.com/phetsims/center-and-variability/issues/117
    return 'SameLocationKickDistanceStrategy';
  }
}

export class DistributionStrategy implements TKickDistanceStrategy {

  public constructor( public distribution: ReadonlyArray<number> ) {
  }

  public getNextKickDistance( kickNumber: number ): number {
    console.log( this.getString() );
    assert && assert( this.distribution.length === CAVConstants.PHYSICAL_RANGE.getLength() + 1, 'weight array should match the model range' );
    return dotRandom.sampleProbabilities( this.distribution ) + 1;
  }

  public reset(): void {

    // Nothing to do
  }

  public getString(): string {
    return 'distribution: ' + this.distribution.join( ', ' );
  }
}

export class RandomSkewStrategy extends DistributionStrategy {

  public constructor() {
    super( RandomSkewStrategy.chooseDistribution() );
  }

  public override reset(): void {
    this.distribution = RandomSkewStrategy.chooseDistribution();
  }

  private static chooseDistribution(): ReadonlyArray<number> {
    return dotRandom.nextBoolean() ? CAVConstants.LEFT_SKEWED_DATA : CAVConstants.RIGHT_SKEWED_DATA;
  }

  public override getString(): string {
    return 'RandomSkewStrategy';
  }
}


export class ExactDistancesStrategy implements TKickDistanceStrategy {
  public constructor( public readonly exactDistances: ReadonlyArray<number> ) {
  }

  public getNextKickDistance( kickNumber: number ): number {
    console.log( this.getString() );
    return this.exactDistances[ kickNumber ];
  }

  public reset(): void {

    // Nothing to do
  }

  public getString(): string {
    return 'exactDistances: ' + this.exactDistances.join( ', ' );
  }
}