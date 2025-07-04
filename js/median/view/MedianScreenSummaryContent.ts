// Copyright 2025, University of Colorado Boulder
/**
 * Implements the screen summary for the Median screen in the Center and Variability simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import CAVScreenSummaryContent from '../../common/view/CAVScreenSummaryContent.js';
import MedianModel from '../model/MedianModel.js';

export default class MedianScreenSummaryContent extends CAVScreenSummaryContent {

  public constructor( model: MedianModel ) {
    const sceneModel = model.sceneModels[ 0 ];
    const playAreaPatternStringProperty = CenterAndVariabilityFluent.a11y.medianScreen.screenSummary.playArea.createProperty( {
      maxBalls: MAX_KICKS_PROPERTY
    } );
    const guidingQuestionStringProperty = CenterAndVariabilityFluent.a11y.screenSummary.playArea.guidingQuestion.createProperty( {
      question: CenterAndVariabilityFluent.medianQuestionStringProperty
    } );
    const currentDetailsStringProperty = CenterAndVariabilityFluent.a11y.medianScreen.screenSummary.currentDetails.soccerBalls
      .createProperty( {
      number: model.selectedSceneStackedSoccerBallCountProperty
    } );

    /**
     * Create the details strings for the current details content.
     */
    const ballValueProperties: Property<number | null>[] = model.selectedSceneModelProperty.value.soccerBalls
      .map( ball => ball.valueProperty );
    const cardIndexProperties: Property<number | null>[] = model.interactiveCardContainerModel.cards.map( card => card.indexProperty );

    const meterStackHeightProperties = CAVScreenSummaryContent.METERS.map( meter =>
      DerivedProperty.deriveAny( ballValueProperties, () => {
        return sceneModel.getStackAtValue( meter ).length;
      } )
    );
    const distancesStringProperty = DerivedProperty.deriveAny( [ ...ballValueProperties, ...cardIndexProperties ],
      () => {
        const distances = model.interactiveCardContainerModel.getCardsInCellOrder().map( card => card.soccerBall.valueProperty.value );
        return distances.length > 0 ? distances.join( ', ' ) : '';
      } );
    const currentCardDetailsPatternStringProperty = CenterAndVariabilityFluent.a11y.medianScreen.screenSummary.currentDetails.cards.createProperty( {
      number: model.selectedSceneStackedSoccerBallCountProperty,
      distances: distancesStringProperty
    } );

    const remainingDetailsNode = new Node( {
      tagName: 'p',
      accessibleName: currentCardDetailsPatternStringProperty
    } );
    const listNode = CAVScreenSummaryContent.createListItems( meterStackHeightProperties );

    super(
      [ listNode ],
      currentDetailsStringProperty,
      remainingDetailsNode,
      {
        playAreaContent: [ playAreaPatternStringProperty, guidingQuestionStringProperty ],
        interactionHintContent: CAVScreenSummaryContent.createInteractionHintContent(
          CenterAndVariabilityFluent.a11y.medianScreen.screenSummary.interactionHint.someBallsStringProperty,
          model.selectedSceneStackedSoccerBallCountProperty ),
        controlAreaContent: CenterAndVariabilityFluent.a11y.medianScreen.screenSummary.controlAreaStringProperty
      } );
  }
}

centerAndVariability.register( 'MedianScreenSummaryContent', MedianScreenSummaryContent );