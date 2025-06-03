// Copyright 2023-2025, University of Colorado Boulder

/**
 * CAVInfoButton is a customized info button tailored for the Center and Variability simulation. Designed to fit
 * within accordion boxes, this button exhibits a distinct look and behavior compared to standard info buttons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Shape from '../../../../kite/js/Shape.js';
import InfoButton, { InfoButtonOptions } from '../../../../scenery-phet/js/buttons/InfoButton.js';
import centerAndVariability from '../../centerAndVariability.js';
import { BUTTON_AND_TITLE_MARGIN } from './CAVAccordionBox.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
type CAVInfoButtonOptions = WithRequired<InfoButtonOptions, 'tandem'>;
export default class CAVInfoButton extends InfoButton {
  public constructor( infoButtonPressedEmitter: Emitter, backgroundShape: Shape, providedOptions: CAVInfoButtonOptions ) {
    const options = optionize<CAVInfoButtonOptions, SelfOptions, InfoButtonOptions>()( {
      iconFill: '#2C60E2',
      scale: 0.5,
      touchAreaDilation: 30,
      mouseAreaDilation: 15,
      listener: () => {
        infoButtonPressedEmitter.emit();
      },
      top: backgroundShape.bounds.top + BUTTON_AND_TITLE_MARGIN,
      right: backgroundShape.bounds.right,
      isDisposable: false
    }, providedOptions );
    super( options );
  }
}
centerAndVariability.register( 'CAVInfoButton', CAVInfoButton );