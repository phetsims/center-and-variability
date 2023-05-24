// Copyright 2022-2023, University of Colorado Boulder

import { Circle, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CAVModel from '../model/CAVModel.js';
import CAVSceneModel from '../model/CAVSceneModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVObjectType from '../model/CAVObjectType.js';
import CAVConstants from '../CAVConstants.js';
import CAVColors from '../CAVColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;
type MedianHighlightLayerOptions = SelfOptions & NodeOptions;

/**
 * Show all the highlights for the median soccer balls in the front layer.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 */
export default class MedianHighlightLayer extends Node {
  public constructor( model: CAVModel, sceneModel: CAVSceneModel, modelViewTransform: ModelViewTransform2, isPlayAreaMedianVisibleProperty: TReadOnlyProperty<boolean>, providedOptions: MedianHighlightLayerOptions ) {

    const LINE_WIDTH = 1.5;
    const viewRadius = modelViewTransform.modelToViewDeltaX( CAVObjectType.SOCCER_BALL.radius * ( 1 - CAVConstants.SOCCER_BALL_OVERLAP ) );
    const createCircle = () => {
      return new Circle( viewRadius - LINE_WIDTH / 2, {
        stroke: CAVColors.medianColorProperty,
        lineWidth: LINE_WIDTH
      } );
    };

    const circle1 = createCircle();
    const circle2 = createCircle();

    const options = optionize<MedianHighlightLayerOptions, SelfOptions, NodeOptions>()( {
      children: [ circle1, circle2 ]
    }, providedOptions );
    super( options );

    const update = () => {

      // Lots of guards to make sure we don't waste performance
      if ( isPlayAreaMedianVisibleProperty.value ) {
        const medianObjects = sceneModel.soccerBalls.filter( soccerBall => soccerBall.isMedianObjectProperty.value );

        circle1.visible = medianObjects.length > 0;
        circle2.visible = medianObjects.length > 1;

        if ( medianObjects[ 0 ] ) {
          circle1.center = modelViewTransform.modelToViewPosition( medianObjects[ 0 ].positionProperty.value );
        }
        if ( medianObjects[ 1 ] ) {
          circle2.center = modelViewTransform.modelToViewPosition( medianObjects[ 1 ].positionProperty.value );
        }
      }
    };

    // TODO: Only listen to the position once the ball lands in the play area, see https://github.com/phetsims/center-and-variability/issues/188
    sceneModel.soccerBalls.forEach( soccerBall => {
      soccerBall.isMedianObjectProperty.link( update );
      soccerBall.positionProperty.link( update );
    } );

    isPlayAreaMedianVisibleProperty.link( update );
  }
}

centerAndVariability.register( 'MedianHighlightLayer', MedianHighlightLayer );