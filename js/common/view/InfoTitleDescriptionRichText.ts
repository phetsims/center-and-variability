// Copyright 2023, University of Colorado Boulder

/**
 * InfoTitleDescriptionRichText visualizes the title (bold) and description (normal) for an info dialog using the RichText component.
 * Configurations such as font size, text width, and layout margins are derived from CAVConstants.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../CAVConstants.js';

export default class InfoTitleDescriptionRichText extends RichText {
  public constructor( stringProperty: LocalizedStringProperty ) {
    super( stringProperty, {
      font: new PhetFont( CAVConstants.INFO_DIALOG_TITLE_FONT_SIZE ),
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
      layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN, topMargin: 20 },
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'InfoTitleDescriptionRichText', InfoTitleDescriptionRichText );