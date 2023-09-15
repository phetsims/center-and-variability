// Copyright 2023, University of Colorado Boulder

/**
 * Label text with highlight rectangle and arrow for the IQR (interquartile range) info display
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Node, ProfileColorProperty, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVColors from '../../common/CAVColors.js';

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

    // Container for the text and background rectangle
    const labelContainer = new Node( { children: [ textHighlightRect, textNode ], visible: !onlyShowArrow } );

    super( {
      children: [ arrowNode, labelContainer ], centerX: 0, centerY: -11, layoutOptions: {
        xAlign: 'center'
      }
    } );

    this.labelContainer = labelContainer;

    textNode.boundsProperty.link( newBounds => {
      textHighlightRect.setRectBounds( newBounds.dilateX( 2 ).dilateY( 1.5 ) );
      labelContainer.centerX = 0;
    } );
  }
}

centerAndVariability.register( 'BoxWhiskerLabelNode', BoxWhiskerLabelNode );
