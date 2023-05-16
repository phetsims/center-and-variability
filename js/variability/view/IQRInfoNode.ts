// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Node, Text, VBox, HBox, Rectangle } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import IQRNode from './IQRNode.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CAVColors from '../../common/CAVColors.js';

export default class IQRInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, options: PickRequired<PhetioObject, 'tandem'> ) {

    const hasAtLeastOneDataPointProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );
    const hasEnoughDataForIQRProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 5 );

    const dataValuesLabel = new Text( CenterAndVariabilityStrings.iqrDataValuesStringProperty, {
      visibleProperty: hasAtLeastOneDataPointProperty,
      fontSize: 18,
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

    const dataValuesQ1Rect = new Rectangle( 0, 0, 0, 0, {
      visibleProperty: hasEnoughDataForIQRProperty,
      fill: CAVColors.iqrColorProperty,
      cornerRadius: 3
    } );
    const dataValuesQ3Rect = new Rectangle( 0, 0, 0, 0, {
      visibleProperty: hasEnoughDataForIQRProperty,
      fill: CAVColors.iqrColorProperty,
      cornerRadius: 3
    } );

    const dataValuesDisplay = new Node( {
      children: [
        dataValuesMedianArrow,
        dataValuesQ1Rect,
        dataValuesQ3Rect,
        new HBox( {
          visibleProperty: hasAtLeastOneDataPointProperty,
          children: [ dataValuesLabel, dataValuesContainer ]
        } )
      ]
    } );

    super( {
      align: 'left',
      children: [
        new Text( CenterAndVariabilityStrings.interquartileRangeIQRStringProperty, {
          fontSize: 25,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: 5 }
        } ),

        new Text( CenterAndVariabilityStrings.iqrDescriptionStringProperty, {
          fontSize: 18,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: 6 }
        } ),

        dataValuesDisplay,

        new Text( new PatternStringProperty( CenterAndVariabilityStrings.iqrCalculationPattern1StringProperty, {
          q1: sceneModel.q1ValueProperty,
          q3: sceneModel.q3ValueProperty
        } ), {
          fontSize: 18,
          visibleProperty: hasEnoughDataForIQRProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 10 }
        } ),

        new Text( new PatternStringProperty( CenterAndVariabilityStrings.iqrCalculationPattern2StringProperty, {
          iqr: sceneModel.iqrValueProperty
        } ), { fontSize: 18, visibleProperty: hasEnoughDataForIQRProperty, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } ),

        new IQRNode( model, sceneModel, {
          parentContext: 'info',
          tandem: options.tandem.createTandem( 'iqrNode' )
        } )
      ]
    } );

    const updateQuartileRect = ( quartileRect: Rectangle, dataValueTextNodes: Node[] ) => {
      let newBounds = new Bounds2( 0, 0, 0, 0 );
      if ( dataValueTextNodes.length > 0 ) {
        newBounds = quartileRect.globalToLocalBounds( dataValueTextNodes[ 0 ].globalBounds );
      }
      for ( let i = 1; i < dataValueTextNodes.length; i++ ) {
        newBounds = newBounds.includeBounds( quartileRect.globalToLocalBounds( dataValueTextNodes[ i ].globalBounds ) );
      }
      quartileRect.setRectBounds( newBounds.dilateX( 3 ).dilateY( 2 ) );
    };

    const updateDataValuesDisplay = () => {
      const sortedObjects = sceneModel.getSortedLandedObjects();
      const sortedData = sortedObjects.map( object => object.valueProperty.value );

      const dataValuesChildren: Node[] = [];

      const medianTextNodes: Node[] = [];
      const q1TextNodes: Node[] = [];
      const q3TextNodes: Node[] = [];

      for ( let i = 0; i < sortedObjects.length; i++ ) {
        const valueTextGroupNode = new HBox( { spacing: 0 } );
        const valueTextGroupNodeChildren: Node[] = [];

        const valueTextNode = new Text( sortedData[ i ]!, { fontSize: 18 } );
        valueTextGroupNodeChildren.push( valueTextNode );

        if ( i < sortedObjects.length - 1 ) {
          valueTextGroupNodeChildren.push( new Text( ',', { fontSize: 18 } ) );
        }

        valueTextGroupNode.setChildren( valueTextGroupNodeChildren );
        dataValuesChildren.push( valueTextGroupNode );

        if ( sortedObjects[ i ].isMedianObjectProperty.value ) {
          medianTextNodes.push( valueTextNode );
        }

        if ( sortedObjects[ i ].isQ1ObjectProperty.value ) {
          q1TextNodes.push( valueTextNode );
        }

        if ( sortedObjects[ i ].isQ3ObjectProperty.value ) {
          q3TextNodes.push( valueTextNode );
        }
      }

      dataValuesContainer.setChildren( dataValuesChildren );

      if ( medianTextNodes.length > 0 ) {
        const arrowPosition = dataValuesMedianArrow.globalToLocalPoint( new Vector2( _.mean( medianTextNodes.map( textNode =>
          textNode.globalBounds.x + 0.5 * textNode.globalBounds.width ) ), medianTextNodes[ 0 ].globalBounds.y ) );
        dataValuesMedianArrow.setTail( arrowPosition.x, dataValuesMedianArrow.tailY );
        dataValuesMedianArrow.setTip( arrowPosition.x, dataValuesMedianArrow.tipY );
      }

      updateQuartileRect( dataValuesQ1Rect, q1TextNodes );
      updateQuartileRect( dataValuesQ3Rect, q3TextNodes );
    };

    sceneModel.objectChangedEmitter.addListener( updateDataValuesDisplay );
    sceneModel.numberOfDataPointsProperty.link( updateDataValuesDisplay );
  }
}

centerAndVariability.register( 'IQRInfoNode', IQRInfoNode );
