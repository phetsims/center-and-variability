// Copyright 2022, University of Colorado Boulder

/**
 * Accordion box used in all of the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { NodeOptions, Rectangle, Text, Node } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import CASConstants from '../CASConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import centerAndSpread from '../../centerAndSpread.js';
import TopRepresentationCheckboxGroup from './TopRepresentationCheckboxGroup.js';
import CASModel from '../model/CASModel.js';

// types
type CASAccordionBoxSelfOptions = {
  titleString: string
};
export type CASAccordionBoxOptions = CASAccordionBoxSelfOptions & Omit<AccordionBoxOptions, 'titleNode' | 'expandedProperty'> & Required<Pick<NodeOptions, 'tandem'>>;

class CASAccordionBox extends AccordionBox {

  constructor( model: CASModel, contents: Node, checkboxPanel: TopRepresentationCheckboxGroup,
               layoutBounds: Bounds2, providedOptions: CASAccordionBoxOptions ) {

    const options = optionize<CASAccordionBoxOptions, CASAccordionBoxSelfOptions, AccordionBoxOptions>( {
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
      },
      titleNode: new Text( providedOptions.titleString, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } )
    }, providedOptions );

    const backgroundRectangle = new Rectangle( {
      rectHeight: 160,
      // TODO: CK - figure out precise size desired and document size calculation
      rectWidth: layoutBounds.width - CASConstants.SCREEN_VIEW_X_MARGIN * 2 - 40
    } );

    checkboxPanel.right = backgroundRectangle.right;
    backgroundRectangle.addChild( checkboxPanel );

    contents.centerY = backgroundRectangle.centerY - 24;
    backgroundRectangle.addChild( contents );

    // TODO: CK: make it possible to put things above the background rectangle
    // backgroundRectangle.localBounds = backgroundRectangle.bounds;

    super( backgroundRectangle, options );


  }
}

centerAndSpread.register( 'CASAccordionBox', CASAccordionBox );
export default CASAccordionBox;