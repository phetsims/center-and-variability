// Copyright 2023, University of Colorado Boulder

import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import centerAndVariability from '../../centerAndVariability.js';
import { AlignGroup, TColor, Text } from '../../../../scenery/js/imports.js';
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import VariabilityMeasureIconNode from './VariabilityMeasureIconNode.js';

export default class VariabilityMeasureCheckbox extends Checkbox {
  public constructor( property: Property<boolean>, stringProperty: TReadOnlyProperty<string>, iconGroup: AlignGroup, textGroup: AlignGroup, color: TColor, options: CheckboxOptions ) {

    const content = AccordionBoxCheckboxFactory.createGridBox(
      new Text( stringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      new VariabilityMeasureIconNode( color ),
      iconGroup, textGroup
    );

    super( property, content, options );
  }
}

centerAndVariability.register( 'VariabilityMeasureCheckbox', VariabilityMeasureCheckbox );