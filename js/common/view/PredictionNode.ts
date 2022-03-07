// Copyright 2022, University of Colorado Boulder

/**
 * Shows a shaded sphere and arrow pointing up, to show where the user predicts a median value.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { ColorDef, DragListener, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { RequiredTandem } from '../../../../tandem/js/PhetioObject.js';
import CASColors from '../CASColors.js';
import CASConstants from '../CASConstants.js';

type SelfOptions = {
  color: ColorDef,

  // Round to the nearest specified number, or, if null, there is no rounding. Mean is continuous, median is rounded to 0.5
  roundToInterval: number | null
};

export type PredictionNodeOptions = SelfOptions & NodeOptions & RequiredTandem;

class PredictionNode extends Node {

  constructor( predictionProperty: Property<number>, modelViewTransform: ModelViewTransform2, dragRange: Range,
               providedOptions: PredictionNodeOptions ) {

    const shadedSphereNode = new ShadedSphereNode( 16, {

      // TODO-DESIGN: This looks more orange in the mockup.  Use colorblind red?
      mainColor: providedOptions.color,
      stroke: CASColors.arrowStrokeProperty,
      lineWidth: CASConstants.ARROW_LINE_WIDTH
    } );

    // TODO-DESIGN: The mockup shows different arrowheads.
    const arrowNode = new ArrowNode( 0, 0, 0, -50, {
      headHeight: 10,
      headWidth: 14,
      tailWidth: 2,
      fill: providedOptions.color,
      stroke: CASColors.arrowStrokeProperty,
      lineWidth: CASConstants.ARROW_LINE_WIDTH
    } );
    const options = optionize<PredictionNodeOptions, SelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED,
      children: [ arrowNode, shadedSphereNode ],
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    this.addLinkedElement( predictionProperty, {
      tandem: options.tandem.createTandem( 'predictionProperty' )
    } );

    // In view coordinates
    const dragPositionProperty = new Vector2Property( modelViewTransform.modelToViewXY( predictionProperty.value, 0 ) );

    dragPositionProperty.lazyLink( dragPosition => {
      const constrainedValue = dragRange.constrainValue( modelViewTransform.viewToModelX( dragPosition.x ) );

      // TODO-UX: Dragging seems to lag and is sluggish.  Maybe rasterize the node?????
      predictionProperty.value = options.roundToInterval === null ?
                                 constrainedValue :
                                 Utils.roundToInterval( constrainedValue, options.roundToInterval );
    } );

    predictionProperty.link( prediction => {

      // TODO: Factor out tick mark height
      this.centerTop = modelViewTransform.modelToViewXY( prediction, 0 ).plusXY( 0, 45 );
    } );

    this.addInputListener( new DragListener( {
      positionProperty: dragPositionProperty,
      start: () => this.moveToFront()
    } ) );
  }
}

centerAndSpread.register( 'PredictionNode', PredictionNode );
export default PredictionNode;