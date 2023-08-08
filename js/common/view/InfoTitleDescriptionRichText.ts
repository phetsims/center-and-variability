// Copyright 2023, University of Colorado Boulder

/**
 * Shows the title/description at the top of an info dialog. The title is bold and the description is normal.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { RichText } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CAVConstants from '../CAVConstants.js';

export default class InfoTitleDescriptionRichText extends RichText {
  public constructor( stringProperty: LocalizedStringProperty ) {
    super( stringProperty, {
      font: new PhetFont( CAVConstants.INFO_DIALOG_TITLE_FONT_SIZE ),
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
      layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN, topMargin: 20 }
    } );
  }
}

centerAndVariability.register( 'InfoTitleDescriptionRichText', InfoTitleDescriptionRichText );