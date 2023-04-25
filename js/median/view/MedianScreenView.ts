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
import TopRepresentationCheckboxGroup from '../../common/view/TopRepresentationCheckboxGroup.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions =
  SelfOptions
  & StrictOmit<SoccerScreenViewOptions, 'createAccordionBoxControlNode' | 'isMedianScreen' | 'isVariabilityScreen' | 'questionBarOptions' | 'accordionBoxTitleStringProperty'>;

export default class MedianScreenView extends SoccerScreenView {

  public constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions, SelfOptions, SoccerScreenViewOptions>()( {
      isMedianScreen: true,
      isVariabilityScreen: false,
      questionBarOptions: {
        barFill: CAVColors.medianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.medianQuestionStringProperty
      },
      createAccordionBoxControlNode: tandem => new TopRepresentationCheckboxGroup( model, {
        includeSortData: true,
        includeMean: false,
        medianBarIconOptions: {
          notchDirection: 'up',
          barStyle: 'continuous'
        },
        showMedianCheckboxIcon: false,
        tandem: tandem.createTandem( 'checkboxGroup' )
      } ),
      bottomCheckboxGroupOptions: {
        includeMean: false,
        includePredictMean: false
      },
      accordionBoxTitleStringProperty: CenterAndVariabilityStrings.distanceInMetersStringProperty
    }, providedOptions );

    super( model, options );
  }
}

centerAndVariability.register( 'MedianScreenView', MedianScreenView );