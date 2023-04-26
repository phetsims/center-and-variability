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
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { AlignBox, ManualConstraint, Node } from '../../../../scenery/js/imports.js';
import DistributionRadioButtonGroup from './DistributionRadioButtonGroup.js';
import VariabilityMeasureRadioButtonGroup from './VariabilityMeasureRadioButtonGroup.js';
import InfoDialog from './InfoDialog.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VariabilityAccordionBox from './VariabilityAccordionBox.js';
import BottomRepresentationCheckboxGroup from '../../common/view/BottomRepresentationCheckboxGroup.js';

type SelfOptions = EmptySelfOptions;
type VariabilityScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class VariabilityScreenView extends CAVScreenView {

  public constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const options = optionize<VariabilityScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.variabilityQuestionStringProperty
      }
    }, providedOptions );

    const variabilityMeasureRadioButtonGroup = new VariabilityMeasureRadioButtonGroup( model.selectedVariabilityProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'variabilityMeasureRadioButtonGroup' )
    } );

    super( model, ( tandem: Tandem, top: number, layoutBounds: Bounds2, playAreaNumberLineNode: Node ) => {
      return new VariabilityAccordionBox( model, layoutBounds, tandem, top );
    }, options );

    // NOTE: This assumes that the NumberLineNode in the play area and in the dot plot have the same characteristics:
    // * Same font
    // * Same offset and scale
    // But given those assumptions, this code moves the dot plot so that its number line matches the play area one.
    // TODO: Consider something more robust.  Using globalToLocal to exactly align based on the position of the tick marks
    // TODO: Can this be combine in a parent class? See https://github.com/phetsims/center-and-variability/issues/152
    // TODO: Maybe if the accordion box was a subclass we could do this?
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, this.accordionBox.contentNode ],
      ( lowerNumberLineWrapper, contentsWrapper ) => {
        contentsWrapper.x = lowerNumberLineWrapper.x;
      } );

    ManualConstraint.create( this, [ variabilityMeasureRadioButtonGroup, this.accordionBox ],
      ( variabilityRadioButtonGroupWrapper, accordionBoxWrapper ) => {
        variabilityRadioButtonGroupWrapper.centerY = accordionBoxWrapper.centerY;
      } );

    const distributionRadioButtonGroup = new DistributionRadioButtonGroup( model.selectedDistributionProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'distributionRadioButtonGroup' )
    } );

    // Float above the ground
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, distributionRadioButtonGroup ],
      ( lowerNumberLineWrapper, distributionRadioButtonGroupWrapper ) => {
        distributionRadioButtonGroupWrapper.bottom = lowerNumberLineWrapper.top - 10;
      } );

    this.addChild( distributionRadioButtonGroup );
    this.addChild( variabilityMeasureRadioButtonGroup );

    const infoDialog = new InfoDialog( model, {
      tandem: options.tandem.createTandem( 'infoDialog' )
    } );
    model.isInfoShowingProperty.link( isInfoShowing => {
      if ( isInfoShowing ) {
        infoDialog.show();
      }
      else {
        infoDialog.hide();
      }
    } );

    const bottomCheckboxGroup = new BottomRepresentationCheckboxGroup( model, {
      includeVariability: true,
      includePredictMean: false,
      includePredictMedian: false,
      includeMean: true,
      includeMedian: true,
      tandem: options.tandem.createTandem( 'bottomCheckboxGroup' )
    } );

    // TODO: A bit of duplication across screen views
    // In order to use the AlignBox we need to know the distance from the top of the screen, to the top of the grass.
    const BOTTOM_CHECKBOX_PANEL_MARGIN = 12.5;
    const BOTTOM_CHECKBOX_PANEL_Y_MARGIN = this.layoutBounds.maxY - this.modelViewTransform.modelToViewY( 0 ) + BOTTOM_CHECKBOX_PANEL_MARGIN;

    const checkboxAlignBox = new AlignBox( bottomCheckboxGroup, { alignBounds: this.layoutBounds, xAlign: 'right', yAlign: 'bottom', xMargin: BOTTOM_CHECKBOX_PANEL_MARGIN, yMargin: BOTTOM_CHECKBOX_PANEL_Y_MARGIN } );
    this.addChild( checkboxAlignBox );
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );