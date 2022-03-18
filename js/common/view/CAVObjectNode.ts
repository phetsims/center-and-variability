// Copyright 2022, University of Colorado Boulder

/**
 * Base class which renders a Node for the CAVObject.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import { Circle, DragListener, Image, Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import CAVObject from '../model/CAVObject.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVObjectType from '../model/CAVObjectType.js';
import ball_png from '../../../images/ball_png.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { AnimationMode } from '../model/AnimationMode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import CAVColors from '../CAVColors.js';
import PlotType from '../model/PlotType.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import CAVConstants from '../CAVConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {
  objectViewType?: CAVObjectType;
  draggingEnabled?: boolean;
};
export type CAVObjectNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

// for debugging with ?dev
let index = 0;

class CAVObjectNode extends Node {

  constructor( casObject: CAVObject, isShowingPlayAreaMedianProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2, providedOptions?: CAVObjectNodeOptions ) {

    const options = optionize<CAVObjectNodeOptions, SelfOptions, NodeOptions>( {

      // In the Mean & Median screen and Variability screen, the objectType is SOCCER_BALL, but we render the dot plot
      // with DOT views
      objectViewType: casObject.objectType,
      draggingEnabled: true,
      phetioDynamicElement: true
    }, providedOptions );
    super( options );

    const viewRadius = modelViewTransform.modelToViewDeltaX( options.objectViewType.radius );

    // TODO-UX: These should be edge to edge
    // TODO-UX: For small dots, there is an optical illusion or rasterizing/roundoff/aliasing issue that makes it
    // look lopsided (heavier on the left)
    // TODO-DESIGN: This highlight is difficult to see
    const medianHighlight = new Circle( viewRadius + 1.75, {
      fill: CAVColors.medianColorProperty
    } );
    this.addChild( medianHighlight );

    const createPlotMarker = () => {
      const circle = new Circle( viewRadius, {
        fill: 'black',
        center: Vector2.ZERO
      } );
      const cross = new Path( timesSolidShape, {

        // Leave some spacing between the stacked 'x' marks
        fill: 'black',
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

    const childNode = options.objectViewType === CAVObjectType.SOCCER_BALL ? new Image( ball_png ) :
                      options.objectViewType === CAVObjectType.DOT ? createPlotMarker() :
                      new ShadedSphereNode( options.objectViewType.radius * 2 );
    childNode.maxWidth = viewRadius * 2;

    // if the child node is non-square, it should still fit within specified dimensions. Note: this does not change the
    // aspect ratio.
    childNode.maxHeight = childNode.maxWidth;

    // Center the nested Node for compatibility with DragListener
    childNode.center = Vector2.ZERO;

    // TODO: CK: Better comment that explains why this nested layer is necessary
    this.addChild( childNode );

    this.addLinkedElement( casObject, {
      tandem: options.tandem.createTandem( casObject.objectType === CAVObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' ),
      phetioState: false
    } );

    casObject.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // only setup input-related things if dragging is enabled
    if ( options.draggingEnabled ) {
      const dragListener = new DragListener( {
        positionProperty: casObject.dragPositionProperty,
        transform: modelViewTransform,
        start: () => {

          // if the user presses an object that's animating, allow it to keep animating up in the stack
          casObject.dragStartedEmitter.emit();
        },
        drag: () => {
          casObject.animation && casObject.animation.stop();
        }
      } );

      // pan and zoom - In order to move the CAVObjectNode to a new position the pointer has to move more than half the
      // unit model length. When the CAVObjectNode is near the edge of the screen while zoomed in, the pointer doesn't
      // have enough space to move that far. If we make sure that bounds surrounding the CAVObjectNode have a width
      // of 2 model units the pointer will always have enough space to drag the CAVObjectNode to a new position.
      // See https://github.com/phetsims/center-and-variability/issues/88
      dragListener.createPanTargetBounds = () => {
        const modelPosition = casObject.positionProperty.value;
        const modelBounds = new Bounds2( modelPosition.x - 1, modelPosition.y - 1, modelPosition.x + 1, modelPosition.y + 1 );
        const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
        return this.parentToGlobalBounds( viewBounds );
      };

      this.addInputListener( dragListener );
      this.touchArea = this.localBounds.dilatedX( 10 );

      // Prevent dragging or interaction while the object is animating
      Property.multilink( [ casObject.animationModeProperty, casObject.valueProperty ], ( mode, value ) => {
        const isPickable = value !== null && mode === AnimationMode.NONE;
        this.cursor = isPickable ? 'pointer' : null;
        this.pickable = isPickable;
      } );
    }

    // show or hide the median highlight
    Property.multilink( [ casObject.isMedianObjectProperty, isShowingPlayAreaMedianProperty, casObject.isShowingAnimationHighlightProperty ],
      ( isMedianObject, isShowingPlayAreaMedian, isShowingAnimationHighlight ) => {
        medianHighlight.visible = options.objectViewType === CAVObjectType.DOT ? isShowingAnimationHighlight :
                                  isShowingPlayAreaMedian && isMedianObject;
      } );

    // The initial ready-to-kick ball is full opacity. The rest of the balls waiting to be kicked are lower opacity so
    // they don't look like part of the data set, but still look kickable.
    Property.multilink( [ casObject.valueProperty, casObject.animationModeProperty ],
      ( value: number | null, animationMode: AnimationMode ) => {
        this.opacity = value === null && animationMode === AnimationMode.NONE && !casObject.isFirstObject ? 0.4 : 1;
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
}

centerAndVariability.register( 'CAVObjectNode', CAVObjectNode );
export default CAVObjectNode;