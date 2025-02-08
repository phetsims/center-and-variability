// Copyright 2023-2025, University of Colorado Boulder

/**
 * MaxKicksComboBox provides a dropdown selection in the PreferencesDialog for users to choose the maximum
 * number of kicks allowed per scene. The options are derived from predefined constants.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../CAVConstants.js';

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