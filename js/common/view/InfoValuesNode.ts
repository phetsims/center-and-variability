// Copyright 2023-2025, University of Colorado Boulder

/**
 * InfoValuesNode displays a sequence like "Values: 1,3,4,5" and highlights the median with an arrow.
 * It is utilized in the info dialogs for Median, Mean & Median, and IQR.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';
import CAVSoccerBall from '../model/CAVSoccerBall.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class InfoValuesNode<T extends CAVSoccerBall> extends Node {

  private readonly dataValuesMedianArrow: ArrowNode;
  private readonly dataValuesContainer: HBox;
  private medianTextNodes: Node[] = [];

  public constructor( private readonly sceneModel: CAVSoccerSceneModel<T> ) {

    const hasAtLeastOneDataPointProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );

    const valueDependencies = sceneModel.soccerBalls.map( soccerBall => soccerBall.valueProperty );
    const valuesStringProperty = DerivedProperty.deriveAny( [ ...valueDependencies ], () => {
      const numberOfDataPoints = sceneModel.getSortedStackedObjects().length;
      const values = numberOfDataPoints > 0 ? sceneModel.getDataValues() : [];
      return values.length > 0 ? values.join( ', ' ) : '';
    } );

    const dataValuesLabel = new Text( CenterAndVariabilityStrings.dataValuesInMetersStringProperty, {
      visibleProperty: hasAtLeastOneDataPointProperty,
      fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
      accessibleParagraph: CenterAndVariabilityFluent.a11y.infoDialog.dataValues.createProperty( {
        values: valuesStringProperty
      } )
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
      ],
      isDisposable: false
    } );

    this.dataValuesMedianArrow = dataValuesMedianArrow;
    this.dataValuesContainer = dataValuesContainer;

    ManualConstraint.create( this, [ dataValuesContainer ], () => {
      this.updateDecorations();
    } );
  }

  public updateDecorations(): void {
    this.updateArrowNode();
  }

  private updateArrowNode(): void {
    if ( this.medianTextNodes.length > 0 ) {
      const arrowPosition = this.dataValuesMedianArrow.globalToLocalPoint( new Vector2(
        _.mean( this.medianTextNodes.map( textNode => textNode.globalBounds.centerX ) ),
        this.medianTextNodes[ 0 ].globalBounds.y )
      );
      this.dataValuesMedianArrow.setTail( arrowPosition.x, this.dataValuesMedianArrow.tailY );
      this.dataValuesMedianArrow.setTip( arrowPosition.x, this.dataValuesMedianArrow.tipY );
    }
  }

  public update(): void {
    const sortedObjects = this.sceneModel.getSortedStackedObjects();
    const sortedData = sortedObjects.map( object => object.valueProperty.value );

    const dataValuesChildren: Node[] = [];

    this.medianTextNodes = [];

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
        this.medianTextNodes.push( valueTextNode );
      }

      results.push( {
        text: valueTextNode,
        soccerBall: sortedObjects[ i ]
      } );
    }

    this.dataValuesContainer.setChildren( dataValuesChildren );
    this.updateArrowNode();
    this.decorate( results );
  }

  public decorate( results: Array<{ text: Text; soccerBall: T }> ): void {

    // optional decorations in subclasses
  }
}

centerAndVariability.register( 'InfoValuesNode', InfoValuesNode );