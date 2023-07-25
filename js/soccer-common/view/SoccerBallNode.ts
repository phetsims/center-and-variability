// Copyright 2023, University of Colorado Boulder

/**
 * Renders a soccer ball that can be dragged horizontally. Uses AccessibleSlider so that the soccer ball functions
 * similarly to a slider in alternativeInput.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import SoccerObjectNode, { CAVObjectNodeOptions } from './SoccerObjectNode.js';
import soccerCommon from '../soccerCommon.js';
import SoccerBall from '../model/SoccerBall.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TProperty from '../../../../axon/js/TProperty.js';
import { DragListener, Image, Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { SoccerBallPhase } from '../model/SoccerBallPhase.js';
import ballDark_png from '../../../images/ballDark_png.js';
import ball_png from '../../../images/ball_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Shape } from '../../../../kite/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SoccerCommonConstants from '../SoccerCommonConstants.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = CAVObjectNodeOptions;

type SoccerBallNodeOptions = SelfOptions & ParentOptions;

export default class SoccerBallNode extends SoccerObjectNode {

  public constructor( soccerBall: SoccerBall,
                      modelViewTransform: ModelViewTransform2,
                      soccerBallsInputEnabledProperty: TProperty<boolean>,
                      providedOptions: SoccerBallNodeOptions ) {

    // Use the y dimension, since it determines how the soccer balls stack. But maintain the same aspect ratio as the image
    const viewRadius = Math.abs( modelViewTransform.modelToViewDeltaY( SoccerCommonConstants.SOCCER_BALL_RADIUS ) );

    const enabledProperty = new Property( true );

    const options = optionize<SoccerBallNodeOptions, SelfOptions, ParentOptions>()( {
      cursor: 'pointer',
      enabledProperty: enabledProperty,

      // Data point should be visible if the soccer ball landed
      visibleProperty: new DerivedProperty( [ soccerBall.soccerBallPhaseProperty ], phase =>
        phase !== SoccerBallPhase.INACTIVE )
    }, providedOptions );

    super( soccerBall, modelViewTransform, SoccerCommonConstants.SOCCER_BALL_RADIUS, options );

    // The dark soccer ball is used for when a ball has input disabled.
    const soccerBallNode = new Image( ball_png );
    const soccerBallDarkNode = new Image( ballDark_png );
    const soccerBallNodes = new Node( {
      children: [ soccerBallNode, soccerBallDarkNode ],

      // if the child node is non-square, it should still fit within specified dimensions. Note: this does not change the
      // aspect ratio.
      maxWidth: viewRadius * 2,
      maxHeight: viewRadius * 2,

      // Center the nested Node for compatibility with DragListener
      center: Vector2.ZERO
    } );

    // Play sound only when dragging
    const isDraggingProperty = new BooleanProperty( false );

    // only setup input-related things if dragging is enabled
    const dragListener = new DragListener( {
      tandem: options.tandem.createTandem( 'dragListener' ),
      positionProperty: soccerBall.dragPositionProperty,
      transform: modelViewTransform,
      start: () => {
        isDraggingProperty.value = true;

        // if the user presses an object that's animating, allow it to keep animating up in the stack
        soccerBall.dragStartedEmitter.emit();
        this.moveToFront();
      },
      drag: () => {
        soccerBall.animation && soccerBall.animation.stop();
      },

      end: () => {
        isDraggingProperty.value = false;
      }
    } );


    // When the user drags a soccer ball, play audio corresponding to its new position.
    soccerBall.valueProperty.link( value => {
      if ( value !== null && ( isDraggingProperty.value ) ) {
        soccerBall.toneEmitter.emit( value );
      }
    } );

    // pan and zoom - In order to move the CAVObjectNode to a new position the pointer has to move more than half the
    // unit model length. When the CAVObjectNode is near the edge of the screen while zoomed in, the pointer doesn't
    // have enough space to move that far. If we make sure that bounds surrounding the CAVObjectNode have a width
    // of 2 model units the pointer will always have enough space to drag the CAVObjectNode to a new position.
    // See https://github.com/phetsims/center-and-variability/issues/88
    dragListener.createPanTargetBounds = () => {
      const modelPosition = soccerBall.positionProperty.value;
      const modelBounds = new Bounds2( modelPosition.x - 1, modelPosition.y - 1, modelPosition.x + 1, modelPosition.y + 1 );
      const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
      return this.parentToGlobalBounds( viewBounds );
    };

    this.addInputListener( dragListener );

    // For PhET-iO, allow clients to shut off interactivity via this Property.
    const selfInputEnabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'selfInputEnabledProperty' )
    } );

    // Prevent dragging or interaction while the object does not have a value (when it is not in the play area yet),
    // when it is animating, if input for this individual node is disabled, or if input for all of the object nodes
    // has been disabled
    Multilink.multilink(
      [ soccerBall.soccerBallPhaseProperty, soccerBall.valueProperty, selfInputEnabledProperty, soccerBallsInputEnabledProperty ],
      ( mode, value, selfInputEnabled, objectsInputEnabled ) => {
        const inputEnabled = value !== null && mode === SoccerBallPhase.STACKED && selfInputEnabled && objectsInputEnabled;

        // if input is disabled and the ball is in the play area, show the darker version
        const showEnabledSoccerBall = selfInputEnabled && objectsInputEnabled;
        const showDisabledSoccerBall = !showEnabledSoccerBall;
        soccerBallDarkNode.visible = showDisabledSoccerBall;
        soccerBallNode.visible = !showDisabledSoccerBall;

        this.inputEnabled = inputEnabled;
      } );

    this.addChild( soccerBallNodes );

    soccerBall.soccerBallLandedEmitter.addListener( () => {
      this.moveToFront();
    } );

    soccerBall.resetEmitter.addListener( () => {
      this.focusable = false;
      this.pickable = false;
      this.mouseArea = Shape.rectangle( 0, 0, 0, 0 );
      this.touchArea = Shape.rectangle( 0, 0, 0, 0 );
    } );

    this.addLinkedElement( soccerBall );

    // Not focusable until the ball has been kicked into the play area
    this.focusable = false;

    super.addDebugText( soccerBall );
  }
}

soccerCommon.register( 'SoccerBallNode', SoccerBallNode );