// Copyright 2022-2023, University of Colorado Boulder

/**
 * ScreenView for the "Mean and Median" Screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';

type MeanAndMedianScreenViewOptions = StrictOmit<CAVScreenViewOptions, 'isMedianScreen' | 'questionBarOptions'>;

export default class MeanAndMedianScreenView extends CAVScreenView {

  public constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions, EmptySelfOptions, CAVScreenViewOptions>()( {
      isMedianScreen: false,
      questionBarOptions: {
        barFill: CAVColors.meanAndMedianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.meanAndMedianQuestionStringProperty
      }
    }, providedOptions );

    super( model, options );

    // NOTE: This assumes that the NumberLineNode in the play area and in the dot plot have the same characteristics:
    // * Same font
    // * Same offset and scale
    // But given those assumptions, this code moves the dot plot so that its number line matches the play area one.
    // TODO: Consider something more robust.  Using globalToLocal to exactly align based on the position of the tick marks
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, this.accordionBoxContents ],
      ( lowerNumberLineWrapper, contentsWrapper ) => {
        contentsWrapper.x = lowerNumberLineWrapper.x;
      } );
  }
}

centerAndVariability.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );