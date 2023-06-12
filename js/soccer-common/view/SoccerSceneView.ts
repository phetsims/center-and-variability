// Copyright 2023, University of Colorado Boulder

/**
 * Depicts a single scene in the CAV screen.  This includes the soccer balls, soccer players, and drag indicator arrow.
 * The scene is rendered in two layers to ensure the correct z-ordering.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */


import { Node } from '../../../../scenery/js/imports.js';
import SoccerBallNode from './SoccerBallNode.js';
import { SoccerBallPhase } from '../model/SoccerBallPhase.js';
import CAVSceneModel from '../model/CAVSceneModel.js';
import SoccerPlayerNode, { SoccerPlayerImageSet } from './SoccerPlayerNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import soccerCommon from '../soccerCommon.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SoccerBall from '../model/SoccerBall.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SoccerPlayer from '../model/SoccerPlayer.js';

// TODO: SceneView needs to be abstracted out, see: https://github.com/phetsims/center-and-variability/issues/222
// Common does not need medianHighlightLayer, and I think by factoring out the DragIndicatorModel in CAVModel,
// we will no longer need to bring in CAVModel either
import CAVModel from '../../common/model/CAVModel.js';

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';

/**
 * Renders view elements for a CAVSceneModel. Note that to satisfy the correct z-ordering, elements
 * populate the accordionBoxLayer and frontScreenViewLayer in the parent.
 */
export default class SoccerSceneView {

  public readonly backSceneViewLayer: Node;
  public readonly frontSceneViewLayer: Node;

  public constructor(
    model: CAVModel,
    public readonly sceneModel: CAVSceneModel,
    getSoccerPlayerImageSet: ( soccerPlayer: SoccerPlayer, sceneModel: CAVSceneModel ) => SoccerPlayerImageSet,
    modelViewTransform: ModelViewTransform2,
    physicalRange: Range,
    options: { tandem: Tandem } ) {

    const soccerBallMap = new Map<SoccerBall, SoccerBallNode>();

    // Keep soccer balls in one layer so we can control the focus order
    const backLayerSoccerBallLayer = new Node();
    const backLayer = new Node( {
      children: [ backLayerSoccerBallLayer ]
    } );

    // A front layer for balls in the air so that they are in front of other UI components
    const frontLayer = new Node();

    sceneModel.soccerBalls.map( ( soccerBall, index ) => {
      const soccerBallNode = new SoccerBallNode(
        soccerBall,
        modelViewTransform,
        model.objectNodesInputEnabledProperty, {
          tandem: options.tandem.createTandem( 'soccerBallNodes' ).createTandem( `soccerBallNode${index + 1}` ),
          pickable: false,
          enabledRangeProperty: new Property( physicalRange )
        } );

      backLayerSoccerBallLayer.addChild( soccerBallNode );

      // While flying, it should be in front in z-order, to be in front of the accordion box
      soccerBall.soccerBallPhaseProperty.lazyLink( ( soccerBallPhase, oldSoccerBallPhase ) => {

        //when the ball is kicked
        if ( soccerBallPhase === SoccerBallPhase.FLYING ) {
          backLayerSoccerBallLayer.removeChild( soccerBallNode );
          frontLayer.addChild( soccerBallNode );
        }
        else if ( oldSoccerBallPhase === SoccerBallPhase.FLYING ) {
          frontLayer.removeChild( soccerBallNode );
          backLayerSoccerBallLayer.addChild( soccerBallNode );
        }
      } );

      soccerBall.valueProperty.link( ( value, oldValue ) => {

        // If the value changed from numeric to numeric, it must have been by user dragging it.
        // It's simpler to have the listener here because in the model or drag listener, there is rounding/snapping
        // And we only want to hide the indicator of the user dragged the ball a full tick mark
        if ( value !== null && oldValue !== null ) {
          model.soccerBallHasBeenDraggedProperty.value = true;
        }
      } );

      soccerBallMap.set( soccerBall, soccerBallNode );

      return soccerBallNode;
    } );

    // Update pointer areas when topmost ball changes
    sceneModel.stackChangedEmitter.addListener( stack => {

      let bounds: Bounds2 | null = null;

      for ( let i = 0; i < stack.length; i++ ) {
        const soccerBallNode = soccerBallMap.get( stack[ i ] )!;

        if ( i === 0 ) {
          bounds = soccerBallNode.globalBounds;
        }
        else {
          bounds!.includeBounds( soccerBallNode.globalBounds );
        }

        if ( i === stack.length - 1 ) {
          const pointerArea = Shape.bounds( soccerBallNode.globalToLocalBounds( bounds!.dilated( 5 ) ) );
          soccerBallNode.mouseArea = pointerArea;
          soccerBallNode.touchArea = pointerArea;
          soccerBallNode.pickable = true;
        }
        else {
          soccerBallNode.pickable = false;

          // To make it easier to see when using ?showPointerAreas
          soccerBallNode.mouseArea = Shape.rectangle( 0, 0, 0, 0 );
          soccerBallNode.touchArea = Shape.rectangle( 0, 0, 0, 0 );
        }
      }

      // Also do the z-ordering
      for ( let i = 0; i < stack.length; i++ ) {

        const soccerBallNode = soccerBallMap.get( stack[ i ] )!;

        // Only the top ball in each stack is focusable for keyboard navigation
        soccerBallNode.focusable = i === stack.length - 1;

        // Focus order goes left to right
        backLayerSoccerBallLayer.setPDOMOrder( sceneModel.getTopSoccerBalls().map( soccerBall => soccerBallMap.get( soccerBall )! ) );
      }
    } );

    const soccerPlayerNodes = sceneModel.soccerPlayers.map( soccerPlayer =>
      new SoccerPlayerNode(
        soccerPlayer,
        getSoccerPlayerImageSet( soccerPlayer, sceneModel ),
        modelViewTransform ) );

    soccerPlayerNodes.forEach( soccerPlayerNode => frontLayer.addChild( soccerPlayerNode ) );

    this.backSceneViewLayer = backLayer;
    this.frontSceneViewLayer = frontLayer;
  }
}

soccerCommon.register( 'SoccerSceneView', SoccerSceneView ); '';