// Copyright 2023, University of Colorado Boulder

import ComboBox, { ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import centerAndVariability from '../../centerAndVariability.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import CAVConstants from '../CAVConstants.js';

export default class MaxKicksComboBox extends ComboBox<number> {

  public constructor( maxKicksProperty: LinkableProperty<number>, listParent: Node, providedOptions?: ComboBoxOptions ) {
    super( maxKicksProperty, CAVConstants.MAX_KICKS_VALUES.map( value => {
      return {
        value: value,
        createNode: tandem => new Text( '' + value, {
          font: CAVConstants.MAIN_FONT
        } )
      };
    } ), listParent, providedOptions );
  }
}

centerAndVariability.register( 'MaxKicksComboBox', MaxKicksComboBox );