// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import MedianPlotNode from './MedianPlotNode.js';

export default class MeanAndMedianAccordionBox extends CAVAccordionBox {

  public constructor( model: MeanAndMedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number, playAreaNumberLineNode: Node ) {

    const accordionBoxContents = new MedianPlotNode( model, {
      tandem: tandem.createTandem( 'plotNode' )
    } );

    super( model, accordionBoxContents,
      new Text( CenterAndVariabilityStrings.distanceInMetersStringProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } ),
      layoutBounds, {
        leftMargin: 0,
        tandem: tandem,
        top: top,
        centerX: layoutBounds.centerX
      } );
  }
}

centerAndVariability.register( 'MeanAndMedianAccordionBox', MeanAndMedianAccordionBox );