// Copyright 2023-2024, University of Colorado Boulder

/**
 * CAVInfoButton is a customized info button tailored for the Center and Variability simulation. Designed to fit
 * within accordion boxes, this button exhibits a distinct look and behavior compared to standard info buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import { Shape } from '../../../../kite/js/imports.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import { BUTTON_AND_TITLE_MARGIN } from './CAVAccordionBox.js';

export default class CAVInfoButton extends InfoButton {
  public constructor( infoButtonPressedEmitter: Emitter, backgroundShape: Shape, tandem: Tandem ) {
    super( {
      iconFill: '#2C60E2',
      scale: 0.5,
      touchAreaDilation: 30,
      mouseAreaDilation: 15,
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