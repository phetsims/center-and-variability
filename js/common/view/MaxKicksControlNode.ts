// Copyright 2023, University of Colorado Boulder

import { ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import centerAndVariability from '../../centerAndVariability.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import MaxKicksComboBox from './MaxKicksComboBox.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVConstants from '../CAVConstants.js';

export default class MaxKicksControlNode extends HBox {

  public constructor( maxKicksProperty: LinkableProperty<number>, listParent: Node, options: ComboBoxOptions & PickRequired<ComboBoxOptions, 'tandem'> ) {
    super( {
        spacing: 10,
        children: [ new Text( 'Max Kicks', {
          font: CAVConstants.MAIN_FONT,
          tandem: options.tandem.createTandem( 'maxKicksLabelText' )
        } ), new MaxKicksComboBox( maxKicksProperty, listParent, {
          tandem: options.tandem.createTandem( 'maxKicksComboBox' )
        } ) ]
      }
    );
  }
}

centerAndVariability.register( 'MaxKicksControlNode', MaxKicksControlNode );