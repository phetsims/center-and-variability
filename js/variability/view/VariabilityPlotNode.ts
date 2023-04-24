// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVPlotNode from '../../common/view/CAVPlotNode.js';
import VariabilityModel from '../model/VariabilityModel.js';

export type CAVPlotOptions = NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VariabilityPlotNode extends CAVPlotNode {

  public constructor( model: VariabilityModel, numberLineWidth: number, providedOptions?: CAVPlotOptions ) {
    super( model, numberLineWidth, providedOptions );

    const rangeRectangle = new Rectangle( 0, 50, 100, 70, {
      fill: '#c3fdb9',
      stroke: 'lightGray'
    } );
    this.addChild( rangeRectangle );

    const modelViewTransform = this.modelViewTransform;

    const updateRangeNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( leftmostDot && model.isShowingRangeProperty.value ) {

        // assumes all of the dots have the same radius
        const rightmostDot = sortedDots[ sortedDots.length - 1 ];
        const left = modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );

        const floor = modelViewTransform.modelToViewY( 0 );
        rangeRectangle.rectWidth = right - left;
        rangeRectangle.left = left;
        rangeRectangle.bottom = floor;
        rangeRectangle.visible = true;
      }
      else {
        rangeRectangle.visible = false;
      }
    };
    model.objectChangedEmitter.addListener( updateRangeNode );
    model.isShowingRangeProperty.link( updateRangeNode );

    rangeRectangle.moveToBack();
  }
}

centerAndVariability.register( 'VariabilityPlotNode', VariabilityPlotNode );