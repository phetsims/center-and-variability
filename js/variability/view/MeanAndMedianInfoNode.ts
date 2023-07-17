// Copyright 2023, University of Colorado Boulder
/**
 * Info Node for the Mean and Median screen. Shows mean and median calculation as well as results.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { HBox, HSeparator, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CAVConstants from '../../common/CAVConstants.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import InfoValuesNode from '../../common/view/InfoValuesNode.js';
import MeanAndMedianModel from '../../mean-and-median/model/MeanAndMedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import MeanAndMedianInfoPlotNode from '../../mean-and-median/view/MeanAndMedianInfoPlotNode.js';

export default class MeanAndMedianInfoNode extends VBox {
  public constructor( model: MeanAndMedianModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const hasEnoughDataProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );
    const medianInfoValuesNode = new InfoValuesNode( sceneModel );

    const numeratorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );
    const denominatorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );

    const resultNumeratorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );
    const resultDenominatorText = new Text( '', { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );

    sceneModel.objectChangedEmitter.addListener( () => {
      if ( hasEnoughDataProperty.value ) {
        const values = sceneModel.getDataValues();
        const denominator = values.length;

        numeratorText.string = values.join( ' + ' );
        denominatorText.string = denominator.toString();

        resultNumeratorText.string = _.sum( sceneModel.getDataValues() );
        resultDenominatorText.string = denominator.toString();
      }
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
      spacing: 5,
      children: [
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.medianDescriptionStringProperty ),
        medianInfoValuesNode,
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValueMetersPatternStringProperty, {
          value: sceneModel.medianValueProperty,

          // Show "1 meter" but "1.5 meters"
          units: new DerivedProperty( [
            sceneModel.medianValueProperty,
            CenterAndVariabilityStrings.meterStringProperty,
            CenterAndVariabilityStrings.metersStringProperty
          ], medianValue => medianValue === 1 ? CenterAndVariabilityStrings.meterStringProperty.value : CenterAndVariabilityStrings.metersStringProperty.value )
        }, {
          maps: {
            value: CAVConstants.STRING_VALUE_NULL_MAP
          },
          tandem: options.tandem.createTandem( 'medianEqualsValueStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),
        new RichText( CenterAndVariabilityStrings.meanDescriptionStringProperty, {
          font: new PhetFont( CAVConstants.INFO_DIALOG_TITLE_FONT_SIZE ),
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN, topMargin: 20 }
        } ),
        new HBox( {
          spacing: 10,
          children: [
            new Text( CenterAndVariabilityStrings.meanEqualsStringProperty, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
            calculationFraction,
            new Text( MathSymbols.EQUAL_TO, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
            resultFraction
          ],
          visibleProperty: hasEnoughDataProperty
        } ),
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.meanEqualsValueMetersPatternStringProperty, {
          value: sceneModel.meanValueProperty
        }, {
          maps: {
            value: CAVConstants.STRING_VALUE_NULL_MAP
          },
          tandem: options.tandem.createTandem( 'meanEqualsValueStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),


        new MeanAndMedianInfoPlotNode( model, sceneModel, playAreaNumberLineNode, {
          tandem: options.tandem.createTandem( 'meanAndMedianPlotNode' ),
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN }
        } )
      ]
    } );

    const updateDataValuesDisplay = () => {

      // We only need to update the data display if the info box is showing, to improve performance on reset.
      if ( model.isInfoVisibleProperty.value ) {
        medianInfoValuesNode.update();
      }
    };

    sceneModel.objectChangedEmitter.addListener( updateDataValuesDisplay );
    sceneModel.numberOfDataPointsProperty.lazyLink( updateDataValuesDisplay );
    model.isInfoVisibleProperty.lazyLink( updateDataValuesDisplay );

    updateDataValuesDisplay();
  }
}

centerAndVariability.register( 'MeanAndMedianInfoNode', MeanAndMedianInfoNode );