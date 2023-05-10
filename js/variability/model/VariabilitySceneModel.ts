// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Variability" screen. This has 4 scene models with different distributions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import CAVSceneModel from '../../common/model/CAVSceneModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VariabilityModel from './VariabilityModel.js';
import SoccerBall from '../../common/model/SoccerBall.js';
import CAVConstants from '../../common/CAVConstants.js';

export default class VariabilitySceneModel extends CAVSceneModel {

  private readonly initialized: boolean = false;

  public constructor( maxKicksProperty: TReadOnlyProperty<number>, distribution: ReadonlyArray<number>, options: { tandem: Tandem } ) {
    super( maxKicksProperty, CAVConstants.MAX_KICKS_VALUES, distribution, options );

    this.updateDataMeasures();
    this.initialized = true;
  }

  public resetScene(): void {

    // Nothing to do here, the distribution is set in the constructor (and not re-randomized like in the other screens)
  }

  protected override updateDataMeasures(): void {
    super.updateDataMeasures();

    if ( this.initialized ) {
      const sortedObjects = this.getSortedLandedObjects();

      // if there is enough data to calculate quartiles
      if ( sortedObjects.length >= 5 ) {

        // Split the array into lower and upper halves, ignoring the median value if there are an odd number of objects
        const splitIndex = Math.floor( sortedObjects.length / 2 );
        const lowerHalf = sortedObjects.slice( 0, splitIndex );
        const upperHalf = sortedObjects.slice( sortedObjects.length % 2 !== 0 ? splitIndex + 1 : splitIndex );

        const q1Objects: SoccerBall[] = CAVSceneModel.getMedianObjectsFromSortedArray( lowerHalf );
        const q3Objects: SoccerBall[] = CAVSceneModel.getMedianObjectsFromSortedArray( upperHalf );

        // take the average to account for cases where there is more than one object contributing to the median
        this.q1ValueProperty.value = _.mean( q1Objects.map( obj => obj.valueProperty.value! ) );
        this.q3ValueProperty.value = _.mean( q3Objects.map( obj => obj.valueProperty.value! ) );

        this.soccerBalls.forEach( object => {
          object.isQ1ObjectProperty.value = q1Objects.includes( object );
          object.isQ3ObjectProperty.value = q3Objects.includes( object );
        } );

        assert && assert( !isNaN( this.q1ValueProperty.value ) );
        assert && assert( !isNaN( this.q3ValueProperty.value ) );
      }
      else {
        this.q1ValueProperty.value = null;
        this.q3ValueProperty.value = null;
      }

      // Support call from superclass constructor
      if ( this.madValueProperty ) {
        this.madValueProperty.value = sortedObjects.length === 0 ? null :
                                      VariabilityModel.meanAbsoluteDeviation( sortedObjects.map( object => object.valueProperty.value! ) );
      }
    }
  }

}

centerAndVariability.register( 'VariabilitySceneModel', VariabilitySceneModel );