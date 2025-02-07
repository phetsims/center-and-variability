// Copyright 2023-2024, University of Colorado Boulder

/**
 * BoxWhiskerLabelNode represents a graphical node for displaying labels associated with the Box-and-Whisker plots
 * used in the simulation. Specifically, this node visualizes the label for the interquartile range (IQR) with
 * optional highlighting and an arrow for emphasis.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants from '../../common/CAVConstants.js';

export default class BoxWhiskerLabelNode extends Node {

  // The container for the label text and highlight rectangle
  public readonly labelContainer: Node;

  public constructor( labelStringProperty: TReadOnlyProperty<string>, isQuartile: boolean, arrowFill: ProfileColorProperty, onlyShowArrow = false ) {

    const arrowNode = new ArrowNode( 0, 0, 0, 24, {
      fill: arrowFill,
      stroke: null,
      headHeight: 12,
      headWidth: 15,
      tailWidth: 4,
      maxHeight: 18
    } );

    const textNode = new Text( labelStringProperty, {
      fontSize: 14,
      fill: CAVColors.iqrLabelColorProperty,
      centerX: 0,
      centerY: 0,
      maxWidth: CAVConstants.IQR_LABEL_MAX_WIDTH
    } );

    const textHighlightRect = new Rectangle( 0, 0, 0, 0,
      { fill: CAVColors.iqrColorProperty, cornerRadius: 5, visible: isQuartile } );

    const labelContainer = new Node( { children: [ textHighlightRect, textNode ], visible: !onlyShowArrow } );

    super( {
      children: [ arrowNode, labelContainer ], centerX: 0, centerY: -11, layoutOptions: {
        xAlign: 'center'
      }
    } );

    this.labelContainer = labelContainer;

    textNode.boundsProperty.link( newBounds => {
      textHighlightRect.setRectBounds( newBounds.dilatedX( 2 ).dilatedY( 1.5 ) );
      labelContainer.centerX = 0;
    } );
  }
}

centerAndVariability.register( 'BoxWhiskerLabelNode', BoxWhiskerLabelNode );