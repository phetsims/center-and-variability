// Copyright 2022-2023, University of Colorado Boulder

import { Circle, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CAVModel from '../model/CAVModel.js';
import CAVSceneModel from '../model/CAVSceneModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVObjectType from '../model/CAVObjectType.js';
import CAVConstants from '../CAVConstants.js';
import CAVColors from '../CAVColors.js';

type SelfOptions = EmptySelfOptions;
type MedianHighlightLayerOptions = SelfOptions & NodeOptions;

/**
 * Show all the highlights for the median soccer balls in the front layer.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 */
export default class MedianHighlightLayer extends Node {
  public constructor( model: CAVModel, sceneModel: CAVSceneModel, modelViewTransform: ModelViewTransform2, options: MedianHighlightLayerOptions ) {
    super( options );

    sceneModel.stackChangedEmitter.addListener( () => {
      const medianObjects = sceneModel.soccerBalls.filter( soccerBall => soccerBall.isMedianObjectProperty.value );

      const highlights = medianObjects.map( soccerBall => {
        const viewRadius = modelViewTransform.modelToViewDeltaX( CAVObjectType.SOCCER_BALL.radius * ( 1 - CAVConstants.SOCCER_BALL_OVERLAP ) );
        const LINE_WIDTH = 1.5;
        return new Circle( viewRadius - LINE_WIDTH / 2, {
          center: modelViewTransform.modelToViewPosition( soccerBall.positionProperty.value ),
          stroke: CAVColors.medianColorProperty,
          lineWidth: LINE_WIDTH
        } );
      } );

      this.children = highlights;
    } );
  }
}

centerAndVariability.register( 'MedianHighlightLayer', MedianHighlightLayer );