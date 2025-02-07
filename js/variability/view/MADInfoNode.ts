// Copyright 2023-2024, University of Colorado Boulder

/**
 * `MADInfoNode` displays the MAD (Mean Absolute Deviation) definition, its calculation, and visual representation
 * using a plot node. This node helps users understand how MAD is determined from given data points.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../../common/CAVConstants.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import FractionNode from '../../common/view/FractionNode.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import MADNode from './MADNode.js';

export default class MADInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, tandem: Tandem ) {

    const hasEnoughDataProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );

    // Limit the width of the sum in the numerator since it can get very wide
    const numeratorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: 700 } );
    const denominatorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } );

    const resultNumeratorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } );
    const resultDenominatorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } );

    sceneModel.variabilityDataMeasuresUpdatedEmitter.addListener( () => {
      const deviations = sceneModel.getDeviationTenths();
      const denominator = sceneModel.getSortedStackedObjects().length;

      numeratorText.string = deviations.map( deviation => Utils.toFixed( deviation, 1 ) ).join( ' + ' );
      denominatorText.string = denominator.toString();

      resultNumeratorText.string = Utils.toFixed( sceneModel.getSumOfDeviationTenths(), 1 );
      resultDenominatorText.string = denominator.toString();
    } );

    super( {
      align: 'left',
      spacing: 6,
      children: [
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.madDescriptionStringProperty ),

        new HBox( {
          spacing: 6,
          align: 'top',
          children: [
            new HBox( {
              spacing: 10,
              children: [
                new Text( CenterAndVariabilityStrings.madEqualsStringProperty, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
                new FractionNode( numeratorText, denominatorText ),
                new Text( MathSymbols.EQUAL_TO, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
                new FractionNode( resultNumeratorText, resultDenominatorText )
              ],
              visibleProperty: hasEnoughDataProperty
            } )
          ],
          layoutOptions: { topMargin: 5 }
        } ),

        new Text( new PatternStringProperty( CenterAndVariabilityStrings.madEqualsMADMetersPatternStringProperty, {

          // See CAVConstants.STRING_VALUE_NULL_MAP
          mad: new DerivedProperty( [ sceneModel.madValueProperty ], madValue => madValue === null ? 'null' : Utils.toFixed( madValue, 1 ) )
        }, {
          tandem: tandem.createTandem( 'madCalculationStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),

        new MADNode( model, sceneModel, playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, {
          representationContext: 'info',
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN },
          tandem: tandem.createTandem( 'madNode' )
        } )
      ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'MADInfoNode', MADInfoNode );