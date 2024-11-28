// Copyright 2023-2024, University of Colorado Boulder

/**
 * VariabilityMeasureCheckbox is a checkbox in the variability accordion box that controls whether a
 * variability readout text is showing or not.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { TColor, Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import VariabilityMeasureIconNode from './VariabilityMeasureIconNode.js';

export default class VariabilityMeasureCheckbox extends Checkbox {
  public constructor( property: Property<boolean>, stringProperty: TReadOnlyProperty<string>, color: TColor, options: CheckboxOptions ) {

    const content = AccordionBoxCheckboxFactory.createGridBox(
      new Text( stringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      new VariabilityMeasureIconNode( color )
    );

    super( property, content, combineOptions<CheckboxOptions>( {
      isDisposable: false,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    }, options ) );
  }
}

centerAndVariability.register( 'VariabilityMeasureCheckbox', VariabilityMeasureCheckbox );