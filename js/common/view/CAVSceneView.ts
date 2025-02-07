// Copyright 2023-2024, University of Colorado Boulder


/**
 * CAVSceneView is a specialized rendition of the SoccerSceneView tailored for the Center and Variability simulation.
 * Its primary augmentation to the parent view is the integration of the MedianHighlightLayer, which offers a visual
 * emphasis on the median value among the soccer balls present in the scene.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { KickerImageSet } from '../../../../soccer-common/js/view/KickerImageSets.js';
import SoccerSceneView from '../../../../soccer-common/js/view/SoccerSceneView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVModel from '../model/CAVModel.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import MedianHighlightLayer from './MedianHighlightLayer.js';

export default class CAVSceneView extends SoccerSceneView<CAVSoccerSceneModel> {

  public constructor( model: CAVModel,
                      sceneModel: CAVSoccerSceneModel,
                      keyboardSortCueNode: Node,
                      modelViewTransform: ModelViewTransform2,
                      physicalRange: Range,
                      kickerImageSets: KickerImageSet[],
                      tandem: Tandem ) {

    super( model, sceneModel, keyboardSortCueNode, modelViewTransform,
      physicalRange, kickerImageSets, { tandem: tandem } );

    const medianHighlightLayer = new MedianHighlightLayer( sceneModel.soccerBalls, modelViewTransform, model.isPlayAreaMedianVisibleProperty, {
      visibleProperty: model.isPlayAreaMedianVisibleProperty
    } );

    this.backSceneViewLayer.addChild( medianHighlightLayer );
  }
}

centerAndVariability.register( 'CAVSceneView', CAVSceneView );