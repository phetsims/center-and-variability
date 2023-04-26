// Copyright 2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import CAVModel from '../../common/model/CAVModel.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVPlotNode from '../../common/view/CAVPlotNode.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';

export type CAVPlotOptions = NodeOptions & PickRequired<NodeOptions, 'tandem'>;

// Prevent the median bar node from going off the top of the accordion box
const MARGIN_TO_TOP_OF_ACCORDION_BOX = 4;

export default class CAVPlotNodeWithMedianBar extends CAVPlotNode {

  private readonly medianBarNode = new MedianBarNode( {
    notchDirection: 'down',
    barStyle: 'continuous'
  } );

  public constructor( model: CAVModel, providedOptions?: CAVPlotOptions ) {
    super( model, providedOptions );

    this.addChild( this.medianBarNode );

    const modelViewTransform = this.modelViewTransform;

    const updateMedianBarNode = () => {

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );
      const leftmostDot = sortedDots[ 0 ];

      const medianValue = model.medianValueProperty.value;

      const MARGIN_Y = 5;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      if ( model.isShowingTopMedianProperty.value && leftmostDot ) {
        const highestDot = _.maxBy( sortedDots, object => object.positionProperty.value.y );
        const dotRadius = Math.abs( modelViewTransform.modelToViewDeltaY( leftmostDot.objectType.radius ) );

        // assumes all of the dots have the same radius
        // TODO: do we need to know notch height here?
        const barY = Math.max( modelViewTransform.modelToViewY( highestDot!.positionProperty.value.y ) -
                               dotRadius - MARGIN_Y - MedianBarNode.NOTCH_HEIGHT, MARGIN_TO_TOP_OF_ACCORDION_BOX );

        const rightmostDot = sortedDots[ sortedDots.length - 1 ];
        assert && assert( leftmostDot.valueProperty.value !== null );
        const left = modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        assert && assert( rightmostDot.valueProperty.value !== null );
        const right = modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );
        assert && assert( medianValue !== null );
        const medianPositionX = modelViewTransform.modelToViewX( medianValue! );

        this.medianBarNode.setMedianBarShape( barY, left, medianPositionX, right, ( model as MeanAndMedianModel ).isMedianAnimationCompleteProperty.value );
      }
      else {
        this.medianBarNode.clear();
      }
    };
    model.objectChangedEmitter.addListener( updateMedianBarNode );
    model.isShowingTopMedianProperty.link( updateMedianBarNode );
    if ( model instanceof MeanAndMedianModel ) {
      model.isMedianAnimationCompleteProperty.link( updateMedianBarNode );
    }
  }
}

centerAndVariability.register( 'CAVPlotNodeWithMedianBar', CAVPlotNodeWithMedianBar );