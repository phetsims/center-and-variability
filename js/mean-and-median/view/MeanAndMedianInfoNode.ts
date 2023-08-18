// Copyright 2023, University of Colorado Boulder

/**
 * Info Node for the Mean and Median screen. Shows mean and median calculation as well as results.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../../common/CAVConstants.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import InfoValuesNode from '../../common/view/InfoValuesNode.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import MeanAndMedianInfoPlotNode from './MeanAndMedianInfoPlotNode.js';
import Utils from '../../../../dot/js/Utils.js';
import FractionNode from '../../common/view/FractionNode.js';

export default class MeanAndMedianInfoNode extends VBox {
  public constructor( model: MeanAndMedianModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

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

    super( {
      align: 'left',
      spacing: 5,
      children: [
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.medianDescriptionStringProperty ),
        medianInfoValuesNode,
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValueUnitsPatternStringProperty, {
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
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.meanDescriptionStringProperty ),
        new HBox( {
          spacing: 10,
          children: [
            new Text( CenterAndVariabilityStrings.meanEqualsStringProperty, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
            new FractionNode( numeratorText, denominatorText ),
            new Text( MathSymbols.EQUAL_TO, { fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE } ),
            new FractionNode( resultNumeratorText, resultDenominatorText )
          ],
          visibleProperty: hasEnoughDataProperty
        } ),
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.meanEqualsValueMetersPatternStringProperty, {
          value: sceneModel.meanValueProperty
        }, {
          maps: {
            value: value => value === null ? 'null' : Utils.toFixed( value, 1 )
          },
          tandem: options.tandem.createTandem( 'meanEqualsValueStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),

        //test change 2

        new MeanAndMedianInfoPlotNode( model, sceneModel, playAreaNumberLineNode, {
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN }
        } )
      ]
    } );

    sceneModel.objectChangedEmitter.addListener( () => medianInfoValuesNode.update() );
    sceneModel.numberOfDataPointsProperty.lazyLink( () => medianInfoValuesNode.update() );
    model.infoButtonPressedEmitter.addListener( () => medianInfoValuesNode.update() );

    medianInfoValuesNode.update();
  }
}

centerAndVariability.register( 'MeanAndMedianInfoNode', MeanAndMedianInfoNode );