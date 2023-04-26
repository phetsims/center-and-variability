// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen View for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianModel from '../model/MedianModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MedianAccordionBox from './MedianAccordionBox.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions =
  SelfOptions
  & StrictOmit<CAVScreenViewOptions, 'questionBarOptions' | 'bottomCheckboxGroupOptions'>;

export default class MedianScreenView extends CAVScreenView {

  public constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.medianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.medianQuestionStringProperty
      },

      // TODO: Remove this option and just create things correctly in the AccordionBox subclass
      bottomCheckboxGroupOptions: {
        includeMean: false,
        includePredictMean: false,
        includePredictMedian: true,
        includeMedian: true,
        includeVariability: false
      }
    }, providedOptions );

    // TODO: Arg order looks scrambled, should it be unified or optionized?
    super( model,

      // TODO: Can we just add this after super()?  Why does it have to be here?
      ( tandem: Tandem, top: number, layoutBounds: Bounds2 ) =>
        new MedianAccordionBox( model, layoutBounds, tandem, top ), options );
  }
}

centerAndVariability.register( 'MedianScreenView', MedianScreenView );