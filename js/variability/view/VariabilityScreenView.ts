// Copyright 2022-2023, University of Colorado Boulder

/**
 * VariabilityScreenView is the ScreenView for the 'Variability' screen, which has four different scenes with four different
 * distributions.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MeanOrMedianScreenView, { MeanOrMedianScreenViewOptions } from '../../common/view/MeanOrMedianScreenView.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';

type VariabilityScreenViewOptions = StrictOmit<SoccerScreenViewOptions, 'questionBarOptions'>;

export default class VariabilityScreenView extends MeanOrMedianScreenView {

  public constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const options = optionize<VariabilityScreenViewOptions, EmptySelfOptions, MeanOrMedianScreenViewOptions>()( {
      isMedianScreen: false,
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.variabilityQuestionStringProperty
      },
      topCheckboxGroupOptions: {
        medianBarIconOptions: {
          notchDirection: 'down',
          barStyle: 'continuous',
          arrowScale: 0.75
        },
        showMedianCheckboxIcon: false,
        includeMean: false,
        includeMedian: false
      },
      bottomCheckboxGroupOptions: {
        includeVariability: true,
        includePredictMean: false,
        includePredictMedian: false
      }
    }, providedOptions );

    super( model, options );

    // NOTE: This assumes that the NumberLineNode in the play area and in the dot plot have the same characteristics:
    // * Same font
    // * Same offset and scale
    // But given those assumptions, this code moves the dot plot so that its number line matches the play area one.
    // TODO: Consider something more robust.  Using globalToLocal to exactly align based on the position of the tick marks
    // TODO: Can this be combine in a parent class? See https://github.com/phetsims/center-and-variability/issues/152
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, this.accordionBoxContents ],
      ( lowerNumberLineWrapper, contentsWrapper ) => {
        contentsWrapper.x = lowerNumberLineWrapper.x;
      } );
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );