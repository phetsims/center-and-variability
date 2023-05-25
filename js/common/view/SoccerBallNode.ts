// Copyright 2023, University of Colorado Boulder

import CAVObjectNode, { CAVObjectNodeOptions } from './CAVObjectNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import SoccerBall from '../model/SoccerBall.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TProperty from '../../../../axon/js/TProperty.js';
import { DragListener, Image, Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { AnimationMode } from '../model/AnimationMode.js';
import CAVObjectType from '../model/CAVObjectType.js';
import ballDark_png from '../../../images/ballDark_png.js';
import ball_png from '../../../images/ball_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Property from '../../../../axon/js/Property.js';
import CAVConstants from '../CAVConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import NumberTone from '../model/NumberTone.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = CAVObjectNodeOptions & AccessibleSliderOptions;

export default class SoccerBallNode extends AccessibleSlider( CAVObjectNode, 3 ) {

  public constructor( soccerBall: SoccerBall, isSceneVisibleProperty: TReadOnlyProperty<boolean>,
                      modelViewTransform: ModelViewTransform2, objectNodesInputEnabledProperty: TProperty<boolean>,
                      providedOptions: CAVObjectNodeOptions ) {

    // Use the y dimension, since it determines how the soccer balls stack. But maintain the same aspect ratio as the image
    const viewRadius = Math.abs( modelViewTransform.modelToViewDeltaY( CAVObjectType.SOCCER_BALL.radius ) );

    const enabledProperty = new Property( true );

    // TODO: https://github.com/phetsims/center-and-variability/issues/162 when moving to a tall stack, focus gets lost
    // I thought it was a rounding error but the problem persisted even after I added roundToStepSize: true

    // The drag listener requires a numeric value (does not support null), so map it through a DynamicProperty
    const dynamicProperty = new DynamicProperty( new Property( soccerBall.valueProperty ), {
      bidirectional: true,
      map: function( value: number | null ) { return value === null ? 0 : value;},
      inverseMap: function( value: number ) { return value === 0 ? null : value; }
    } );

    const options = optionize<CAVObjectNodeOptions, SelfOptions, ParentOptions>()( {
      cursor: 'pointer',
      enabledRangeProperty: new Property( CAVConstants.PHYSICAL_RANGE ),
      valueProperty: dynamicProperty,
      keyboardStep: 1,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 5,
      roundToStepSize: true,
      enabledProperty: enabledProperty
    }, providedOptions );

    super( soccerBall, modelViewTransform, CAVObjectType.SOCCER_BALL.radius, options );

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
    let isDragging = false;

    // only setup input-related things if dragging is enabled
    const dragListener = new DragListener( {
      tandem: options.tandem.createTandem( 'dragListener' ),
      positionProperty: soccerBall.dragPositionProperty,
      transform: modelViewTransform,
      start: () => {
        isDragging = true;

        // if the user presses an object that's animating, allow it to keep animating up in the stack
        soccerBall.dragStartedEmitter.emit();
        this.moveToFront();
      },
      drag: () => {
        soccerBall.animation && soccerBall.animation.stop();
      },

      end: () => {
        isDragging = false;
      }
    } );

    // When the user drags a soccer ball, play audio corresponding to its new position.
    soccerBall.positionProperty.link( position => {
      if ( isDragging ) {
        const x = soccerBall.positionProperty.value.x;
        NumberTone.play( x );
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
      [ soccerBall.soccerBallPhaseProperty, soccerBall.valueProperty, selfInputEnabledProperty, objectNodesInputEnabledProperty ],
      ( mode, value, selfInputEnabled, objectsInputEnabled ) => {
        const inputEnabled = value !== null && mode === AnimationMode.STACKED && selfInputEnabled && objectsInputEnabled;

        // if input is disabled and the ball is in the play area, show the darker version
        const showEnabledSoccerBall = selfInputEnabled && objectsInputEnabled;
        const showDisabledSoccerBall = !showEnabledSoccerBall;
        soccerBallDarkNode.visible = showDisabledSoccerBall;
        soccerBallNode.visible = !showDisabledSoccerBall;

        this.inputEnabled = inputEnabled;
      } );

    this.addChild( soccerBallNodes );

    // Data point should be visible if the soccer ball is active AND if the scene is visible.
    Multilink.multilink( [ soccerBall.isActiveProperty, isSceneVisibleProperty ], ( isActive, isSceneVisible ) => {

      // TODO: https://github.com/phetsims/center-and-variability/issues/162 do we still need isSceneVisible?
      this.visible = isActive && isSceneVisible;
    } );

    soccerBall.soccerBallLandedEmitter.addListener( () => {
      this.moveToFront();
    } );

    this.addLinkedElement( soccerBall, {
      tandem: options.tandem.createTandem( 'soccerBall' )
    } );

    // Not focusable until the ball has been kicked into the play area
    // TODO https://github.com/phetsims/center-and-variability/issues/162 will this need to be triggered to take the correct value via phet-io stateful attributes?
    this.focusable = false;

    super.addDebugText( soccerBall );
  }
}

centerAndVariability.register( 'SoccerBallNode', SoccerBallNode );