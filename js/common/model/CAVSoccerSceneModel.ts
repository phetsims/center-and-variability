// Copyright 2023-2025, University of Colorado Boulder

/**
 * CAVSoccerSceneModel manages the scene's statistical Properties, specifically the median and the data range.
 * In the simulation, the "Median" and "Mean & Median" screens utilize a single instance of this model.
 * Conversely, the "Variability" screen utilizes four instances.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import isResettingAllProperty from '../../../../scenery-phet/js/isResettingAllProperty.js';
import KickDistributionStrategy from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import SoccerSceneModel, { SoccerSceneModelOptions } from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVSoccerBall from './CAVSoccerBall.js';

export default class CAVSoccerSceneModel<T extends CAVSoccerBall = CAVSoccerBall> extends SoccerSceneModel<T> {

  // This Property tracks the maximum and minimum values in the dataset. It is set to null if the dataset is empty.
  public readonly dataRangeProperty: Property<Range | null>;

  // This Property represents the median value in the dataset. It is set to null if the dataset is empty.
  public readonly medianValueProperty: Property<number | null>;

  public constructor( maxKicksProperty: TReadOnlyProperty<number>,
                      maxKicksChoices: number[],
                      kickDistributionStrategy: KickDistributionStrategy,
                      physicalRange: Range,
                      soccerBallFactory: ( isFirstSoccerBall: boolean, tandem: Tandem ) => T,
                      providedOptions: SoccerSceneModelOptions ) {

    const options = providedOptions;

    super( maxKicksProperty, maxKicksChoices, kickDistributionStrategy, physicalRange,
      soccerBallFactory, options );

    this.medianValueProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'medianValueProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioFeatured: true,
      hasListenerOrderDependencies: true
    } );

    this.dataRangeProperty = new Property<Range | null>( null );

    isResettingAllProperty.link( isResetting => {
      if ( !isResetting ) {
        this.updateDataMeasures();
      }
    } );

    // TODO: Most likely you should run this on stateSetEmitter() instead, https://github.com/phetsims/soccer-common/issues/20
    isSettingPhetioStateProperty.link( isSettingPhetioStateProperty => {
      if ( !isSettingPhetioStateProperty ) {
        this.updateDataMeasures();
      }
    } );
    this.updateDataMeasures();
  }

  /**
   * This method updates statistical measures in the model. It is an extension of the base class method
   * with added functionality to calculate and set the median and data range Properties.
   */
  protected override updateDataMeasures(): void {

    super.updateDataMeasures();

    // It is expensive to update data measures, therefore we do not want to do this
    // unnecessarily while setting phetio state.
    if ( this.isClearingData || isSettingPhetioStateProperty.value ) {
      return;
    }

    const sortedObjects = this.getSortedStackedObjects();
    const medianObjects = SoccerSceneModel.getMedianObjectsFromSortedArray( sortedObjects );

    this.soccerBalls.forEach( object => {
      object.isMedianObjectProperty.value = medianObjects.includes( object );
    } );

    if ( sortedObjects.length > 0 ) {

      // For cases where there may be more than one object contributing to the median, we want to take the average.
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