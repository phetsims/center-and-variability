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
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import { Text } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CardNodeContainer from '../../common/view/CardNodeContainer.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions =
  SelfOptions
  & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class MedianScreenView extends CAVScreenView {

  public constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.medianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.medianQuestionStringProperty
      },
      bottomCheckboxGroupOptions: {
        includeMean: false,
        includePredictMean: false
      }
    }, providedOptions );

    super( model, ( tandem: Tandem, top: number, layoutBounds: Bounds2 ) => {
      return new CAVAccordionBox( model, new CardNodeContainer( model, {

          // Expose this intermediate layer to make it so that clients can hide the number cards with one call
          tandem: tandem.createTandem( 'cardNodeContainer' )
        } ), new TopRepresentationCheckboxGroup( model, {
          includeSortData: true,
          includeMean: false,
          medianBarIconOptions: {
            notchDirection: 'up',
            barStyle: 'continuous'
          },
          showMedianCheckboxIcon: false,
          tandem: tandem.createTandem( 'checkboxGroup' )
        } ),
        new Text( CenterAndVariabilityStrings.distanceInMetersStringProperty, {
          font: new PhetFont( 16 ),
          maxWidth: 300
        } ),
        layoutBounds, {
          leftMargin: 0,
          tandem: tandem,
          contentNodeOffsetY: -6,
          top: top,
          valueReadoutsNode: null,
          centerX: layoutBounds.centerX
        } );
    }, options );
  }
}

centerAndVariability.register( 'MedianScreenView', MedianScreenView );