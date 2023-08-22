// Copyright 2023, University of Colorado Boulder

/**
 * Shows the values in the IQR (interquartile range) info dialog, with an arrow over the median and blue highlight
 * over q1 and q3.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import InfoValuesNode from '../../common/view/InfoValuesNode.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import CAVColors from '../../common/CAVColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import VariabilitySoccerBall from '../model/VariabilitySoccerBall.js';

export default class IQRInfoValuesNode extends InfoValuesNode<VariabilitySoccerBall> {

  // The data values that make up the Q1 boundary
  private readonly dataValuesQ1Rect: Rectangle;

  // The data values that make up the Q3 boundary
  private readonly dataValuesQ3Rect: Rectangle;

  // The text nodes being highlighted as part of the Q1 boundary
  private q1TextNodes: Node[] = [];

  // The text nodes being highlighted as part of the Q3 boundary
  private q3TextNodes: Node[] = [];

  public constructor( sceneModel: VariabilitySceneModel, hasEnoughDataForIQRProperty: TReadOnlyProperty<boolean> ) {
    super( sceneModel );

    const createDataValuesRect = () => new Rectangle( 0, 0, 0, 0, {
      visibleProperty: hasEnoughDataForIQRProperty,
      fill: CAVColors.iqrColorProperty,
      cornerRadius: 3
    } );

    this.dataValuesQ1Rect = createDataValuesRect();
    this.dataValuesQ3Rect = createDataValuesRect();

    this.addChild( this.dataValuesQ1Rect );
    this.addChild( this.dataValuesQ3Rect );

    this.dataValuesQ1Rect.moveToBack();
    this.dataValuesQ3Rect.moveToBack();
  }

  public override updateDecorations(): void {

    //update the arrow node position
    super.updateDecorations();

    // check if these exist first to prevent calling when the ManualConstraint in the superclass constructor is set
    if ( this.dataValuesQ1Rect && this.q1TextNodes ) {
      IQRInfoValuesNode.updateQuartileRect( this.dataValuesQ1Rect, this.q1TextNodes );
    }
    if ( this.dataValuesQ3Rect && this.q3TextNodes ) {
      IQRInfoValuesNode.updateQuartileRect( this.dataValuesQ3Rect, this.q3TextNodes );
    }
  }

  public override decorate( results: Array<{ text: Text; soccerBall: VariabilitySoccerBall }> ): void {
    this.q1TextNodes = results.filter( result => result.soccerBall.isQ1ObjectProperty.value ).map( result => result.text );
    this.q3TextNodes = results.filter( result => result.soccerBall.isQ3ObjectProperty.value ).map( result => result.text );

    IQRInfoValuesNode.updateQuartileRect( this.dataValuesQ1Rect, this.q1TextNodes );
    IQRInfoValuesNode.updateQuartileRect( this.dataValuesQ3Rect, this.q3TextNodes );
  }

  private static updateQuartileRect( quartileRect: Rectangle, dataValueTextNodes: Node[] ): void {
    let newBounds = new Bounds2( 0, 0, 0, 0 );
    if ( dataValueTextNodes.length > 0 ) {
      newBounds = quartileRect.globalToLocalBounds( dataValueTextNodes[ 0 ].globalBounds );
    }
    for ( let i = 1; i < dataValueTextNodes.length; i++ ) {
      newBounds = newBounds.includeBounds( quartileRect.globalToLocalBounds( dataValueTextNodes[ i ].globalBounds ) );
    }
    quartileRect.setRectBounds( newBounds.dilateX( 3 ).dilateY( 2 ) );
  }
}
centerAndVariability.register( 'IQRInfoValuesNode', IQRInfoValuesNode );