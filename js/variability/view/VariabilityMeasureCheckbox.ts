// Copyright 2023, University of Colorado Boulder

import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import centerAndVariability from '../../centerAndVariability.js';
import { AlignGroup, Color, Node, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import IconArrowNode from './IconArrowNode.js';
import Property from '../../../../axon/js/Property.js';

export default class VariabilityMeasureCheckbox extends Checkbox {
  public constructor( property: Property<boolean>, stringProperty: TReadOnlyProperty<string>, iconGroup: AlignGroup, textGroup: AlignGroup, color: TColor, options: CheckboxOptions ) {

    const rectangle = new Rectangle( 0, 0, 25, 25, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( 0.1 )
    } );

    const content = AccordionBoxCheckboxFactory.createGridBox(
      new Text( stringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      new Node( {
        children: [
          rectangle,
          new IconArrowNode( rectangle )
        ]
      } ),
      iconGroup, textGroup
    );

    super( property, content, options );
  }
}

centerAndVariability.register( 'VariabilityMeasureCheckbox', VariabilityMeasureCheckbox );