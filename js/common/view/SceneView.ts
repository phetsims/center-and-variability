// Copyright 2023, University of Colorado Boulder

/**
 * Depicts a single scene in the CAV screen.  This includes the soccer balls, soccer players, and drag indicator arrow.
 * The scene is rendered in two layers to ensure the correct z-ordering.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node } from '../../../../scenery/js/imports.js';
import SoccerBallNode from './SoccerBallNode.js';
import { AnimationMode } from '../model/AnimationMode.js';
import CAVObjectType from '../model/CAVObjectType.js';
import CAVSceneModel from '../model/CAVSceneModel.js';
import SoccerPlayerNode, { SoccerPlayerImageSet } from './SoccerPlayerNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVModel from '../model/CAVModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlayAreaMedianIndicatorNode from './PlayAreaMedianIndicatorNode.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import SoccerBall from '../model/SoccerBall.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SoccerPlayer from '../model/SoccerPlayer.js';

/**
 * Renders view elements for a CAVSceneModel. Note that to satisfy the correct z-ordering, elements
 * populate the backObjectLayer and frontObjectLayer in the parent.
 */
export default class SceneView {

  private readonly updateMedianNode: () => void;
  public readonly backLayer: Node;
  public readonly frontLayer: Node;

  public constructor(
    model: CAVModel,
    public readonly sceneModel: CAVSceneModel,
    getSoccerPlayerImageSet: ( soccerPlayer: SoccerPlayer, sceneModel: CAVSceneModel ) => SoccerPlayerImageSet,
    modelViewTransform: ModelViewTransform2,
    getAccordionBox: () => AccordionBox | null,
    options: { tandem: Tandem } ) {

    const soccerBallMap = new Map<SoccerBall, SoccerBallNode>();

    const backLayer = new Node();
    const frontLayer = new Node();

    sceneModel.soccerBalls.map( ( soccerBall, index ) => {
      const soccerBallNode = new SoccerBallNode(
        soccerBall,
        sceneModel.isVisibleProperty,
        model.isPlayAreaMedianVisibleProperty,
        modelViewTransform,
        model.objectNodesInputEnabledProperty, {
          tandem: options.tandem.createTandem( 'soccerBallNodes' ).createTandem( 'soccerBallNode' + index )
        } );

      backLayer.addChild( soccerBallNode );

      // While flying, it should be in front in z-order, to be in front of the accordion box
      soccerBall.animationModeProperty.lazyLink( ( animationMode, oldAnimationModel ) => {
        if ( animationMode === AnimationMode.FLYING ) {
          backLayer.removeChild( soccerBallNode );
          frontLayer.addChild( soccerBallNode );
        }
        else {
          frontLayer.removeChild( soccerBallNode );
          backLayer.addChild( soccerBallNode );
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
        const selfZIndex = soccerBallNode.parent!.indexOfChild( soccerBallNode );

        let isMisordered = false;

        const lowerNeighborIndex = i - 1;
        if ( lowerNeighborIndex >= 0 ) {
          const lowerSoccerBall = soccerBallMap.get( stack[ lowerNeighborIndex ] )!;
          const otherZIndex = lowerSoccerBall.parent!.indexOfChild( lowerSoccerBall );

          if ( selfZIndex < otherZIndex ) {
            isMisordered = true;
          }
        }

        if ( isMisordered ) {
          soccerBallNode.moveToFront();
        }
      }
    } );

    const playAreaMedianIndicatorNode = new PlayAreaMedianIndicatorNode();
    frontLayer.addChild( playAreaMedianIndicatorNode );

    this.updateMedianNode = () => {
      const medianValue = sceneModel.medianValueProperty.value;
      const visible = medianValue !== null && model.isPlayAreaMedianVisibleProperty.value;

      if ( visible ) {

        // if there is a ball at that location, go above the ball
        const ballsAtLocation = sceneModel.soccerBalls.filter( soccerBall => soccerBall.valueProperty.value === medianValue );
        const modelHeight = ballsAtLocation.length * CAVObjectType.SOCCER_BALL.radius * 2; // assumes no spacing

        const viewHeight = modelViewTransform.modelToViewDeltaY( modelHeight );

        playAreaMedianIndicatorNode.centerX = modelViewTransform.modelToViewX( medianValue );
        playAreaMedianIndicatorNode.bottom = modelViewTransform.modelToViewY( 0 ) + viewHeight;

        const accordionBox = getAccordionBox();

        // The arrow shouldn't overlap the accordion box
        if ( accordionBox ) {
          const accordionBoxHeight = accordionBox.expandedProperty.value ? accordionBox.getExpandedBoxHeight() : accordionBox.getCollapsedBoxHeight();
          if ( playAreaMedianIndicatorNode.top < accordionBox.top + accordionBoxHeight ) {
            playAreaMedianIndicatorNode.top = accordionBox.top + accordionBoxHeight + 4;
          }
        }
      }
      playAreaMedianIndicatorNode.visible = visible;
    };
    sceneModel.medianValueProperty.link( this.updateMedianNode );
    sceneModel.objectChangedEmitter.addListener( this.updateMedianNode );

    const soccerPlayerNodes = sceneModel.soccerPlayers.map( soccerPlayer =>
      new SoccerPlayerNode(
        soccerPlayer,
        getSoccerPlayerImageSet( soccerPlayer, sceneModel ),
        modelViewTransform ) );

    soccerPlayerNodes.forEach( soccerPlayerNode => frontLayer.addChild( soccerPlayerNode ) );
    model.isPlayAreaMedianVisibleProperty.link( this.updateMedianNode );

    this.backLayer = backLayer;
    this.frontLayer = frontLayer;
  }
}

centerAndVariability.register( 'SceneView', SceneView );