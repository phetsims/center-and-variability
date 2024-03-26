// Copyright 2023-2024, University of Colorado Boulder


/**
 * CAVSceneView is a specialized rendition of the SoccerSceneView tailored for the Center and Variability simulation.
 * Its primary augmentation to the parent view is the integration of the MedianHighlightLayer, which offers a visual
 * emphasis on the median value among the soccer balls present in the scene.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import SoccerSceneView from '../../../../soccer-common/js/view/SoccerSceneView.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianHighlightLayer from './MedianHighlightLayer.js';
import CAVModel from '../model/CAVModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';

export default class CAVSceneView extends SoccerSceneView<CAVSoccerSceneModel> {

  public constructor( model: CAVModel,
                      sceneModel: CAVSoccerSceneModel,
                      keyboardSortCueNode: Node,
                      modelViewTransform: ModelViewTransform2,
                      physicalRange: Range,
                      tandem: Tandem ) {

    super( model, sceneModel, keyboardSortCueNode, modelViewTransform,
      physicalRange, { tandem: tandem } );

    const medianHighlightLayer = new MedianHighlightLayer( sceneModel.soccerBalls, modelViewTransform, model.isPlayAreaMedianVisibleProperty, {
      visibleProperty: model.isPlayAreaMedianVisibleProperty
    } );

    this.backSceneViewLayer.addChild( medianHighlightLayer );
  }
}

centerAndVariability.register( 'CAVSceneView', CAVSceneView );