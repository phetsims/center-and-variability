// Copyright 2023, University of Colorado Boulder

/**
 * ComboBox in PreferencesDialog that provides options on the maximum number of kicks allowed per scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ComboBox from '../../../../sun/js/ComboBox.js';
import centerAndVariability from '../../centerAndVariability.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import CAVConstants from '../CAVConstants.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MaxKicksComboBox extends ComboBox<number> {

  public constructor( maxKicksProperty: Property<number>, listParent: Node, tandem: Tandem ) {
    super( maxKicksProperty, CAVConstants.MAX_KICKS_VALUES.map( value => {
      return {
        value: value,
        createNode: () => new Text( '' + value, {
          font: CAVConstants.MAIN_FONT
        } )
      };
    } ), listParent, {
      tandem: tandem,
      isDisposable: false,

      // Show or hide the entire row, not just the combo box
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

centerAndVariability.register( 'MaxKicksComboBox', MaxKicksComboBox );