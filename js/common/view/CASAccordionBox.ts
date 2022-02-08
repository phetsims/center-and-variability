// Copyright 2022, University of Colorado Boulder

/**
 * Accordion box used in all of the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import CASConstants from '../CASConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import centerAndSpread from '../../centerAndSpread.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

// types
type CASAccordionBoxSelfOptions = {
  titleString: string
};
// TODO: Get AccordionBox options
export type CASAccordionBoxOptions = CASAccordionBoxSelfOptions & {} & NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class CASAccordionBox extends AccordionBox {
  private readonly isExpandedProperty: BooleanProperty;

  constructor( layoutBounds: Bounds2, providedOptions: CASAccordionBoxOptions ) {

    const options = optionize<CASAccordionBoxOptions>( {
      tandem: Tandem.REQUIRED,
      titleAlignX: 'left',
      titleXSpacing: 8,
      cornerRadius: 6,
      titleYMargin: 10,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 0,
      contentXSpacing: 0,
      contentAlign: 'left',
      expandCollapseButtonOptions: {
        sideLength: 20
      }
    }, providedOptions );

    const isExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isExpandedProperty' )
    } );

    const contentNode = new Rectangle( {
      rectHeight: 160,
      // TODO: CK - figure out precise size desired and document size calculation
      rectWidth: layoutBounds.width - CASConstants.SCREEN_VIEW_X_MARGIN * 2 - 40
    } );

    // TODO: optionize
    super( contentNode, merge( {
      titleNode: new Text( options.titleString, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } ),
      expandedProperty: isExpandedProperty
    }, options ) );

    this.isExpandedProperty = isExpandedProperty;
  }

  reset() {
    this.isExpandedProperty.reset();
  }
}

centerAndSpread.register( 'CASAccordionBox', CASAccordionBox );
export default CASAccordionBox;