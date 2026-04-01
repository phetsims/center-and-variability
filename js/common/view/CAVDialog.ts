// Copyright 2023-2026, University of Colorado Boulder

/**
 * This class provides a custom dialog for the Center and Variability simulation. It features enhanced close button touch areas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CAVDialog extends Dialog {
  public constructor( node: Node, tandem: Tandem ) {
    super( node, {
      isDisposable: false,
      closeButtonTouchAreaXDilation: 10,
      closeButtonTouchAreaYDilation: 10,
      accessibleNameConfiguration: 'aria-label',

      // TODO: What should this be? Likely each subclass has its own. See
      //    https://github.com/phetsims/center-and-variability/issues/670
      accessibleName: 'Info Dialog',
      tandem: tandem
    } );
  }
}
