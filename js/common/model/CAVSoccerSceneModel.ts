// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of the SoccerScene Model. Tracks the median, and data range for the scene.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerSceneModel, { SoccerSceneModelOptions } from '../../soccer-common/model/SoccerSceneModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { TKickDistanceStrategy } from '../../soccer-common/model/TKickDistanceStrategy.js';
import Range from '../../../../dot/js/Range.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import CAVSoccerBall from './CAVSoccerBall.js';

type CAVSoccerSceneModelOptions = EmptySelfOptions & SoccerSceneModelOptions;

export default class CAVSoccerSceneModel extends SoccerSceneModel<CAVSoccerBall> {

  // Indicates the max and min values in the data set, or null if there are no values in the data set
  public readonly dataRangeProperty: Property<Range | null>;
  public readonly medianValueProperty: Property<number | null>;

  public constructor( maxKicksProperty: TReadOnlyProperty<number>,
                      maxKicksChoices: number[],
                      kickDistanceStrategy: TKickDistanceStrategy,
                      physicalRange: Range,
                      kickDistanceStrategyFromStateObject: ( string: string ) => TKickDistanceStrategy,
                      providedOptions: CAVSoccerSceneModelOptions ) {

    const options = providedOptions;
    super( maxKicksProperty, maxKicksChoices, kickDistanceStrategy, physicalRange,
      kickDistanceStrategyFromStateObject, CAVSoccerBall.createSoccerBall, options );

    this.medianValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'medianValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true
    } );

    this.dataRangeProperty = new Property<Range | null>( null );
  }

  protected override updateDataMeasures(): void {

    super.updateDataMeasures();

    if ( this.isClearingData ) {
      return;
    }

    const sortedObjects = this.getSortedStackedObjects();
    const medianObjects = SoccerSceneModel.getMedianObjectsFromSortedArray( sortedObjects );

    this.soccerBalls.forEach( object => {
      object.isMedianObjectProperty.value = medianObjects.includes( object );
    } );

    if ( sortedObjects.length > 0 ) {

      // take the average to account for cases where there is more than one object contributing to the median
      this.medianValueProperty.value = _.mean( medianObjects.map( soccerBall => soccerBall.valueProperty.value ) );

      const min = sortedObjects[ 0 ].valueProperty.value!;
      const max = sortedObjects[ sortedObjects.length - 1 ].valueProperty.value!;
      this.dataRangeProperty.value = new Range( min, max );

      assert && assert( !isNaN( this.medianValueProperty.value ) );
    }
    else {
      this.medianValueProperty.value = null;
      this.dataRangeProperty.value = null;
    }

  }
}

centerAndVariability.register( 'CAVSoccerSceneModel', CAVSoccerSceneModel );