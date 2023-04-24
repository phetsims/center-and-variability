// Copyright 2022-2023, University of Colorado Boulder

/**
 * Accordion box used in all of the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import CAVConstants from '../CAVConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVModel from '../model/CAVModel.js';
import ValueReadoutsNode from './ValueReadoutsNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  valueReadoutsNode: ValueReadoutsNode | null;
  contentNodeOffsetY: number;
  leftMargin: number;
};
export type CAVAccordionBoxOptions =
  SelfOptions
  & StrictOmit<AccordionBoxOptions, 'titleNode' | 'expandedProperty'>
  & PickRequired<AccordionBoxOptions, 'tandem'>;

// constants
const CONTENT_MARGIN = 10;
const BUTTON_SIDE_LENGTH = 20;

export default class CAVAccordionBox extends AccordionBox {

  // TODO: In order to support the accordion box (screen 2) and panel (screen 3) with similar layouts,
  // consider a panel that puts readouts on the left, data + number line in the middle, and
  // checkboxes on the right.  Rather than duplicating that here is accordion box and the screen 3 panel.
  public constructor( model: CAVModel, contentNode: Node, checkboxPanel: Node,
                      titleNode: Node, layoutBounds: Bounds2, providedOptions: CAVAccordionBoxOptions ) {

    const options = optionize<CAVAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
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
      titleNode: titleNode
    }, providedOptions );

    const backgroundNode = new Rectangle( {
      rectHeight: 140,
      rectWidth: layoutBounds.width - CAVConstants.SCREEN_VIEW_X_MARGIN * 2 - CONTENT_MARGIN * 2 - options.leftMargin
    } );

    // Explicitly set the local bounds so they don't change. This lets content appear next to the accordion box title.
    // TODO: Let's review how the bounds are being used here.
    backgroundNode.localBounds = backgroundNode.localBounds.copy();

    // Since the title is visible while the accordion box is open, this background will not any area above the bottom of
    // the expand/collapse button. To vertically-center things, make a new set of bounds that includes the missing space.
    // Values come from the height of the expand/collapse button plus the y margin above and below it. Also add the
    // horizontal content margin that is not part of backgroundNode so these bounds are the full area of the accordion box.
    const fullBackgroundBounds =
      backgroundNode.localBounds.withOffsets( CONTENT_MARGIN, CONTENT_MARGIN * 2 + BUTTON_SIDE_LENGTH, CONTENT_MARGIN, 0 );

    // add clip area so dot stacks that are taller than the accordion box are clipped appropriately
    backgroundNode.clipArea = Shape.bounds( fullBackgroundBounds );

    // TODO: we are mutating the position of things being passed in

    checkboxPanel.centerY = fullBackgroundBounds.centerY;
    backgroundNode.addChild( checkboxPanel );

    // TODO: SR says: Perhaps use x and y instead of center in order to vertically center the content, then
    // options.contentNodeOffsetY should be omitted
    contentNode.centerY = fullBackgroundBounds.centerY + options.contentNodeOffsetY;
    backgroundNode.addChild( contentNode );

    if ( options.valueReadoutsNode ) {
      options.valueReadoutsNode.centerY = fullBackgroundBounds.centerY;
      backgroundNode.addChild( options.valueReadoutsNode );
    }

    super( backgroundNode, options );

    model.resetEmitter.addListener( () => this.reset() );
  }
}

centerAndVariability.register( 'CAVAccordionBox', CAVAccordionBox );