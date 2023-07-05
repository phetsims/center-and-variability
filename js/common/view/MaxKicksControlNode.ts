// Copyright 2023, University of Colorado Boulder

import { ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import centerAndVariability from '../../centerAndVariability.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import MaxKicksComboBox from './MaxKicksComboBox.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVConstants from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import Property from '../../../../axon/js/Property.js';

export default class MaxKicksControlNode extends HBox {

  public constructor( maxKicksProperty: Property<number>, listParent: Node, options: ComboBoxOptions & PickRequired<ComboBoxOptions, 'tandem'> ) {
    super( {
        spacing: 10,
        children: [ new Text( CenterAndVariabilityStrings.maxKicksStringProperty, {
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