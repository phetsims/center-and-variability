// Copyright 2023, University of Colorado Boulder

/**
 * PhetioObject that specifies how kick distances are determined. Can be used to specify probability distributions
 * or exact sequences of distances. See phetioDocumentation for more details.
 *
 * This is a container that chooses between specific TKickDistanceStrategy implementations.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import soccerCommon from '../soccerCommon.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import ObjectLiteralIO from '../../../../tandem/js/types/ObjectLiteralIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { TKickDistanceStrategy } from './TKickDistanceStrategy.js';

export default class KickDistanceStrategy extends PhetioObject {
  public constructor(
    public currentStrategy: TKickDistanceStrategy,
    public readonly kickDistanceStrategyFromStateObject: ( string: string ) => TKickDistanceStrategy,
    providedOptions: PhetioObjectOptions ) {

    const pre = '<pre style="display: block; padding: 10px; border: 1px solid #ccc; border-radius: 3px; overflow: auto;">';
    const code = '<code style="background-color: #f9f9f9; font-family: \'Courier New\', Courier, monospace;">';

    const options = optionize<PhetioObjectOptions, EmptySelfOptions, PhetioObjectOptions>()( {
      phetioType: KickDistanceStrategyIO,
      phetioDocumentation: 'The values for the kicks can be specified using the state object. <br><ul>' +
                           `<li>Random Skew: randomly chooses a left or right skewed distribution each time the sim is reset. (Recall that a right-skewed data set means most of the values fall to the left.) ${pre}${code}{ "distributionType": "randomSkew[currentlyRightSkewed]" }</code></pre></li>` +
                           `<li>Probability Distribution by Distance: The distribution of frequencies or probabilities per location on the number line. This is a non-normalized array of non-negative floating point numbers where each number in the array represents the relative likelihood that a ball will land in each position from 1 to 15, in order. e.g., ${pre}${code}{ "distributionType": "probabilityDistributionByDistance[0,0,1,3,5,7,3,3,1,1,0,0,0,0,1]" }</code></pre></li>` +
                           `<li>Exact Location each ball will land (in order) for future kicks. Indicates the exact distance each ball will be kicked in order. Keep in mind the maximum number of kicks may be as high as 30, depending on the selection in the preferences dialog. Whatever kick number is next will be pulled from the array in that position. In other words, if three balls have been kicked, and the user sets the exact location array, the fourth ball will land at the number that's in the fourth position in the array.e.g., ${pre}${code}{ "distributionType": "exactDistanceByIndex[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,2]" }</code></pre></li>`
    }, providedOptions );

    super( options );
  }

  /**
   * Gets the state object for this scene model. Includes the strategy for how kick distances are generated.
   */
  public toStateObject(): CAVSceneModelState {
    return {
      distributionType: this.currentStrategy.toStateObject()
    };
  }

  public applyState( stateObject: CAVSceneModelState ): void {
    this.currentStrategy = this.kickDistanceStrategyFromStateObject( stateObject.distributionType );
  }

  public reset(): void {
    this.currentStrategy.reset();
  }
}

type CAVSceneModelState = { distributionType: string };

// TODO: This adds a new IOType stub into PhetioElementView. Is that how we want to continue doing this? See https://github.com/phetsims/center-and-variability/issues/117 But maybe the long term solution for that problem is https://github.com/phetsims/studio/issues/292
// TODO: Review overlap between getValue/getValue and setState/getState.  Make sure both work correctly and in concert. See https://github.com/phetsims/center-and-variability/issues/117
const KickDistanceStrategyIO = new IOType( 'KickDistanceStrategyIO', {
  valueType: KickDistanceStrategy,
  stateSchema: {
    distributionType: StringIO
  },
  toStateObject: ( distribution: KickDistanceStrategy ) => {
    return distribution.toStateObject();
  },
  applyState: ( distribution: KickDistanceStrategy, stateObject: CAVSceneModelState ) => {
    distribution.applyState( stateObject );
  },
  methods: {
    getValue: {
      returnType: ObjectLiteralIO,
      parameterTypes: [],
      implementation: function( this: KickDistanceStrategy ) {
        return this.toStateObject();
      },
      documentation: 'Gets the current value of the CAVSceneModel'
    },
    getValidationError: {
      returnType: NullableIO( StringIO ),
      parameterTypes: [ ObjectLiteralIO ],
      implementation: function( this: KickDistanceStrategy, value: CAVSceneModelState ) {

        // TODO: check validation, see https://github.com/phetsims/center-and-variability/issues/117
        return null;
      },
      documentation: 'Checks to see if a proposed value is valid. Returns the first validation error, or null if the value is valid.'
    },
    setValue: {
      returnType: VoidIO,
      parameterTypes: [ ObjectLiteralIO ],
      documentation: 'Sets the value for the scene model, including the kick distance strategy.',
      implementation: function( this: KickDistanceStrategy, state: CAVSceneModelState ) {
        this.applyState( state );
      }
    }
  }
} );

soccerCommon.register( 'KickDistanceStrategy', KickDistanceStrategy );