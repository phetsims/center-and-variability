// Copyright 2023, University of Colorado Boulder

/**
 * A subclass of SoccerSceneView that adds the MedianHighlightLayer.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 *
 */

import SoccerSceneView from '../../soccer-common/view/SoccerSceneView.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianHighlightLayer from './MedianHighlightLayer.js';
import CAVModel from '../model/CAVModel.js';
import SoccerSceneModel from '../../soccer-common/model/SoccerSceneModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SoccerPlayer from '../../soccer-common/model/SoccerPlayer.js';
import { SoccerPlayerImageSet } from '../../soccer-common/view/SoccerPlayerNode.js';
import Range from '../../../../dot/js/Range.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';

export default class CAVSceneView extends SoccerSceneView {

  public constructor( model: CAVModel,
                      sceneModel: CAVSoccerSceneModel,
                      getSoccerPlayerImageSet: ( soccerPlayer: SoccerPlayer, sceneModel: SoccerSceneModel ) => SoccerPlayerImageSet,
                      modelViewTransform: ModelViewTransform2,
                      physicalRange: Range,
                      options: PickRequired<PhetioObject, 'tandem'> ) {

    super( model.dragIndicatorModel, model.soccerBallsInputEnabledProperty, sceneModel, getSoccerPlayerImageSet, modelViewTransform, physicalRange, options );

    const medianHighlightLayer = new MedianHighlightLayer( sceneModel, modelViewTransform, model.isPlayAreaMedianVisibleProperty, {
      visibleProperty: model.isPlayAreaMedianVisibleProperty
    } );

    this.backSceneViewLayer.addChild( medianHighlightLayer );
  }
}

centerAndVariability.register( 'CAVSceneView', CAVSceneView );