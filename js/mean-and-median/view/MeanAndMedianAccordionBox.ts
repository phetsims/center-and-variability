// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import TopRepresentationCheckboxGroup from '../../common/view/TopRepresentationCheckboxGroup.js';
import { Text, Node } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import MedianPlotNode from './MedianPlotNode.js';
import ValueReadoutsNode from '../../common/view/ValueReadoutsNode.js';

export default class MeanAndMedianAccordionBox extends CAVAccordionBox {

  public constructor( model: MeanAndMedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number, playAreaNumberLineNode: Node ) {

    const accordionBoxContents = new MedianPlotNode( model, {
      tandem: tandem.createTandem( 'plotNode' )
    } );

    super( model, accordionBoxContents, new TopRepresentationCheckboxGroup( model, {
        medianBarIconOptions: {
          notchDirection: 'down',
          barStyle: 'continuous',
          arrowScale: 0.75
        },
        showMedianCheckboxIcon: true,
        tandem: tandem.createTandem( 'topRepresentationCheckboxGroup' )
      } ),
      new Text( CenterAndVariabilityStrings.distanceInMetersStringProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } ),
      layoutBounds, {
        leftMargin: 0,
        tandem: tandem,
        top: top,
        valueReadoutsNode: new ValueReadoutsNode( model ),
        centerX: layoutBounds.centerX
      } );
  }
}

centerAndVariability.register( 'MeanAndMedianAccordionBox', MeanAndMedianAccordionBox );