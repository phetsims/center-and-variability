// Copyright 2023-2025, University of Colorado Boulder

/**
 * MeanAndMedianInfoNode is a UI component that displays detailed information regarding mean and median calculations.
 * It shows both the calculations and the results using visual elements, and responds dynamically to changes in the
 * scene model by updating its content accordingly.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import FractionNode from '../../common/view/FractionNode.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import InfoValuesNode from '../../common/view/InfoValuesNode.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import MeanAndMedianInfoPlotNode from './MeanAndMedianInfoPlotNode.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class MeanAndMedianInfoNode extends VBox {
  public constructor( model: MeanAndMedianModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLineNode: NumberLineNode, tandem: Tandem ) {

    const hasEnoughDataProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );
    const medianInfoValuesNode = new InfoValuesNode( sceneModel );

    const numeratorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );
    const denominatorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );

    const resultNumeratorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );
    const resultDenominatorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );

    sceneModel.objectChangedEmitter.addListener( () => {

      if ( sceneModel.getSortedStackedObjects().length > 0 ) {
        const values = sceneModel.getDataValues();
        const denominator = values.length;

        numeratorText.string = values.join( ' + ' );
        denominatorText.string = denominator.toString();

        resultNumeratorText.string = _.sum( sceneModel.getDataValues() );
        resultDenominatorText.string = denominator.toString();
      }
    } );

    // Create string Properties for text readouts
    const medianUnitsStringProperty = new DerivedProperty( [
      sceneModel.medianValueProperty,
      CenterAndVariabilityStrings.meterStringProperty,
      CenterAndVariabilityStrings.metersStringProperty
    ], medianValue => medianValue === 1 ? CenterAndVariabilityStrings.meterStringProperty.value : CenterAndVariabilityStrings.metersStringProperty.value );
    const medianEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValueUnitsPatternStringProperty, {
      value: sceneModel.medianValueProperty,

      // Show "1 meter" but "1.5 meters"
      units: medianUnitsStringProperty
    }, {
      maps: {
        value: CAVConstants.STRING_VALUE_NULL_MAP
      },
      tandem: tandem.createTandem( 'medianEqualsValueStringProperty' )
    } );

    const meanEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.meanEqualsValueMetersPatternStringProperty, {
      value: sceneModel.meanValueProperty
    }, {
      maps: {
        value: value => value === null ? 'null' : toFixed( value, 1 )
      },
      tandem: tandem.createTandem( 'meanEqualsValueStringProperty' )
    } );

    // Create derived Properties for pdom.
    const valuesDependencies = sceneModel.soccerBalls.map( soccerBall => soccerBall.valueProperty );
    const valuesInAdditionFormatProperty = DerivedProperty.deriveAny( [ ...valuesDependencies ], () => {
      const numberOfDataPoints = sceneModel.getSortedStackedObjects().length;
      const values = numberOfDataPoints > 0 ? sceneModel.getDataValues() : [];
      return values.length > 0 ? values.join( ' + ' ) : '';
    } );
    const valuesSumProperty = DerivedProperty.deriveAny( [ ...valuesDependencies ], () => {
      const numberOfDataPoints = sceneModel.getSortedStackedObjects().length;
      const values = numberOfDataPoints > 0 ? sceneModel.getDataValues() : [];
      return values.length > 0 ? _.sum( values ) : 0;
    } );

    super( {
      align: 'left',
      spacing: 5,
      children: [
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.medianDescriptionStringProperty ),
        medianInfoValuesNode,
        new Text( medianEqualsValueStringProperty, {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 },
          accessibleParagraph: medianEqualsValueStringProperty
        } ),
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.meanDescriptionStringProperty ),
        new HBox( {
          spacing: 10,
          children: [
            new Text( CenterAndVariabilityStrings.meanEqualsStringProperty, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
            new FractionNode( numeratorText, denominatorText ),
            new Text( MathSymbols.EQUAL_TO, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
            new FractionNode( resultNumeratorText, resultDenominatorText )
          ],
          visibleProperty: hasEnoughDataProperty,
          accessibleParagraph: CenterAndVariabilityFluent.a11y.meanAndMedianScreen.infoDialog.meanEquationDescription.createProperty( {
            values: valuesInAdditionFormatProperty,
            total: sceneModel.numberOfDataPointsProperty,
            sum: valuesSumProperty
          } )
        } ),
        new Text( meanEqualsValueStringProperty, {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 },
          accessibleParagraph: meanEqualsValueStringProperty
        } ),
        new MeanAndMedianInfoPlotNode( model, sceneModel, playAreaNumberLineNode, {
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN }
        } )
      ],

      isDisposable: false
    } );

    sceneModel.objectChangedEmitter.addListener( () => medianInfoValuesNode.update() );
    sceneModel.numberOfDataPointsProperty.lazyLink( () => medianInfoValuesNode.update() );
    model.infoButtonPressedEmitter.addListener( () => medianInfoValuesNode.update() );

    medianInfoValuesNode.update();
  }
}

centerAndVariability.register( 'MeanAndMedianInfoNode', MeanAndMedianInfoNode );