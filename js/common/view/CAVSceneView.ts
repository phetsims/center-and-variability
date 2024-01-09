// Copyright 2023, University of Colorado Boulder


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
import SoccerSceneModel from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Kicker from '../../../../soccer-common/js/model/Kicker.js';
import { KickerImageSet } from '../../../../soccer-common/js/view/KickerPortrayal.js';
import Range from '../../../../dot/js/Range.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';

export default class CAVSceneView extends SoccerSceneView {

  public constructor( model: CAVModel,
                      sceneModel: CAVSoccerSceneModel,
                      keyboardDragArrowNode: Node,
                      getKickerImageSet: ( kicker: Kicker, sceneModel: SoccerSceneModel ) => KickerImageSet[],
                      modelViewTransform: ModelViewTransform2,
                      physicalRange: Range,
                      tandem: Tandem ) {

    super( model, sceneModel, keyboardDragArrowNode,
      model.groupSortInteractionModel.groupItemHasBeenDraggedProperty,
      model.groupSortInteractionModel.dragIndicatorValueProperty, getKickerImageSet, modelViewTransform,
      physicalRange, tandem );

    const medianHighlightLayer = new MedianHighlightLayer( sceneModel.soccerBalls, modelViewTransform, model.isPlayAreaMedianVisibleProperty, {
      visibleProperty: model.isPlayAreaMedianVisibleProperty
    } );

    this.backSceneViewLayer.addChild( medianHighlightLayer );
  }
}

centerAndVariability.register( 'CAVSceneView', CAVSceneView );