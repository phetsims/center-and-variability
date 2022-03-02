// Copyright 2022, University of Colorado Boulder

/**
 * Base class which renders a Node for the CASObject.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import { Circle, Color, DragListener, Image, Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import CASObject from '../model/CASObject.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CASObjectType from '../model/CASObjectType.js';
import ball_png from '../../../images/ball_png.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { AnimationMode } from '../model/AnimationMode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import CASColors from '../CASColors.js';
import { RequiredTandem } from '../../../../tandem/js/PhetioObject.js';
import PlotType from '../model/PlotType.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import CASConstants from '../CASConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type CASObjectNodeSelfOptions = {
  objectViewType?: CASObjectType;
  draggingEnabled?: boolean;
};
export type CASObjectNodeOptions = CASObjectNodeSelfOptions & NodeOptions & RequiredTandem;

// for debugging with ?dev
let index = 0;

class CASObjectNode extends Node {

  constructor( casObject: CASObject, isShowingBottomMedianProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2, providedOptions?: CASObjectNodeOptions ) {

    const options = optionize<CASObjectNodeOptions, CASObjectNodeSelfOptions, NodeOptions>( {

      // In the Mean & Median screen and Spread screen, the objectType is SOCCER_BALL, but we render the dot plot
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
      fill: CASColors.medianColorProperty
    } );
    this.addChild( medianHighlight );

    const createPlotMarker = () => {
      const circle = new Circle( viewRadius, {
        fill: Color.BLACK,
        center: Vector2.ZERO
      } );
      const cross = new Path( timesSolidShape, {

        // Leave some spacing between the stacked 'x' marks
        fill: Color.BLACK, maxWidth: viewRadius * 2 * 0.8,
        center: Vector2.ZERO
      } );
      CASConstants.PLOT_TYPE_PROPERTY.link( plotType => {
        circle.visible = plotType === PlotType.DOT_PLOT;
        cross.visible = plotType === PlotType.LINE_PLOT;
      } );
      const node = new Node( {
        children: [ circle, cross ]
      } );
      return node;
    };

    const childNode = options.objectViewType === CASObjectType.SOCCER_BALL ? new Image( ball_png ) :
                      options.objectViewType === CASObjectType.DOT ? createPlotMarker() :
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
      tandem: options.tandem.createTandem( casObject.objectType === CASObjectType.SOCCER_BALL ? 'soccerBall' : 'dataPoint' ),
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
      this.addInputListener( dragListener );
      this.touchArea = this.localBounds.dilatedX( 10 );

      // Prevent dragging or interaction while the object is animating
      Property.multilink( [ casObject.animationModeProperty, casObject.valueProperty ], ( mode, value ) => {
        const isPickable = value !== null && mode === 'none';
        this.cursor = isPickable ? 'pointer' : null;
        this.pickable = isPickable;
        } );
    }

    // show or hide the median highlight
    Property.multilink( [ casObject.isMedianObjectProperty, isShowingBottomMedianProperty ],
      ( isMedianObject, isShowingBottomMedian ) => {
        medianHighlight.visible = isMedianObject && isShowingBottomMedian && options.objectViewType !== CASObjectType.DOT;
      } );

    // The initial ready-to-kick ball is full opacity. The rest of the balls waiting to be kicked are lower opacity so
    // they don't look like part of the data set, but still look kickable.
    Property.multilink( [ casObject.valueProperty, casObject.animationModeProperty ],
      ( value: number | null, animationMode: AnimationMode ) => {
        this.opacity = value === null && animationMode === 'none' && !casObject.isFirstObject ? 0.4 : 1;
      } );

    // isShowingAnimationHighlightProperty
    Property.multilink( [ casObject.isShowingAnimationHighlightProperty ],
      ( isShowingAnimationHighlight: boolean ) => {
        medianHighlight.visible = isShowingAnimationHighlight && options.objectViewType === CASObjectType.DOT;
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

centerAndSpread.register( 'CASObjectNode', CASObjectNode );
export default CASObjectNode;