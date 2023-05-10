// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CardNodeContainer from './CardNodeContainer.js';
import { Path, Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianModel from '../model/MedianModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import CardNode from './CardNode.js';
import CAVConstants from '../../common/CAVConstants.js';

export default class MedianAccordionBox extends CAVAccordionBox {

  public constructor( model: MedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEAN_AND_OR_MEDIAN;
    const backgroundNode = new Path( backgroundShape, {
      clipArea: backgroundShape
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getSortDataCheckboxItem( model.isSortingDataProperty ),
      AccordionBoxCheckboxFactory.getMedianCheckboxWithoutIconItem( model.isShowingTopMedianProperty )
    ], {
      tandem: tandem.createTandem( 'accordionCheckboxGroup' ),
      right: backgroundNode.width - 12.5,
      centerY: backgroundNode.height / 2
    } );

    const cardNodeContainer = new CardNodeContainer( model, {

      // Expose this intermediate layer to make it so that clients can hide the number cards with one call
      tandem: tandem.createTandem( 'cardNodeContainer' ),
      x: 12.5,
      y: backgroundNode.height / 2 - CardNode.CARD_DIMENSION / 2 - 10
    } );

    backgroundNode.addChild( cardNodeContainer );
    backgroundNode.addChild( checkboxGroup );

    super( backgroundNode, {
      tandem: tandem,
      top: top,
      centerX: layoutBounds.centerX,
      titleNode: new Text( CenterAndVariabilityStrings.distanceInMetersStringProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } )
    } );
  }
}

centerAndVariability.register( 'MedianAccordionBox', MedianAccordionBox );