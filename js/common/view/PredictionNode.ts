// Copyright 2022, University of Colorado Boulder

/**
 * Shows a shaded sphere and arrow pointing up, to show where the user predicts a median value.
 * Snaps to 0.5 increments.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { DragListener, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';

type PredictionNodeSelfOptions = {};
export type PredictionNodeOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class PredictionNode extends Node {

  constructor( predictionProperty: Property<number>, modelViewTransform: ModelViewTransform2, dragRange: Range,
               providedOptions?: PredictionNodeOptions ) {

    const shadedSphereNode = new ShadedSphereNode( 20, {

      // TODO: Add more colors to the color profile editor
      // TODO-DESIGN: This looks more orange in the mockup
      // TODO-DESIGN: Colorblind red?
      // TODO: This should be passed in the options
      mainColor: 'red'
    } );

    // TODO-DESIGN: The mockup shows different arrowheads.
    const arrowNode = new ArrowNode( 0, 0, 0, -50, {
      headHeight: 14,
      headWidth: 14,
      tailWidth: 2,
      fill: 'red',
      stroke: null,
      bottomCenter: shadedSphereNode.center
    } );
    const options = optionize<PredictionNodeOptions, PredictionNodeSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED,
      children: [ arrowNode, shadedSphereNode ],

      // TODO: Touch area
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

      // TODO: Dragging seems to lag and is sluggish.  Maybe rasterize the node?????
      predictionProperty.value = Utils.roundToInterval( constrainedValue, 0.5 );
    } );

    predictionProperty.link( prediction => {

      // TODO: Factor out tick mark height
      this.centerTop = modelViewTransform.modelToViewXY( prediction, 0 ).plusXY( 0, 45 );
    } );

    this.addInputListener( new DragListener( {
      positionProperty: dragPositionProperty
    } ) );
  }
}

centerAndSpread.register( 'PredictionNode', PredictionNode );
export default PredictionNode;