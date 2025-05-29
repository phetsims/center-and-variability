// Copyright 2025, University of Colorado Boulder
/**
 * Implements the screen summary for center-and-variability.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { MAX_KICKS_PROPERTY } from '../CAVConstants.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MedianModel from '../../median/model/MedianModel.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class CAVScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: MedianModel ) {
    const playAreaPatternStringProperty = CenterAndVariabilityFluent.a11y.median.playArea.createProperty( {
      maxBalls: MAX_KICKS_PROPERTY
    } );
    const guidingQuestionStringProperty = CenterAndVariabilityFluent.a11y.common.guidingQuestion.createProperty( {
      question: CenterAndVariabilityFluent.medianQuestionStringProperty
    } );

    /**
     * Create the details strings for the current details content.
     */
    const ballValueProperties: Property<number | null>[] = model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.valueProperty );
    const distancesStringProperty = DerivedProperty.deriveAny( ballValueProperties,
      () => {
        const distances = ballValueProperties.filter( valueProperty => valueProperty.value !== null )
          .map( valueProperty => valueProperty.value );
        return distances.length > 0 ? distances.join( ', ' ) : '';
      } );
    const currentDetailsPatternStringProperty = CenterAndVariabilityFluent.a11y.median.currentDetails.createProperty( {
      number: model.selectedSceneStackedSoccerBallCountProperty,
      distances: distancesStringProperty
    } );

    const interactionHintStringProperty = new DynamicProperty<string, string, TReadOnlyProperty<string>>( new DerivedProperty( [ model.selectedSceneStackedSoccerBallCountProperty ],
      count => {
        return count === 0 ? CenterAndVariabilityStrings.a11y.median.interactionHintNoBallsStringProperty : CenterAndVariabilityStrings.a11y.median.interactionHintSomeBallsStringProperty;
      } ) );

    super( {
      playAreaContent: [ playAreaPatternStringProperty, guidingQuestionStringProperty ],
      controlAreaContent: CenterAndVariabilityStrings.a11y.median.controlAreaStringProperty,
      currentDetailsContent: [
        currentDetailsPatternStringProperty
      ],
      interactionHintContent: interactionHintStringProperty
    } );
  }
}

centerAndVariability.register( 'CAVScreenSummaryContent', CAVScreenSummaryContent );