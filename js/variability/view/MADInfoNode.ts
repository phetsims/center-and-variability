// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { HBox, HSeparator, Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVConstants from '../../common/CAVConstants.js';
import MADNode from './MADNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';

export default class MADInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

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

    const calculationFraction = new VBox( {
      children: [ numeratorText, new HSeparator(), denominatorText ],
      align: 'center'
    } );

    const resultFraction = new VBox( {
      children: [ resultNumeratorText, new HSeparator(), resultDenominatorText ],
      align: 'center'
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
                calculationFraction,
                new Text( MathSymbols.EQUAL_TO, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
                resultFraction
              ],
              visibleProperty: hasEnoughDataProperty
            } )
          ],
          layoutOptions: { topMargin: 5 }
        } ),

        new Text( new PatternStringProperty( CenterAndVariabilityStrings.madCalculationResultPatternStringProperty, {

          // See CAVConstants.STRING_VALUE_NULL_MAP
          mad: new DerivedProperty( [ sceneModel.madValueProperty ], madValue => madValue === null ? 'null' : Utils.toFixed( madValue, 1 ) )
        }, {
          tandem: options.tandem.createTandem( 'madCalculationStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),

        new MADNode( model, sceneModel, playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, {
          parentContext: 'info',
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN },
          tandem: options.tandem.createTandem( 'madNode' )
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'MADInfoNode', MADInfoNode );