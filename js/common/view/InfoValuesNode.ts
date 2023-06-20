// Copyright 2023, University of Colorado Boulder

/**
 * Shows e.g., "Values: 1,3,4,5" with a median arrow indicating the median. Appears in the info dialogs for Median, Mean & Median and IQR.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import CAVColors from '../CAVColors.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CAVSoccerBall from '../model/CAVSoccerBall.js';

export default class InfoValuesNode<T extends CAVSoccerBall> extends Node {

  private readonly dataValuesMedianArrow: ArrowNode;
  private readonly dataValuesContainer: HBox;

  public constructor( public readonly sceneModel: CAVSoccerSceneModel<T> ) {

    const hasAtLeastOneDataPointProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );

    const dataValuesLabel = new Text( CenterAndVariabilityStrings.dataValuesStringProperty, {
      visibleProperty: hasAtLeastOneDataPointProperty,
      fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH
    } );

    const dataValuesContainer = new HBox( {
      spacing: 4,
      layoutOptions: { leftMargin: 6 }
    } );

    const dataValuesMedianArrow = new ArrowNode( 0, -15, 0, 2, {
      visibleProperty: hasAtLeastOneDataPointProperty,
      fill: CAVColors.medianColorProperty,
      stroke: null,
      headHeight: 8,
      headWidth: 10,
      tailWidth: 3,
      maxHeight: 18
    } );

    super( {
      excludeInvisibleChildrenFromBounds: true,
      children: [
        dataValuesMedianArrow,
        new HBox( {
          visibleProperty: hasAtLeastOneDataPointProperty,
          children: [ dataValuesLabel, dataValuesContainer ]
        } )
      ]
    } );

    this.dataValuesMedianArrow = dataValuesMedianArrow;
    this.dataValuesContainer = dataValuesContainer;
  }

  public update(): void {

    const sortedObjects = this.sceneModel.getSortedStackedObjects();
    const sortedData = sortedObjects.map( object => object.valueProperty.value );

    const dataValuesChildren: Node[] = [];

    const medianTextNodes: Node[] = [];

    const results: Array<{ text: Text; soccerBall: T }> = [];

    for ( let i = 0; i < sortedObjects.length; i++ ) {
      const valueTextGroupNode = new HBox( { spacing: 0 } );
      const valueTextGroupNodeChildren: Node[] = [];

      const valueTextNode = new Text( sortedData[ i ]!, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } );
      valueTextGroupNodeChildren.push( valueTextNode );

      if ( i < sortedObjects.length - 1 ) {
        valueTextGroupNodeChildren.push( new Text( ',', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ) );
      }

      valueTextGroupNode.setChildren( valueTextGroupNodeChildren );
      dataValuesChildren.push( valueTextGroupNode );

      if ( sortedObjects[ i ].isMedianObjectProperty.value ) {
        medianTextNodes.push( valueTextNode );
      }

      results.push( {
        text: valueTextNode,
        soccerBall: sortedObjects[ i ]
      } );
    }

    this.dataValuesContainer.setChildren( dataValuesChildren );

    if ( medianTextNodes.length > 0 ) {
      const arrowPosition = this.dataValuesMedianArrow.globalToLocalPoint( new Vector2( _.mean( medianTextNodes.map( textNode =>
        textNode.globalBounds.x + 0.5 * textNode.globalBounds.width ) ), medianTextNodes[ 0 ].globalBounds.y ) );
      this.dataValuesMedianArrow.setTail( arrowPosition.x, this.dataValuesMedianArrow.tailY );
      this.dataValuesMedianArrow.setTip( arrowPosition.x, this.dataValuesMedianArrow.tipY );
    }

    this.decorate( results );
  }

  public decorate( results: Array<{ text: Text; soccerBall: T }> ): void {

    // optional decorations in subclasses
  }
}

centerAndVariability.register( 'InfoValuesNode', InfoValuesNode );