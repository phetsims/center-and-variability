// Copyright 2025, University of Colorado Boulder
/**
 * Implements the screen summary for the Median screen in the Center and Variability simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import CAVScreenSummaryContent from '../../common/view/CAVScreenSummaryContent.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';

export default class MeanAndMedianScreenSummaryContent extends CAVScreenSummaryContent {

  public constructor( model: MeanAndMedianModel ) {
    const sceneModel = model.sceneModels[ 0 ];
    const playAreaPatternStringProperty = CenterAndVariabilityFluent.a11y.meanAndMedianScreen.screenSummary.playArea.createProperty( {
      maxBalls: MAX_KICKS_PROPERTY
    } );
    const guidingQuestionStringProperty = CenterAndVariabilityFluent.a11y.screenSummary.playArea.guidingQuestion.createProperty( {
      question: CenterAndVariabilityFluent.meanAndMedianQuestionStringProperty
    } );
    const currentDetailsStringProperty = CenterAndVariabilityFluent.a11y.meanAndMedianScreen.screenSummary.currentDetails.soccerBalls
      .createProperty( {
        number: model.selectedSceneStackedSoccerBallCountProperty
      } );

    const ballValueProperties: Property<number | null>[] = model.selectedSceneModelProperty.value.soccerBalls
      .map( ball => ball.valueProperty );
    const meterStackHeightProperties = CAVScreenSummaryContent.METERS.map( meter =>
      DerivedProperty.deriveAny( ballValueProperties, () => {
        return sceneModel.getStackAtValue( meter ).length;
      } )
    );
    const currentPlotDetailsPatternStringProperty = CenterAndVariabilityFluent.a11y.meanAndMedianScreen.screenSummary.currentDetails.plot.createProperty( {
      number: model.selectedSceneStackedSoccerBallCountProperty
    } );
    const remainingDetailsNode = new Node( {
      tagName: 'p',
      accessibleName: currentPlotDetailsPatternStringProperty
    } );

    const listNode = CAVScreenSummaryContent.createListItems( meterStackHeightProperties );

    super( [ listNode ], currentDetailsStringProperty, remainingDetailsNode, {
      playAreaContent: [ playAreaPatternStringProperty, guidingQuestionStringProperty ],
      interactionHintContent: CAVScreenSummaryContent.createInteractionHintContent( CenterAndVariabilityFluent.a11y.meanAndMedianScreen.screenSummary.interactionHint.someBallsStringProperty, model.selectedSceneStackedSoccerBallCountProperty ),
      controlAreaContent: CenterAndVariabilityFluent.a11y.meanAndMedianScreen.screenSummary.controlAreaStringProperty
    } );
  }
}

centerAndVariability.register( 'MeanAndMedianScreenSummaryContent', MeanAndMedianScreenSummaryContent );