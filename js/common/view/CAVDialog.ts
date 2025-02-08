// Copyright 2023-2025, University of Colorado Boulder

/**
 * This class provides a custom dialog for the Center and Variability simulation. It features enhanced close button touch areas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class CAVDialog extends Dialog {
  public constructor( node: Node, tandem: Tandem ) {
    super( node, {
      isDisposable: false,
      closeButtonTouchAreaXDilation: 10,
      closeButtonTouchAreaYDilation: 10,
      tandem: tandem
    } );
  }
}
centerAndVariability.register( 'CAVDialog', CAVDialog );