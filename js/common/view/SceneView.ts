// Copyright 2023, University of Colorado Boulder

import { Node } from '../../../../scenery/js/imports.js';
import SoccerBallNode from './SoccerBallNode.js';
import { AnimationMode } from '../model/AnimationMode.js';
import CAVObjectType from '../model/CAVObjectType.js';
import CAVSceneModel from '../model/CAVSceneModel.js';
import SoccerPlayerNode from './SoccerPlayerNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVModel from '../model/CAVModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import DragIndicatorArrowNode from './DragIndicatorArrowNode.js';
import PlayAreaMedianIndicatorNode from './PlayAreaMedianIndicatorNode.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import InfoDialog from '../../variability/view/InfoDialog.js';
import VariabilitySceneModel from '../../variability/model/VariabilitySceneModel.js';
import VariabilityModel from '../../variability/model/VariabilityModel.js';
import Multilink from '../../../../axon/js/Multilink.js';
import SoccerBall from '../model/SoccerBall.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CAVConstants from '../CAVConstants.js';

export default class SceneView {

  private readonly updateMedianNode: () => void;

  public constructor(
    model: CAVModel,
    sceneModel: CAVSceneModel,
    backObjectLayer: Node,
    frontObjectLayer: Node,
    modelViewTransform: ModelViewTransform2,
    getAccordionBox: () => AccordionBox | null,
    options: { tandem: Tandem } ) {

    const objectNodeGroupTandem = options.tandem.createTandem( 'soccerBallNodeGroup' );

    const objectNodesInputEnabledProperty = new BooleanProperty( true, {
      tandem: objectNodeGroupTandem.createTandem( 'inputEnabledProperty' )
    } );

    const dragIndicatorArrowNode = new DragIndicatorArrowNode( {
      tandem: options.tandem.createTandem( 'dragIndicatorArrowNode' ),
      visible: false
    } );

    backObjectLayer.addChild( dragIndicatorArrowNode );

    const updateDragIndictatorVisible = () => {

      // add the dragIndicatorArrowNode above the last object when it is added to the play area. if an object was
      // moved before this happens, don't show the dragIndicatorArrowNode
      if ( sceneModel.soccerBallCountProperty.value === sceneModel.maxKicksProperty.value &&
           objectNodesInputEnabledProperty.value &&
           _.every( sceneModel.soccerBalls, soccerBall => soccerBall.valueProperty.value !== null ) &&
           !model.soccerBallHasBeenDraggedProperty.value ) {

        const lastBall = sceneModel.soccerBalls[ sceneModel.soccerBalls.length - 1 ];
        const value = lastBall.valueProperty.value!;

        dragIndicatorArrowNode.centerX = modelViewTransform.modelToViewX( value );

        const dragIndicatorArrowNodeMargin = 6;

        // calculate where the top object is
        const topObjectPositionY = modelViewTransform.modelToViewY( 0 ) -
                                   ( sceneModel.getStackAtLocation( value ).length ) *
                                   Math.abs( modelViewTransform.modelToViewDeltaY( CAVObjectType.SOCCER_BALL.radius ) ) * 2 -
                                   dragIndicatorArrowNodeMargin;

        dragIndicatorArrowNode.bottom = topObjectPositionY;
        dragIndicatorArrowNode.visible = true;
      }
      else {
        dragIndicatorArrowNode.visible = false;
      }
    };

    model.soccerBallHasBeenDraggedProperty.link( updateDragIndictatorVisible );
    model.maxKicksProperty.link( updateDragIndictatorVisible );

    const soccerBallMap = new Map<SoccerBall, SoccerBallNode>();

    sceneModel.soccerBalls.map( ( soccerBall, index ) => {
      const soccerBallNode = new SoccerBallNode(
        soccerBall,
        sceneModel.isVisibleProperty,
        model.isShowingPlayAreaMedianProperty,
        modelViewTransform,
        objectNodesInputEnabledProperty, {
          tandem: options.tandem.createTandem( 'soccerBallNodes' ).createTandem( 'soccerBallNode' + index )
        } );

      backObjectLayer.addChild( soccerBallNode );

      // While flying, it should be in front in z-order, to be in front of the accordion box
      soccerBall.animationModeProperty.lazyLink( ( animationMode, oldAnimationModel ) => {
        if ( animationMode === AnimationMode.FLYING ) {
          backObjectLayer.removeChild( soccerBallNode );
          frontObjectLayer.addChild( soccerBallNode );
        }
        else if ( oldAnimationModel ) {
          frontObjectLayer.removeChild( soccerBallNode );
          backObjectLayer.addChild( soccerBallNode );
        }
      } );

      soccerBall.valueProperty.link( ( value, oldValue ) => {

        updateDragIndictatorVisible();

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

    const updateStackPointerAreas = () => {
      for ( let i = CAVConstants.PHYSICAL_RANGE.min; i <= CAVConstants.PHYSICAL_RANGE.max; i++ ) {
        const stack = sceneModel.getStackAtLocation( i );

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
      }
    };

    // Update pointer areas when topmost ball changes
    sceneModel.stackChangedEmitter.addListener( updateStackPointerAreas );

    const playAreaMedianIndicatorNode = new PlayAreaMedianIndicatorNode();
    frontObjectLayer.addChild( playAreaMedianIndicatorNode );

    this.updateMedianNode = () => {
      const medianValue = sceneModel.medianValueProperty.value;
      const visible = medianValue !== null && model.isShowingPlayAreaMedianProperty.value && sceneModel.isVisibleProperty.value;

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
    sceneModel.isVisibleProperty.link( this.updateMedianNode );

    // TODO: See https://github.com/phetsims/center-and-variability/issues/153
    const varModel = model as VariabilityModel;
    const varSceneModel = sceneModel as VariabilitySceneModel;

    // TODO: Do we want this information in the model? Do we want one player that re-kicks, or a list of clones? https://github.com/phetsims/center-and-variability/issues/154
    const isVariabilityModel = !!varModel.isInfoShowingProperty;
    let sceneIndex = 0;
    if ( isVariabilityModel ) {
      sceneIndex = varModel.variabilitySceneModels.indexOf( varSceneModel );
    }

    const soccerPlayerNodes = sceneModel.soccerPlayers.map( soccerPlayer => {
      return new SoccerPlayerNode(
        soccerPlayer,
        isVariabilityModel ? sceneIndex : null,
        modelViewTransform,
        sceneModel.isVisibleProperty
      );
    } );

    soccerPlayerNodes.forEach( soccerPlayerNode => frontObjectLayer.addChild( soccerPlayerNode ) );

    if ( varModel && varModel.isInfoShowingProperty && varModel.selectedSceneModelProperty && varSceneModel ) {
      const infoDialog = new InfoDialog( varModel, varSceneModel, {
        tandem: options.tandem.createTandem( 'infoDialog' )
      } );

      Multilink.multilink( [ varModel.isInfoShowingProperty, varSceneModel.isVisibleProperty ],
        ( isInfoShowing, isVisible ) => {
          if ( isInfoShowing && isVisible ) {
            infoDialog.show();
          }
          else {
            infoDialog.hide();
          }
        } );
    }

    model.isShowingPlayAreaMedianProperty.link( this.updateMedianNode );
  }
}

centerAndVariability.register( 'SceneView', SceneView );