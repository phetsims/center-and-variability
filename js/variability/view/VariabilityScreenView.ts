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
import { ManualConstraint, Text } from '../../../../scenery/js/imports.js';
import DistributionRadioButtonGroup from './DistributionRadioButtonGroup.js';
import VariabilityMeasureRadioButtonGroup from './VariabilityMeasureRadioButtonGroup.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import CAVConstants from '../../common/CAVConstants.js';
import InfoDialog from './InfoDialog.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';

// TODO: Copied from somewhere. What's the best pattern?
const TEXT_OPTIONS = {
  font: CAVConstants.BUTTON_FONT,
  maxWidth: CAVConstants.PLAY_AREA_CHECKBOX_TEXT_MAX_WIDTH
};

type SelfOptions = EmptySelfOptions;
type VariabilityScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions' | 'createAccordionBoxControlNode' | 'isMedianScreen' | 'isVariabilityScreen' | 'accordionBoxTitleStringProperty'>;

export default class VariabilityScreenView extends CAVScreenView {

  public constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const currentProperty = new DerivedProperty( [ model.selectedVariabilityProperty ], selectedVariability =>
      selectedVariability === VariabilityMeasure.RANGE ? CenterAndVariabilityStrings.rangeStringProperty :
      selectedVariability === VariabilityMeasure.IQR ? CenterAndVariabilityStrings.interquartileRangeIQRStringProperty :
      CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty
    );

    const accordionBoxTitleProperty = new DynamicProperty<string, unknown, unknown>( currentProperty );

    const options = optionize<VariabilityScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      isMedianScreen: false,
      isVariabilityScreen: true,
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.variabilityQuestionStringProperty
      },
      createAccordionBoxControlNode: tandem => new ToggleNode( model.selectedVariabilityProperty, [ {
        value: VariabilityMeasure.RANGE,

        // TODO: Different string value? For now, use the same string for the accordion box title and checkbox, and a different one for the value equals pattern
        createNode: tandem => new Checkbox( model.isShowingRangeProperty, new Text( CenterAndVariabilityStrings.rangeStringProperty, TEXT_OPTIONS ), {
          tandem: tandem.createTandem( 'rangeCheckbox' )
        } )
      }, {
        value: VariabilityMeasure.IQR,
        createNode: tandem => new Checkbox( model.isShowingIQRProperty, new Text( CenterAndVariabilityStrings.iqrStringProperty, TEXT_OPTIONS ), {
          tandem: tandem.createTandem( 'iqrCheckbox' )
        } )
      }, {
        value: VariabilityMeasure.MAD,
        createNode: tandem => new Checkbox( model.isShowingMADProperty, new Text( CenterAndVariabilityStrings.madStringProperty, TEXT_OPTIONS ), {
          tandem: tandem.createTandem( 'madCheckbox' )
        } )
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
      left: 10,
      tandem: options.tandem.createTandem( 'distributionRadioButtonGroup' )
    } );

    // Float above the ground
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, distributionRadioButtonGroup ],
      ( lowerNumberLineWrapper, distributionRadioButtonGroupWrapper ) => {
        distributionRadioButtonGroupWrapper.bottom = lowerNumberLineWrapper.top - 10;
      } );

    this.addChild( distributionRadioButtonGroup );

    const variabilityMeasureRadioButtonGroup = new VariabilityMeasureRadioButtonGroup( model.selectedVariabilityProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'variabilityMeasureRadioButtonGroup' )
    } );
    this.addChild( variabilityMeasureRadioButtonGroup );

    ManualConstraint.create( this, [ variabilityMeasureRadioButtonGroup, this.accordionBoxContents ],
      ( variabilityRadioButtonGroupWrapper, accordionBoxWrapper ) => {
        variabilityRadioButtonGroupWrapper.top = accordionBoxWrapper.top;
      } );

    const infoDialog = new InfoDialog( model, this.chartViewWidth, {
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
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );