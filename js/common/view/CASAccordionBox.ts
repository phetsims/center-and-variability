// Copyright 2022, University of Colorado Boulder

/**
 * Accordion box used in all of the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import CASConstants from '../CASConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import centerAndSpread from '../../centerAndSpread.js';
import TopRepresentationCheckboxGroup from './TopRepresentationCheckboxGroup.js';
import CASModel from '../model/CASModel.js';
import ValueReadoutsNode from './ValueReadoutsNode.js';
import { RequiredTandem } from '../../../../tandem/js/PhetioObject.js';
import Shape from '../../../../kite/js/Shape.js';

type CASAccordionBoxSelfOptions = {
  titleString: string;
  valueReadoutsNode: ValueReadoutsNode | null;
};
export type CASAccordionBoxOptions =
  CASAccordionBoxSelfOptions
  & Omit<AccordionBoxOptions, 'titleNode' | 'expandedProperty'>
  & RequiredTandem;

// constants
const CONTENT_MARGIN = 10;
const BUTTON_SIDE_LENGTH = 20;

class CASAccordionBox extends AccordionBox {

  // TODO: In order to support the accordion box (screen 2) and panel (screen 3) with similar layouts,
  // consider a panel that puts readouts on the left, data + number line in the middle, and
  // checkboxes on the right.  Rather than duplicating that here is accordion box and the screen 3 panel.
  constructor( model: CASModel, contentNode: Node, checkboxPanel: TopRepresentationCheckboxGroup,
               layoutBounds: Bounds2, providedOptions: CASAccordionBoxOptions ) {

    const options = optionize<CASAccordionBoxOptions, CASAccordionBoxSelfOptions, AccordionBoxOptions>( {
      tandem: Tandem.REQUIRED,
      titleAlignX: 'left',
      titleXSpacing: 8,
      cornerRadius: 6,
      titleYMargin: CONTENT_MARGIN,
      buttonXMargin: CONTENT_MARGIN,
      buttonYMargin: CONTENT_MARGIN,
      contentXMargin: CONTENT_MARGIN,
      contentYMargin: 0,
      contentYSpacing: 0,
      contentAlign: 'left',
      expandCollapseButtonOptions: {
        sideLength: BUTTON_SIDE_LENGTH
      },
      titleNode: new Text( providedOptions.titleString, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } )
    }, providedOptions );

    const backgroundNode = new Rectangle( {
      rectHeight: 140,
      rectWidth: layoutBounds.width - CASConstants.SCREEN_VIEW_X_MARGIN * 2 - CONTENT_MARGIN * 2
    } );

    // Explicitly set the local bounds so they don't change. This lets content appear next to the accordion box title.
    // TODO: Let's review how the bounds are being used here.
    backgroundNode.localBounds = backgroundNode.localBounds.copy();

    // Since the title is visible while the accordion box is open, this background will not any area above the bottom of
    // the expand/collapse button. To vertically-center things, make a new set of bounds that includes the missing space.
    // Values come from the height of the expand/collapse button plus the y margin above and below it.
    const fullHeightBackgroundBounds = backgroundNode.localBounds.withOffsets( 0, CONTENT_MARGIN * 2 + BUTTON_SIDE_LENGTH, 0, 0 );

    // add clip area so dot stacks that are taller than the accordion box are clipped appropriately
    backgroundNode.clipArea = Shape.bounds( fullHeightBackgroundBounds );

    // TODO: we are mutating the position of things being passed in

    checkboxPanel.centerY = fullHeightBackgroundBounds.centerY;
    backgroundNode.addChild( checkboxPanel );

    // TODO for CK: content has no height at time of instantiation, so does not end up in the correct place.
    contentNode.centerY = fullHeightBackgroundBounds.centerY;
    backgroundNode.addChild( contentNode );

    if ( options.valueReadoutsNode ) {
      options.valueReadoutsNode.centerY = fullHeightBackgroundBounds.centerY;
      backgroundNode.addChild( options.valueReadoutsNode );
    }

    super( backgroundNode, options );
  }
}

centerAndSpread.register( 'CASAccordionBox', CASAccordionBox );
export default CASAccordionBox;