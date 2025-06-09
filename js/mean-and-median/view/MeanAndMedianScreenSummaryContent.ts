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
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PlotType from '../../common/model/PlotType.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class MeanAndMedianScreenSummaryContent extends CAVScreenSummaryContent {

  public constructor( model: MeanAndMedianModel ) {
    const sceneModel = model.sceneModels[ 0 ];
    const playAreaPatternStringProperty = CenterAndVariabilityFluent.a11y.meanAndMedian.playArea.createProperty( {
      maxBalls: MAX_KICKS_PROPERTY
    } );
    const guidingQuestionStringProperty = CenterAndVariabilityFluent.a11y.common.guidingQuestion.createProperty( {
      question: CenterAndVariabilityFluent.meanAndMedianQuestionStringProperty
    } );
    const currentDetailsStringProperty = CenterAndVariabilityFluent.a11y.meanAndMedian.currentDetails.soccerBalls
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
    const plotTypeProperty = new DynamicProperty<string, string, TReadOnlyProperty<string>>( new DerivedProperty( [ CAVConstants.PLOT_TYPE_PROPERTY ], plotType =>
    plotType === PlotType.LINE_PLOT ? CenterAndVariabilityFluent.a11y.meanAndMedian.currentDetails.plotType.xStringProperty :
    CenterAndVariabilityFluent.a11y.meanAndMedian.currentDetails.plotType.dotStringProperty ) );
    const currentPlotDetailsPatternStringProperty = CenterAndVariabilityFluent.a11y.meanAndMedian.currentDetails.plot.createProperty( {
      number: model.selectedSceneStackedSoccerBallCountProperty,
      plotType: plotTypeProperty
    } );
    const remainingDetailsNode = new Node( {
      tagName: 'p',
      accessibleName: currentPlotDetailsPatternStringProperty
    } );

    const listNode = new Node( {
      tagName: 'ul',
      children: CAVScreenSummaryContent.createListItems( meterStackHeightProperties )
    } );
   super( [ listNode ], currentDetailsStringProperty, remainingDetailsNode, {
     playAreaContent: [ playAreaPatternStringProperty, guidingQuestionStringProperty ],
      interactionHintContent: CAVScreenSummaryContent.createInteractionHintContent( CenterAndVariabilityFluent.a11y.meanAndMedian.interactionHintSomeBallsStringProperty, model.selectedSceneStackedSoccerBallCountProperty )
   } );
  }
}

centerAndVariability.register( 'MeanAndMedianScreenSummaryContent', MeanAndMedianScreenSummaryContent );