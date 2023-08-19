// Copyright 2023, University of Colorado Boulder

/**
 * Look and layout for the info button, shown in each accordion box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { BUTTON_AND_TITLE_MARGIN } from './CAVAccordionBox.js';
import centerAndVariability from '../../centerAndVariability.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Shape } from '../../../../kite/js/imports.js';
import Emitter from '../../../../axon/js/Emitter.js';

export default class CAVInfoButton extends InfoButton {
  public constructor( infoButtonPressedEmitter: Emitter, backgroundShape: Shape, tandem: Tandem ) {
    super( {
      iconFill: '#2C60E2',
      scale: 0.5,
      touchAreaDilation: 5,
      tandem: tandem,
      listener: () => {
        infoButtonPressedEmitter.emit();
      },
      top: backgroundShape.bounds.top + BUTTON_AND_TITLE_MARGIN,
      right: backgroundShape.bounds.right,
      isDisposable: false
    } );
  }
}
centerAndVariability.register( 'CAVInfoButton', CAVInfoButton );