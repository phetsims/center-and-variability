// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of SoccerSceneView that adds the MedianHighlightLayer.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 *
 */

import SoccerSceneView from '../../../../soccer-common/js/view/SoccerSceneView.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianHighlightLayer from './MedianHighlightLayer.js';
import CAVModel from '../model/CAVModel.js';
import SoccerSceneModel from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Kicker from '../../../../soccer-common/js/model/Kicker.js';
import { KickerImageSet } from '../../../../soccer-common/js/view/KickerCharacterSet.js';
import Range from '../../../../dot/js/Range.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

export default class CAVSceneView extends SoccerSceneView {

  public constructor( model: CAVModel,
                      sceneModel: CAVSoccerSceneModel,
                      getKickerImageSet: ( kicker: Kicker, sceneModel: SoccerSceneModel ) => KickerImageSet[],
                      modelViewTransform: ModelViewTransform2,
                      physicalRange: Range,
                      options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    super( model.dragIndicatorModel, model.soccerBallsEnabledProperty, sceneModel, getKickerImageSet, modelViewTransform, physicalRange, options );

    const medianHighlightLayer = new MedianHighlightLayer( sceneModel, modelViewTransform, model.isPlayAreaMedianVisibleProperty, {
      visibleProperty: model.isPlayAreaMedianVisibleProperty
    } );

    this.backSceneViewLayer.addChild( medianHighlightLayer );
  }
}

centerAndVariability.register( 'CAVSceneView', CAVSceneView );