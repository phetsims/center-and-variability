// Copyright 2022-2023, University of Colorado Boulder

/**
 * Accordion box that appears at the top of each screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';

type SelfOptions = EmptySelfOptions;

export type CAVAccordionBoxOptions =
  SelfOptions
  & StrictOmit<AccordionBoxOptions, 'expandedProperty'>
  & PickRequired<AccordionBoxOptions, 'tandem'>;

// constants
export const CONTENT_MARGIN = 10;
const BUTTON_SIDE_LENGTH = 20;

export default class CAVAccordionBox extends AccordionBox {

  // NOTE: The positions of the passed-in nodes are modified directly, so they cannot be used in the scenery DAG
  public constructor( contentNode: Node, providedOptions: CAVAccordionBoxOptions ) {

    const options = optionize<CAVAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      titleAlignX: 'left',
      titleXSpacing: 8,
      cornerRadius: 6,
      titleYMargin: CONTENT_MARGIN,
      buttonXMargin: CONTENT_MARGIN,
      buttonYMargin: CONTENT_MARGIN,
      contentXMargin: CONTENT_MARGIN,

      // We want the content to go all the way to the top of the accordionBox.
      // The bottom margin is set in ACCORDION_BOX_CONTENTS_SHAPE
      contentYMargin: 0,
      contentYSpacing: 0,
      contentAlign: 'left',
      allowContentToOverlapTitle: true,
      useExpandedBoundsWhenCollapsed: false,
      expandCollapseButtonOptions: {
        sideLength: BUTTON_SIDE_LENGTH
      }
    }, providedOptions );

    super( contentNode, options );
  }

  public static createBackgroundNode( shape: Shape ): Node {
    return new Node( {

      // add clip area so dot stacks that are taller than the accordion box are clipped appropriately
      clipArea: shape,
      children: [

        // A sub-node so it can be non-pickable (so that click events can still reach the accordion box title bar)
        new Path( shape, {
          pickable: false
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'CAVAccordionBox', CAVAccordionBox );