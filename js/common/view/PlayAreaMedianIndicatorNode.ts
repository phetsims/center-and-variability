// Copyright 2023, University of Colorado Boulder

/**
 * PlayAreaMedianIndicatorNode is a graphical UI component that represents an arrow pointing downwards,
 * indicating the median value on a number line within the play area.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import SoccerCommonColors from '../../../../soccer-common/js/SoccerCommonColors.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';

export default class PlayAreaMedianIndicatorNode extends ArrowNode {
  public constructor() {
    super( 0, 0, 0, 27, {
      fill: CAVColors.medianColorProperty,
      stroke: SoccerCommonColors.arrowStrokeProperty,
      lineWidth: CAVConstants.ARROW_LINE_WIDTH,
      headHeight: 12,
      headWidth: 18,
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'PlayAreaMedianIndicatorNode', PlayAreaMedianIndicatorNode );