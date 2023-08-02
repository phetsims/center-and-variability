// Copyright 2023, University of Colorado Boulder

/**
 * Depicts a single scene in the CAV screen.  This includes the soccer balls, soccer players, and drag indicator arrow.
 * The scene is rendered in two layers to ensure the correct z-ordering.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */


import { FocusHighlightFromNode, FocusHighlightPath, KeyboardListener, Node } from '../../../../scenery/js/imports.js';
import SoccerBallNode from './SoccerBallNode.js';
import { SoccerBallPhase } from '../model/SoccerBallPhase.js';
import SoccerSceneModel from '../model/SoccerSceneModel.js';
import KickerNode from './KickerNode.js';
import { KickerImageSet } from './KickerCharacterSet.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import soccerCommon from '../soccerCommon.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SoccerBall from '../model/SoccerBall.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Kicker from '../model/Kicker.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import DragIndicatorModel from '../model/DragIndicatorModel.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

/**
 * Renders view elements for a CAVSceneModel. Note that to satisfy the correct z-ordering, elements
 * populate the middleScreenViewLayer and frontScreenViewLayer in the parent.
 */
export default class SoccerSceneView {

  public readonly backSceneViewLayer: Node;
  public readonly frontSceneViewLayer: Node;

  public constructor(
    dragIndicatorModel: DragIndicatorModel,
    soccerBallsInputEnabledProperty: Property<boolean>,
    public readonly sceneModel: SoccerSceneModel,
    getKickerImageSet: ( kicker: Kicker, sceneModel: SoccerSceneModel ) => KickerImageSet,
    modelViewTransform: ModelViewTransform2,
    physicalRange: Range,
    options: { tandem: Tandem } ) {

    const soccerBallMap = new Map<SoccerBall, SoccerBallNode>();

    // Keep soccer balls in one layer so we can control the focus order
    const backLayerSoccerBallLayer = new Node( {
      // groupFocusHighlight: true,
      focusable: true,
      tagName: 'div'
    } );
    const backLayer = new Node( {
      children: [ backLayerSoccerBallLayer ]
    } );

    // A front layer for balls in the air so that they are in front of other UI components
    const frontLayer = new Node();

    sceneModel.soccerBalls.map( ( soccerBall, index ) => {
      const soccerBallNode = new SoccerBallNode(
        soccerBall,
        modelViewTransform,
        soccerBallsInputEnabledProperty, {
          tandem: options.tandem.createTandem( 'soccerBallNodes' ).createTandem1Indexed( 'soccerBallNode', index ),
          pickable: false
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
          dragIndicatorModel.soccerBallHasBeenDraggedProperty.value = true;
        }
      } );

      soccerBallMap.set( soccerBall, soccerBallNode );

      return soccerBallNode;
    } );

    // The soccerBall that is receiving highlight focus in the backLayerSoccerBallLayer group highlight.
    const focusedSoccerBallProperty = new Property<SoccerBall | null>( null );
    const isSoccerBallGrabbedProperty = new Property( false );

    sceneModel.clearDataEmitter.addListener( () => {
      focusedSoccerBallProperty.reset();
      isSoccerBallGrabbedProperty.reset();
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

      // When a user is focused on the backLayerSoccerBallLayer, but no balls have landed yet, we want to ensure that
      // a focusedSoccerBall gets assigned once the ball lands.
      const topSoccerBalls = sceneModel.getTopSoccerBalls();
      if ( focusedSoccerBallProperty.value === null && topSoccerBalls.length > 0 && backLayerSoccerBallLayer.focused ) {
        focusedSoccerBallProperty.value = topSoccerBalls[ 0 ];
      }

      // Anytime a stack changes and the focusedSoccerBall is assigned, we want to make sure the focusedSoccerBall
      // stays on top.
      if ( focusedSoccerBallProperty.value !== null ) {
        assert && assert( focusedSoccerBallProperty.value.valueProperty.value !== null, 'The valueProperty of the focusedSoccerBall should not be null.' );
        const focusedStack = sceneModel.getStackAtLocation( focusedSoccerBallProperty.value.valueProperty.value! );
        focusedSoccerBallProperty.value = focusedStack[ focusedStack.length - 1 ];
      }
    } );

    backLayerSoccerBallLayer.addInputListener( {
      focus: () => {
        const topSoccerBalls = sceneModel.getTopSoccerBalls();
        if ( focusedSoccerBallProperty.value === null && topSoccerBalls.length > 0 ) {
          focusedSoccerBallProperty.value = topSoccerBalls[ 0 ];
        }
      },
      blur: () => {
        isSoccerBallGrabbedProperty.value = false;
      }
    } );

