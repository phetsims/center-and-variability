// Copyright 2025, University of Colorado Boulder
/**
 * Implements the screen summary for the Variability screen in the Center and Variability simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import CAVScreenSummaryContent from '../../common/view/CAVScreenSummaryContent.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import FluentConstant from '../../../../chipper/js/browser/FluentConstant.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

export default class VariabilityScreenSummaryContent extends CAVScreenSummaryContent {

  public constructor( model: VariabilityModel ) {
    const playAreaPatternStringProperty = CenterAndVariabilityFluent.a11y.variabilityScreen.screenSummary.playArea.createProperty( {
      maxBalls: MAX_KICKS_PROPERTY
    } );
    const guidingQuestionStringProperty = CenterAndVariabilityFluent.a11y.screenSummary.playArea.guidingQuestion.createProperty( {
      question: CenterAndVariabilityFluent.variabilityQuestionStringProperty
    } );
    const selectedSceneAccessibleNameProperty = new DynamicProperty<string, string, VariabilitySceneModel>(
      model.selectedSceneModelProperty, {
        derive: 'accessibleName'
      } );
    const currentDetailsStringProperty = CenterAndVariabilityFluent.a11y.variabilityScreen.screenSummary.currentDetails.soccerBalls
      .createProperty( {
        kicker: selectedSceneAccessibleNameProperty,
        number: model.selectedSceneStackedSoccerBallCountProperty
      } );

    // Create the list items for the current details content.
    const sceneModelMeterStackHeightProperties = model.sceneModels.map( sceneModel => {
      const ballValueProperties: Property<number | null>[] = sceneModel.soccerBalls.map( ball => ball.valueProperty );
      return CAVScreenSummaryContent.METERS.map( meter =>
        DerivedProperty.deriveAny( ballValueProperties, () => {
          return sceneModel.getStackAtValue( meter ).length;
        }, { disableListenerLimit: true } )
      );
    } );
    const listNodes = model.sceneModels.map( ( sceneModel, i ) =>
      CAVScreenSummaryContent.createListItems( sceneModelMeterStackHeightProperties[ i ],
        DerivedProperty.valueEqualsConstant( model.selectedSceneModelProperty, sceneModel ) )
    );

    // create the remaining details node
    const measureStringProperty = new DynamicProperty<string, string, FluentConstant>(
      new DerivedProperty( [ model.selectedVariabilityMeasureProperty ],
        measure => measure === VariabilityMeasure.RANGE ? CenterAndVariabilityFluent.rangeStringProperty :
                   measure === VariabilityMeasure.IQR ? CenterAndVariabilityFluent.interquartileRangeIQRStringProperty :
                   CenterAndVariabilityFluent.meanAbsoluteDeviationMADStringProperty ) );
    const selectedSceneNumberOfDataPointsProperty = new DynamicProperty<number, number, CAVSoccerSceneModel>( model.selectedSceneModelProperty, {
      derive: 'numberOfDataPointsProperty'
    } );
    const remainingDetailsNode = new Node( {
      tagName: 'p',
      accessibleName: CenterAndVariabilityFluent.a11y.variabilityScreen.screenSummary.currentDetails.plot.createProperty( {
        measure: measureStringProperty,
        number: selectedSceneNumberOfDataPointsProperty
      } )
    } );
    super( listNodes, currentDetailsStringProperty, remainingDetailsNode, {
      playAreaContent: [ playAreaPatternStringProperty, guidingQuestionStringProperty ],
      interactionHintContent: CAVScreenSummaryContent.createInteractionHintContent(
        CenterAndVariabilityFluent.a11y.variabilityScreen.screenSummary.interactionHint.someBallsStringProperty,
        model.selectedSceneStackedSoccerBallCountProperty ),
      controlAreaContent: CenterAndVariabilityFluent.a11y.variabilityScreen.screenSummary.controlAreaStringProperty
    } );
  }
}

centerAndVariability.register( 'VariabilityScreenSummaryContent', VariabilityScreenSummaryContent );