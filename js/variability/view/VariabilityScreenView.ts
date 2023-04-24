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
import { ManualConstraint, Text } from '../../../../scenery/js/imports.js';
import DistributionRadioButtonGroup from './DistributionRadioButtonGroup.js';
import VariabilityRadioButtonGroup from './VariabilityRadioButtonGroup.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VariabilityType from '../model/VariabilityType.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import CAVConstants from '../../common/CAVConstants.js';
import InfoDialog from './InfoDialog.js';

// TODO: Copied from somewhere. What's the best pattern?
const TEXT_OPTIONS = {
  font: CAVConstants.BUTTON_FONT,
  maxWidth: CAVConstants.PLAY_AREA_CHECKBOX_TEXT_MAX_WIDTH
};

type SelfOptions = EmptySelfOptions;
type VariabilityScreenViewOptions = SelfOptions & StrictOmit<SoccerScreenViewOptions, 'questionBarOptions' | 'createAccordionBoxControlNode'>;

export default class VariabilityScreenView extends MeanOrMedianScreenView {

  public constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const currentProperty = new DerivedProperty( [ model.selectedVariabilityProperty ], selectedVariability =>
      selectedVariability === VariabilityType.RANGE ? CenterAndVariabilityStrings.rangeStringProperty :
      selectedVariability === VariabilityType.IQR ? CenterAndVariabilityStrings.interquartileRangeIQRStringProperty :
      CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty
    );

    const accordionBoxTitleProperty = new DynamicProperty<string, unknown, unknown>( currentProperty );

    const options = optionize<VariabilityScreenViewOptions, SelfOptions, MeanOrMedianScreenViewOptions>()( {
      isMedianScreen: false,
      isVariabilityScreen: true,
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.variabilityQuestionStringProperty
      },
      createAccordionBoxControlNode: tandem => new ToggleNode( model.selectedVariabilityProperty, [ {
        value: VariabilityType.RANGE,

        // TODO: Different string value?
        createNode: tandem => new Checkbox( model.isShowingRangeProperty, new Text( CenterAndVariabilityStrings.rangeStringProperty, TEXT_OPTIONS ) )
      }, {
        value: VariabilityType.IQR,
        createNode: tandem => new Checkbox( model.isShowingIQRProperty, new Text( CenterAndVariabilityStrings.iqrStringProperty, TEXT_OPTIONS ) )
      }, {
        value: VariabilityType.MAD,
        createNode: tandem => new Checkbox( model.isShowingMADProperty, new Text( CenterAndVariabilityStrings.madStringProperty, TEXT_OPTIONS ) )
      }
      ] ),
      bottomCheckboxGroupOptions: {
        includeVariability: true,
        includePredictMean: false,
        includePredictMedian: false
      },
      accordionBoxTitleStringProperty: accordionBoxTitleProperty
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

    const distributionRadioButtonGroup = new DistributionRadioButtonGroup( model.selectedDistributionProperty, {
      left: 10
    } );

    // Float above the ground
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, distributionRadioButtonGroup ],
      ( lowerNumberLineWrapper, distributionRadioButtonGroupWrapper ) => {
        distributionRadioButtonGroupWrapper.bottom = lowerNumberLineWrapper.top - 10;
      } );

    this.addChild( distributionRadioButtonGroup );

    const variabilityRadioButtonGroup = new VariabilityRadioButtonGroup( model.selectedVariabilityProperty, {
      left: 10
    } );
    this.addChild( variabilityRadioButtonGroup );

    ManualConstraint.create( this, [ variabilityRadioButtonGroup, this.accordionBoxContents ],
      ( variabilityRadioButtonGroupWrapper, accordionBoxWrapper ) => {
        variabilityRadioButtonGroupWrapper.top = accordionBoxWrapper.top;
      } );

    const infoDialog = new InfoDialog( model, this.chartViewWidth );
    model.isInfoShowingProperty.link( isInfoShowing => {
      if ( isInfoShowing ) {
        infoDialog.show();
      }
      else {
        infoDialog.hide();
      }
    } );
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );