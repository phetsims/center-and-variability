// Copyright 2024, University of Colorado Boulder
/**
 * Implements the screen summary for center-and-variability.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import centerAndVariability from '../../centerAndVariability.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { MAX_KICKS_PROPERTY } from '../CAVConstants.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MedianModel from '../../median/model/MedianModel.js';
import Property from '../../../../axon/js/Property.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';

export default class CAVScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: MedianModel ) {
    const playAreaPatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.a11y.median.playAreaStringProperty, {
      maxBalls: MAX_KICKS_PROPERTY
    } );

    /**
     * Create the details strings for the current details content.
     */

    const isAreStringProperty = new DynamicProperty( new DerivedProperty( [ model.selectedSceneStackedSoccerBallCountProperty ],
      count => {
        return count === 1 ? CenterAndVariabilityStrings.a11y.median.details.isStringProperty : CenterAndVariabilityStrings.a11y.median.details.areStringProperty;
      } ) );
    const ballStringProperty = new DynamicProperty( new DerivedProperty( [ model.selectedSceneStackedSoccerBallCountProperty ],
      count => {
        return count === 1 ? CenterAndVariabilityStrings.a11y.median.details.ballStringProperty : CenterAndVariabilityStrings.a11y.median.details.ballsStringProperty;
      } ) );

    const ballValueProperties: Property<number | null>[] = model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.valueProperty );
    const distancesStringProperty = DerivedProperty.deriveAny( ballValueProperties,
      () => {
        const distances = ballValueProperties.filter( valueProperty => valueProperty.value !== null )
          .map( valueProperty => valueProperty.value );
        return distances.length > 0 ? distances.join( ', ' ) : '';
      } );
    const dataCardDistancesPatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.a11y.median.details.dataCardDistancesStringProperty, {
      distances: distancesStringProperty
    } );

    // If there are no balls, use an empty string to avoid showing the data card distances.
    const emptyStringProperty = new TinyProperty( '' );
    const dataCardDistancesStringProperty = new DynamicProperty( new DerivedProperty( [ model.selectedSceneStackedSoccerBallCountProperty ],
      count => {
        return count === 0 ? emptyStringProperty : dataCardDistancesPatternStringProperty;
      } ) );
    const currentDetailsPatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.a11y.median.currentDetailsStringProperty, {
      isAre: isAreStringProperty,
      number: model.selectedSceneStackedSoccerBallCountProperty,
      maxBalls: MAX_KICKS_PROPERTY,
      ball: ballStringProperty,
      dataCardDistances: dataCardDistancesStringProperty
    } );


    super( {
      playAreaContent: playAreaPatternStringProperty,
      controlAreaContent: CenterAndVariabilityStrings.a11y.median.controlAreaStringProperty,
      currentDetailsContent: [
        currentDetailsPatternStringProperty
      ],
      interactionHintContent: CenterAndVariabilityStrings.a11y.median.interactionHintStringProperty
    } );
  }
}

centerAndVariability.register( 'CAVScreenSummaryContent', CAVScreenSummaryContent );