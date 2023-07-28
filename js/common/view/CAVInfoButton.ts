// Copyright 2023, University of Colorado Boulder

/**
 * Look and layout for the info button, shown in each accordion box.
 * @author Sam Reid (PhET Interactive Simulations)
 */

import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { BUTTON_AND_TITLE_MARGIN } from './CAVAccordionBox.js';
import centerAndVariability from '../../centerAndVariability.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Shape } from '../../../../kite/js/imports.js';

export default class CAVInfoButton extends InfoButton {
  public constructor( isInfoVisibleProperty: TProperty<boolean>, backgroundShape: Shape, tandem: Tandem ) {
    super( {
      iconFill: 'cornflowerblue',
      scale: 0.5,
      touchAreaDilation: 5,
      tandem: tandem,
      listener: () => {
        isInfoVisibleProperty.value = true;
      },
      top: backgroundShape.bounds.top + BUTTON_AND_TITLE_MARGIN,
      right: backgroundShape.bounds.right
    } );
  }
}
centerAndVariability.register( 'CAVInfoButton', CAVInfoButton );