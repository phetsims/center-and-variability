// Copyright 2023-2024, University of Colorado Boulder

/**
 * NeedAtLeastNKicksText is a text UI component designed for accordion boxes and info dialogs.
 * It conveys a message to the user indicating that a minimum amount of data (or kicks) is
 * required to calculate a specific statistic.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../CAVConstants.js';

export default class NeedAtLeastNKicksText extends Text {

  public constructor( stringProperty: LocalizedStringProperty, providedOptions?: TextOptions ) {
    super( stringProperty, combineOptions<TextOptions>( {
      fontSize: 18,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH
    }, providedOptions ) );
  }
}

centerAndVariability.register( 'NeedAtLeastNKicksText', NeedAtLeastNKicksText );