// Copyright 2022-2023, University of Colorado Boulder

/**
 * The CAVAccordionBox is an accordion UI component for the Center and Variability simulation.
 * Positioned at the top of each screen, it offers configurable margins and spacings. Unique features include
 * full content extension up to the top edge and a clipping mechanism for content that exceeds the accordion's height.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { Node, Path, TPaint } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import centerAndVariability from '../../centerAndVariability.js';

type SelfOptions = EmptySelfOptions;

export type CAVAccordionBoxOptions =
  SelfOptions
  & WithRequired<AccordionBoxOptions, 'tandem' | 'expandedProperty' | 'fill'>;

// constants
export const CONTENT_MARGIN = 12;
export const BUTTON_AND_TITLE_MARGIN = 10;
const BUTTON_SIDE_LENGTH = 20;

export default class CAVAccordionBox extends AccordionBox {

  // NOTE: The positions of the passed-in nodes are modified directly, so they cannot be used in the scenery DAG
  public constructor( contentNode: Node, providedOptions: CAVAccordionBoxOptions ) {

    const options = optionize<CAVAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      titleAlignX: 'left',
      titleXSpacing: 8,
      cornerRadius: 6,
      titleYMargin: BUTTON_AND_TITLE_MARGIN,
      buttonXMargin: BUTTON_AND_TITLE_MARGIN,
      buttonYMargin: BUTTON_AND_TITLE_MARGIN,
      contentXMargin: CONTENT_MARGIN,

      // We want the content to go all the way to the top of the accordionBox.
      // The bottom margin is set in ACCORDION_BOX_CONTENTS_SHAPE values
      contentYMargin: 0,
      contentYSpacing: 0,
      contentAlign: 'left',
      allowContentToOverlapTitle: true,
      useExpandedBoundsWhenCollapsed: false,
      expandCollapseButtonOptions: {
        sideLength: BUTTON_SIDE_LENGTH
      },

      isDisposable: false
    }, providedOptions );

    super( contentNode, options );
  }

  public static createBackgroundNode( shape: Shape, fill: TPaint ): Node {
    return new Node( {

      // add clip area so dot stacks that are taller than the accordion box are clipped appropriately
      clipArea: shape,
      children: [

        // A sub-node so it can be non-pickable (so that click events can still reach the accordion box title bar)
        new Path( shape, {
          pickable: false,
          fill: fill
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'CAVAccordionBox', CAVAccordionBox );