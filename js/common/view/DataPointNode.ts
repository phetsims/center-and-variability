// Copyright 2023-2024, University of Colorado Boulder

/**
 * DataPointNode is responsible for rendering a graphical representation (either a circle or an 'x') of a data point
 * depending on the current plot type. Each DataPointNode is associated with a soccer ball to keep track of its value
 * on the plot. This node can also highlight the median data point when required.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import SoccerObjectNode, { SoccerObjectNodeOptions } from '../../../../soccer-common/js/view/SoccerObjectNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CAVObjectType from '../model/CAVObjectType.js';
import { Circle, Node, Path, TColor } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import CAVConstants, { DATA_POINT_SCALE_PROPERTY } from '../CAVConstants.js';
import PlotType from '../model/PlotType.js';
import CAVColors from '../CAVColors.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import CAVSoccerBall from '../model/CAVSoccerBall.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';

type SelfOptions = {

  // The fill color of the data point
  fill: TColor;

  // Whether the data point is part of the info display of the 'Mean and Median' screen. Used for showing the median highlight.
  isMeanAndMedianInfoNode?: boolean;
};

type DataPointNodeOptions = StrictOmit<SoccerObjectNodeOptions, 'tandem'> & SelfOptions;

export default class DataPointNode extends SoccerObjectNode {

  protected readonly medianHighlight: Circle;

  public constructor( soccerBall: CAVSoccerBall,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: DataPointNodeOptions ) {

    const translationProperty = new Property( new Vector2( 1, 0 ), {
      reentrant: true
    } );
    const translationStrategy = ( position: Vector2 ) => {
      const scale = DATA_POINT_SCALE_PROPERTY.value;
      const scaledPosition = new Vector2( position.x, position.y * scale );
      translationProperty.value = modelViewTransform.modelToViewPosition( scaledPosition );
    };

    const options = optionize<DataPointNodeOptions, SelfOptions, SoccerObjectNodeOptions>()( {
      translationStrategy: translationStrategy,
      isMeanAndMedianInfoNode: false,

      // Individual data points are not interactive and not PhET-iO instrumented, but the client can hide/show all data points
      // at once using dataPointLayer.visibleProperty
      tandem: Tandem.OPT_OUT,
      pickable: false,

      // Data point should be visible if the soccer ball landed
      visibleProperty: new DerivedProperty( [ soccerBall.soccerBallPhaseProperty ], phase =>
        phase === SoccerBallPhase.STACKED || phase === SoccerBallPhase.STACKING )
    }, providedOptions );

    super( soccerBall, modelViewTransform, options );

    DATA_POINT_SCALE_PROPERTY.link( scale => {
      this.setScaleMagnitude( scale );
      translationStrategy( this.soccerBall.positionProperty.value );
    } );

    translationProperty.link( translation => {
      this.translation = translation;
    } );

    const viewRadius = modelViewTransform.modelToViewDeltaX( CAVObjectType.DATA_POINT.radius );

    const medianHighlightVisibleProperty = options.isMeanAndMedianInfoNode ? new DerivedProperty( [ soccerBall.isMedianObjectProperty ], isMedianObject => isMedianObject ) : soccerBall.isAnimationHighlightVisibleProperty;

    this.medianHighlight = new Circle( viewRadius + 1, {
      visibleProperty: medianHighlightVisibleProperty,
      fill: CAVColors.medianColorProperty
    } );
    this.addChild( this.medianHighlight );

    const circle = new Circle( 0.9 * viewRadius, {
      fill: providedOptions.fill,
      center: Vector2.ZERO
    } );
    const cross = new Path( timesSolidShape, {

      // Leave some spacing between the stacked 'x' marks
      fill: providedOptions.fill,
      maxWidth: viewRadius * 2 * 0.8,
      center: Vector2.ZERO
    } );
    CAVConstants.PLOT_TYPE_PROPERTY.link( plotType => {
      circle.visible = plotType === PlotType.DOT_PLOT;
      cross.visible = plotType === PlotType.LINE_PLOT;
    } );
    const node = new Node( {
      children: [ circle, cross ],

      // if the child node is non-square, it should still fit within specified dimensions. Note: this does not change the
      // aspect ratio.
      maxWidth: viewRadius * 2,
      maxHeight: viewRadius * 2,
      center: Vector2.ZERO
    } );

    this.addChild( node );

    super.addDebugText( soccerBall );
  }
}

centerAndVariability.register( 'DataPointNode', DataPointNode );