// Copyright 2022, University of Colorado Boulder

/**
 * ScreenView for the "Mean and Median" Screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import MeanOrMedianScreenView, { MeanOrMedianScreenViewOptions } from '../../common/view/MeanOrMedianScreenView.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type MeanAndMedianScreenViewOptions = StrictOmit<MeanOrMedianScreenViewOptions, 'isMedianScreen' | 'questionBarOptions'>;

class MeanAndMedianScreenView extends MeanOrMedianScreenView {

  public constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions, EmptySelfOptions, MeanOrMedianScreenViewOptions>()( {
      isMedianScreen: false,
      questionBarOptions: {
        barFill: CAVColors.meanAndMedianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.meanAndMedianQuestion
      },
      topCheckboxGroupOptions: {
        medianBarIconOptions: {
          notchDirection: 'down',
          barStyle: 'continuous',
          arrowScale: 0.75
        },
        showMedianCheckboxIcon: true
      },
      tandem: Tandem.REQUIRED
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
export default MeanAndMedianScreenView;