    const kickerNodes = sceneModel.kickers.map( kicker =>
      new KickerNode(
        kicker,
        getKickerImageSet( kicker, sceneModel ),
        modelViewTransform ) );

    kickerNodes.forEach( kickerNode => frontLayer.addChild( kickerNode ) );

    Multilink.multilink( [ focusedSoccerBallProperty, isSoccerBallGrabbedProperty ], ( focusedSoccerBall, isSoccerBallGrabbed ) => {
        if ( focusedSoccerBall ) {

          const focusForSelectedBall = new FocusHighlightFromNode( soccerBallMap.get( focusedSoccerBall )!, { dashed: isSoccerBallGrabbed } );
          backLayerSoccerBallLayer.setFocusHighlight( focusForSelectedBall );
        }
        else {
          backLayerSoccerBallLayer.setFocusHighlight( 'invisible' );
        }
      }
    );

    const keyboardListener = new KeyboardListener( {
      keys: [ 'arrowRight', 'arrowLeft', 'enter', 'space', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'home', 'end', 'escape' ],
      callback: ( event, listener ) => {

        const keysPressed = listener.keysPressed;
        const topBallNodes = sceneModel.getTopSoccerBalls().map( soccerBall => soccerBallMap.get( soccerBall )! );

        // Select a soccer ball
        if ( focusedSoccerBallProperty.value !== null ) {
          if ( ( keysPressed === 'arrowRight' || keysPressed === 'arrowLeft' ) ) {

            if ( !isSoccerBallGrabbedProperty.value ) {
              const delta = listener.keysPressed === 'arrowRight' ? 1 : -1;
              const numberOfTopSoccerBalls = sceneModel.getTopSoccerBalls().length;

              // We are deciding not to wrap the value around the ends of the range because the grabbed soccer ball
              // also does not wrap.
              const currentIndex = topBallNodes.indexOf( soccerBallMap.get( focusedSoccerBallProperty.value )! );
              const nextIndex = Utils.clamp( currentIndex + delta, 0, numberOfTopSoccerBalls - 1 );
              focusedSoccerBallProperty.value = topBallNodes[ nextIndex ].soccerBall;
            }
            else {
              const delta = listener.keysPressed === 'arrowLeft' ? -1 : 1;
              const soccerBall = focusedSoccerBallProperty.value;
              soccerBall.valueProperty.value = physicalRange.constrainValue( soccerBall.valueProperty.value! + delta );
              soccerBall.toneEmitter.emit( soccerBall.valueProperty.value );
            }
          }
          else if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            isSoccerBallGrabbedProperty.value = !isSoccerBallGrabbedProperty.value;
          }
          else if ( isSoccerBallGrabbedProperty.value ) {

            if ( keysPressed === 'escape' ) {
              isSoccerBallGrabbedProperty.value = false;
            }
            else {
              focusedSoccerBallProperty.value.valueProperty.value = keysPressed === 'home' ? physicalRange.min :
                                                                    keysPressed === 'end' ? physicalRange.max :
                                                                    keysPressed === '1' ? 1 :
                                                                    keysPressed === '2' ? 2 :
                                                                    keysPressed === '3' ? 3 :
                                                                    keysPressed === '4' ? 4 :
                                                                    keysPressed === '5' ? 5 :
                                                                    keysPressed === '6' ? 6 :
                                                                    keysPressed === '7' ? 7 :
                                                                    keysPressed === '8' ? 8 :
                                                                    keysPressed === '9' ? 9 :
                                                                    keysPressed === '0' ? 10 :
                                                                    focusedSoccerBallProperty.value.valueProperty.value;
            }
          }
        }
      }
    } );

    // Set the outer group focus region to cover the entire area where soccer balls may land, translate lower so it also includes the number line and labels
    const focusHighlightFromNode = new FocusHighlightPath( modelViewTransform.modelToViewShape( Shape.rect( 0.5, 0, 15, 6 ) ).transformed( Matrix3.translation( 0, 37 ) ), {
      outerStroke: FocusHighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: FocusHighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: FocusHighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: FocusHighlightPath.GROUP_INNER_LINE_WIDTH
    } );
    backLayerSoccerBallLayer.setGroupFocusHighlight( focusHighlightFromNode );
    backLayerSoccerBallLayer.addInputListener( keyboardListener );

    this.backSceneViewLayer = backLayer;
    this.frontSceneViewLayer = frontLayer;
  }
}

soccerCommon.register( 'SoccerSceneView', SoccerSceneView );