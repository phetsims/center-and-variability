// Copyright 2023, University of Colorado Boulder

/**
 * MedianHighlightLayer displays visual highlights for soccer balls that represent the median.
 * Two circular highlights are shown on the front layer. The class updates the visibility and
 * position of these highlights based on the status and position of median soccer balls.
 * Performance optimizations are included to ensure that unnecessary calculations are avoided.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 */

import { Circle, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVObjectType from '../model/CAVObjectType.js';
import CAVColors from '../CAVColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import SoccerCommonConstants from '../../../../soccer-common/js/SoccerCommonConstants.js';
import CAVSoccerBall from '../model/CAVSoccerBall.js';

type SelfOptions = EmptySelfOptions;
type MedianHighlightLayerOptions = SelfOptions & NodeOptions;

export default class MedianHighlightLayer extends Node {
  public constructor( soccerBalls: CAVSoccerBall[], modelViewTransform: ModelViewTransform2, isPlayAreaMedianVisibleProperty: TReadOnlyProperty<boolean>, providedOptions: MedianHighlightLayerOptions ) {

    const LINE_WIDTH = 2;
    const viewRadius = modelViewTransform.modelToViewDeltaX( CAVObjectType.SOCCER_BALL.radius * ( 1 - SoccerCommonConstants.SOCCER_BALL_OVERLAP ) );
    const createCircle = () => {
      return new Circle( viewRadius - LINE_WIDTH / 2, {
        stroke: CAVColors.medianColorProperty,
        lineWidth: LINE_WIDTH
      } );
    };

    const circle1 = createCircle();
    const circle2 = createCircle();

    const options = optionize<MedianHighlightLayerOptions, SelfOptions, NodeOptions>()( {
      children: [ circle1, circle2 ],
      isDisposable: false
    }, providedOptions );
    super( options );

    const update = () => {

      // Lots of guards to make sure we don't waste performance
      if ( isPlayAreaMedianVisibleProperty.value ) {
        const medianObjects = soccerBalls.filter( soccerBall => soccerBall.isMedianObjectProperty.value );

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

    soccerBalls.forEach( soccerBall => {
      soccerBall.isMedianObjectProperty.link( update );
      soccerBall.valueProperty.link( update );
    } );

    isPlayAreaMedianVisibleProperty.link( update );
  }
}

centerAndVariability.register( 'MedianHighlightLayer', MedianHighlightLayer );