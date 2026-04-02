// Copyright 2023-2026, University of Colorado Boulder

/**
 * This class provides a custom dialog for the Center and Variability simulation. It features enhanced close button touch areas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CAVDialog extends Dialog {
  public constructor( node: Node, tandem: Tandem, providedOptions?: DialogOptions ) {
    const options = optionize<DialogOptions, EmptySelfOptions, DialogOptions>()( {
      isDisposable: false,
      closeButtonTouchAreaXDilation: 10,
      closeButtonTouchAreaYDilation: 10,
      accessibleNameConfiguration: 'aria-label',
      tandem: tandem
    }, providedOptions );

    super( node, options );
  }
}
