// Copyright 2022-2023, University of Colorado Boulder

/**
 * Base class which renders a Node for the CAVObject.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import centerAndVariability from '../../centerAndVariability.js';
import { Circle, DragListener, Image, Node, NodeOptions, Path, TColor, Text } from '../../../../scenery/js/imports.js';
import CAVObject from '../model/CAVObject.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVObjectType from '../model/CAVObjectType.js';
import ball_png from '../../../images/ball_png.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { AnimationMode } from '../model/AnimationMode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CAVColors from '../CAVColors.js';
import PlotType from '../model/PlotType.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import CAVConstants from '../CAVConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TProperty from '../../../../axon/js/TProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ballDark_png from '../../../images/ballDark_png.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';

type SelfOptions = {
  objectViewType?: CAVObjectType;
  draggingEnabled?: boolean;
  fill: TColor;
};
export type CAVObjectNodeOptions =
  SelfOptions

  // Take all options from NodeOptions, but do not allow passing through inputEnabledProperty since it requires special handling in multilink
  & StrictOmit<NodeOptions, 'inputEnabledProperty'>
  & PickRequired<NodeOptions, 'tandem'>;

// for debugging with ?dev
let index = 0;

export default class CAVObjectNode extends Node {
  private readonly dragListener: DragListener | null;
  private readonly selfInputEnabledProperty: BooleanProperty | null;

  private readonly inputEnabledMultilink: UnknownMultilink | null;
  private readonly medianHighlightVisibleMultilink: UnknownMultilink;
  private readonly opacityMultilink: UnknownMultilink;

  public constructor( cavObject: CAVObject, isShowingPlayAreaMedianProperty: TReadOnlyProperty<boolean>,
                      modelViewTransform: ModelViewTransform2, objectNodesInputEnabledProperty: TProperty<boolean>,
                      providedOptions?: CAVObjectNodeOptions ) {

    const options = optionize<CAVObjectNodeOptions, SelfOptions, NodeOptions>()( {

      // In the Mean & Median screen and Variability screen, the objectType is SOCCER_BALL, but we render the dot plot
      // with DOT views
      objectViewType: cavObject.objectType,
      draggingEnabled: true,
      phetioDynamicElement: true,
      cursor: 'pointer'
    }, providedOptions );
    super( options );

    const viewRadius = modelViewTransform.modelToViewDeltaX( options.objectViewType.radius );

    // TODO-UX: These should be edge to edge
    // TODO-UX: For small dots, there is an optical illusion or rasterizing/roundoff/aliasing issue that makes it
    // look lopsided (heavier on the left)
    // TODO-DESIGN: This highlight is difficult to see.
    const medianHighlight = new Circle( viewRadius + 1.75, {
      fill: CAVColors.medianColorProperty
    } );
    this.addChild( medianHighlight );

    const createPlotMarker = () => {
      const circle = new Circle( viewRadius, {
        fill: options.fill,
        center: Vector2.ZERO
      } );
      const cross = new Path( timesSolidShape, {

        // Leave some spacing between the stacked 'x' marks
        fill: options.fill,
        maxWidth: viewRadius * 2 * 0.8,
        center: Vector2.ZERO
      } );
      CAVConstants.PLOT_TYPE_PROPERTY.link( plotType => {
        circle.visible = plotType === PlotType.DOT_PLOT;
        cross.visible = plotType === PlotType.LINE_PLOT;
      } );
      const node = new Node( {
        children: [ circle, cross ]
      } );
      return node;
    };

    // The dark soccer ball is used for when a ball has input disabled.
    const soccerBallNode = new Image( ball_png );
    const soccerBallDarkNode = new Image( ballDark_png );
    const soccerBallNodes = new Node( {
      children: [ soccerBallNode, soccerBallDarkNode ]
    } );

    const childNode = options.objectViewType === CAVObjectType.SOCCER_BALL ? soccerBallNodes :
                      options.objectViewType === CAVObjectType.DATA_POINT ? createPlotMarker() :
                      new ShadedSphereNode( options.objectViewType.radius * 2 );
    childNode.maxWidth = viewRadius * 2;

    // if the child node is non-square, it should still fit within specified dimensions. Note: this does not change the
    // aspect ratio.
    childNode.maxHeight = childNode.maxWidth;

    // Center the nested Node for compatibility with DragListener
    childNode.center = Vector2.ZERO;

    // TODO: Add a comment that explains why this nested layer is necessary
    this.addChild( childNode );

    this.addLinkedElement( cavObject, {
      tandem: options.tandem.createTandem( cavObject.objectType === CAVObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' ),
      phetioState: false
    } );

    cavObject.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // only setup input-related things if dragging is enabled
    if ( options.draggingEnabled ) {
      this.dragListener = new DragListener( {
        tandem: options.tandem.createTandem( 'dragListener' ),
        positionProperty: cavObject.dragPositionProperty,
        transform: modelViewTransform,
        start: () => {

          // if the user presses an object that's animating, allow it to keep animating up in the stack
          cavObject.dragStartedEmitter.emit();
        },
        drag: () => {
          cavObject.animation && cavObject.animation.stop();
        }
      } );

      // pan and zoom - In order to move the CAVObjectNode to a new position the pointer has to move more than half the
      // unit model length. When the CAVObjectNode is near the edge of the screen while zoomed in, the pointer doesn't
      // have enough space to move that far. If we make sure that bounds surrounding the CAVObjectNode have a width
      // of 2 model units the pointer will always have enough space to drag the CAVObjectNode to a new position.
      // See https://github.com/phetsims/center-and-variability/issues/88
      this.dragListener.createPanTargetBounds = () => {
        const modelPosition = cavObject.positionProperty.value;
        const modelBounds = new Bounds2( modelPosition.x - 1, modelPosition.y - 1, modelPosition.x + 1, modelPosition.y + 1 );
        const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
        return this.parentToGlobalBounds( viewBounds );
      };

      this.addInputListener( this.dragListener );
      this.touchArea = this.localBounds.dilatedX( 5 );

      // TODO: better name? (can't use inputEnabledProperty)
      // not passed through through options or assigned to super with usual 'inputEnabledProperty' name because other
      // factors affect inputEnabled, see multilink below
      this.selfInputEnabledProperty = new BooleanProperty( true, {
        tandem: options.tandem.createTandem( 'inputEnabledProperty' )
      } );

      // Prevent dragging or interaction while the object does not have a value (when it is not in the play area yet),
      // when it is animating, if input for this individual node is disabled, or if input for all of the object nodes
      // ahs been disabled
      this.inputEnabledMultilink = Multilink.multilink(
        [ cavObject.animationModeProperty, cavObject.valueProperty, this.selfInputEnabledProperty, objectNodesInputEnabledProperty ],
        ( mode, value, selfInputEnabled, objectsInputEnabled ) => {
          const inputEnabled = value !== null && mode === AnimationMode.NONE && selfInputEnabled && objectsInputEnabled;

          if ( options.objectViewType === CAVObjectType.SOCCER_BALL ) {

            // if input is disabled and the ball is in the play area, show the darker version
            const showDisabledSoccerBall = !inputEnabled && value !== null;
            soccerBallDarkNode.visible = showDisabledSoccerBall;
            soccerBallNode.visible = !showDisabledSoccerBall;
          }

          this.inputEnabled = inputEnabled;
        } );
    }
    else {
      this.dragListener = null;
      this.selfInputEnabledProperty = null;
      this.inputEnabledMultilink = null;
    }

    // show or hide the median highlight
    this.medianHighlightVisibleMultilink = Multilink.multilink(
      [ cavObject.isMedianObjectProperty, isShowingPlayAreaMedianProperty, cavObject.isShowingAnimationHighlightProperty ],
      ( isMedianObject, isShowingPlayAreaMedian, isShowingAnimationHighlight ) => {
        medianHighlight.visible = options.objectViewType === CAVObjectType.DATA_POINT ? isShowingAnimationHighlight :
                                  isShowingPlayAreaMedian && isMedianObject;
      } );

    // The initial ready-to-kick ball is full opacity. The rest of the balls waiting to be kicked are lower opacity so
    // they don't look like part of the data set, but still look kickable.
    this.opacityMultilink = Multilink.multilink( [ cavObject.valueProperty, cavObject.animationModeProperty ],
      ( value, animationMode ) => {
        this.opacity = value === null && animationMode === AnimationMode.NONE && !cavObject.isFirstObject ? 0.4 : 1;
      } );

    // Show index when debugging with ?dev
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Text( index++ + '', {
        font: new PhetFont( 14 ),
        fill: 'red',
        x: this.width / 2 + 1
      } ) );
    }
  }

  public override dispose(): void {
    Multilink.unmultilink( this.opacityMultilink );
    Multilink.unmultilink( this.medianHighlightVisibleMultilink );
    this.inputEnabledMultilink && Multilink.unmultilink( this.inputEnabledMultilink );
    this.selfInputEnabledProperty && this.selfInputEnabledProperty.dispose();
    this.dragListener && this.hasInputListener( this.dragListener ) && this.removeInputListener( this.dragListener );
    this.dragListener && this.dragListener.dispose();
    super.dispose();
  }
}

centerAndVariability.register( 'CAVObjectNode', CAVObjectNode );