// Copyright 2022, University of Colorado Boulder

/**
 * Accordion box used in all of the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { NodeOptions, Rectangle, Text, Node } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import CASConstants from '../CASConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import centerAndSpread from '../../centerAndSpread.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TopRepresentationCheckboxGroup from './TopRepresentationCheckboxGroup.js';
import CASModel from '../model/CASModel.js';

// types
type CASAccordionBoxSelfOptions = {
  titleString: string
};
// TODO: Get AccordionBox options
export type CASAccordionBoxOptions = CASAccordionBoxSelfOptions & {} & NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class CASAccordionBox extends AccordionBox {
  private readonly isExpandedProperty: BooleanProperty;

  constructor( model: CASModel, contents: Node, layoutBounds: Bounds2, providedOptions: CASAccordionBoxOptions ) {

    const options = optionize<CASAccordionBoxOptions, CASAccordionBoxSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED,

      // @ts-ignore
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

    const backgroundRectangle = new Rectangle( {
      rectHeight: 160,
      // TODO: CK - figure out precise size desired and document size calculation
      rectWidth: layoutBounds.width - CASConstants.SCREEN_VIEW_X_MARGIN * 2 - 40
    } );

    // TODO: Does this belong here, or move it to the call site?
    const checkboxPanel = new TopRepresentationCheckboxGroup( model );
    checkboxPanel.right = backgroundRectangle.right;

    backgroundRectangle.addChild( checkboxPanel );

    contents.centerY = backgroundRectangle.centerY - 24;
    backgroundRectangle.addChild( contents );

    // TODO: CK: make it possible to put things above the background rectangle
    // backgroundRectangle.localBounds = backgroundRectangle.bounds;

    // TODO: optionize
    super( backgroundRectangle, merge( {
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