// Copyright 2023, University of Colorado Boulder

/**
 * PlotNode for the info dialog in the Mean and Median Screen.
 * Adds a medianArrowNode to the plot node.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import MeanAndMedianPlotNode, { MeanAndMedianPlotNodeOptions } from './MeanAndMedianPlotNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import CAVColors from '../../common/CAVColors.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { DATA_POINT_SCALE_PROPERTY } from '../../common/CAVConstants.js';


type MeanAndMedianInfoPlotNodeOptions = StrictOmit<MeanAndMedianPlotNodeOptions, 'parentContext' | 'dataPointFill'> & EmptySelfOptions;

export default class MeanAndMedianInfoPlotNode extends MeanAndMedianPlotNode {
  public constructor( model: MeanAndMedianModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLine: NumberLineNode, providedOptions: MeanAndMedianInfoPlotNodeOptions ) {
    const options = optionize<MeanAndMedianInfoPlotNodeOptions, EmptySelfOptions, MeanAndMedianPlotNodeOptions>()( {
      parentContext: 'info',
      dataPointFill: CAVColors.meanAndMedianDataPointFill,
      isMeanAndMedianInfoPlot: true
    }, providedOptions );

    super( model, sceneModel, playAreaNumberLine, options );

    const modelViewTransfrom = this.modelViewTransform;

    const medianArrowNode = new ArrowNode( 0, 0, 0, MedianBarNode.NOTCH_HEIGHT + 5, {
      headHeight: 8,
      headWidth: 9,
      tailWidth: MedianBarNode.LINE_WIDTH,
      fill: CAVColors.medianColorProperty,
      stroke: null
    } );

    this.addChild( medianArrowNode );
    const updateMedianArrow = () => {
      const medianValue = sceneModel.medianValueProperty.value;

      if ( medianValue !== null ) {

        const medianArrowYPosition = sceneModel.getDataValues().includes( medianValue )
                                     ? sceneModel.getStackAtLocation( medianValue )[ sceneModel.getStackAtLocation( medianValue ).length - 1 ].positionProperty.value.y : 0;
        const x = modelViewTransfrom.modelToViewX( medianValue );
        const scale = DATA_POINT_SCALE_PROPERTY.value;
        const y = modelViewTransfrom.modelToViewY( medianArrowYPosition * scale );
        const dataPointRadius = medianArrowYPosition === 0 ? 0 : modelViewTransfrom.modelToViewDeltaY( scale / 2 );
        medianArrowNode.centerBottom = new Vector2( x, y + dataPointRadius );
      }

    };

    sceneModel.objectChangedEmitter.addListener( updateMedianArrow );
  }

}

centerAndVariability.register( 'MeanAndMedianInfoPlotNode', MeanAndMedianInfoPlotNode );