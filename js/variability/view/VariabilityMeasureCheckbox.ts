// Copyright 2023, University of Colorado Boulder

import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import centerAndVariability from '../../centerAndVariability.js';
import { AlignGroup, Color, Node, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';

export default class VariabilityMeasureCheckbox extends Checkbox {
  public constructor( property: LinkableProperty<boolean>, stringProperty: TReadOnlyProperty<string>, iconGroup: AlignGroup, color: TColor, options: CheckboxOptions ) {

    // TODO: Duplicated with IntervalToolIcon.ts, see https://github.com/phetsims/center-and-variability/issues/170
    // TODO: Also the dimensions are kind of different, see see https://github.com/phetsims/center-and-variability/issues/170
    const rectangle = new Rectangle( 0, 0, 25, 25, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( 0.1 )
    } );

    const arrowNode = new ArrowNode( 0, 0, rectangle.width, 0, {
      fill: 'black',
      stroke: null,
      center: rectangle.center,
      doubleHead: true,
      tailWidth: 2,
      headWidth: 7,
      headHeight: 5
    } );

    const content = AccordionBoxCheckboxFactory.createGridBox(
      new Text( stringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      new Node( {
        children: [
          rectangle,
          arrowNode
        ]
      } ),
      iconGroup
    );

    super( property, content, options );
  }
}

centerAndVariability.register( 'VariabilityMeasureCheckbox', VariabilityMeasureCheckbox );