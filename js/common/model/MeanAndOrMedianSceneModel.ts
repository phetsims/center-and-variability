// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CAVSceneModel from './CAVSceneModel.js';

export default class MeanAndOrMedianSceneModel extends CAVSceneModel {

  public resetScene(): void {
    this.distributionProperty.value = CAVSceneModel.chooseDistribution();
  }
}

centerAndVariability.register( 'MeanAndOrMedianSceneModel', MeanAndOrMedianSceneModel );