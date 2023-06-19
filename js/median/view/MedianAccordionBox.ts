// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CardNodeContainer from './CardNodeContainer.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MedianModel from '../model/MedianModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import CardNode from './CardNode.js';
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxTitleText from '../../common/view/AccordionBoxTitleText.js';
import CAVColors from '../../common/CAVColors.js';
import CAVInfoButton from '../../common/view/CAVInfoButton.js';

export default class MedianAccordionBox extends CAVAccordionBox {

  public constructor( model: MedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEDIAN;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape, CAVColors.meanAndMedianAccordionBoxFillProperty );

    const cardNodeContainer = new CardNodeContainer( model, {

      // Expose this intermediate layer to make it so that clients can hide the number cards with one call
      tandem: tandem.createTandem( 'cardNodeContainer' ),
      x: CAVConstants.ACCORDION_BOX_HORIZONTAL_MARGIN,
      y: backgroundShape.bounds.centerY - CardNode.CARD_DIMENSION / 2 + 5,
      parentContext: 'accordionBox'
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getSortDataCheckboxItem( model.isSortingDataProperty, model.sceneModels[ 0 ], cardNodeContainer ),
      AccordionBoxCheckboxFactory.getMedianCheckboxWithoutIconItem( model.isTopMedianVisibleProperty, model )
    ], {
      tandem: tandem.createTandem( 'checkboxGroup' ),
      right: backgroundShape.bounds.width - CAVConstants.ACCORDION_BOX_HORIZONTAL_MARGIN,
      centerY: backgroundShape.bounds.centerY
    } );

    backgroundNode.addChild( new CAVInfoButton( model.isInfoVisibleProperty, backgroundShape, tandem.createTandem( 'infoButton' ) ) );

    backgroundNode.addChild( cardNodeContainer );
    backgroundNode.addChild( checkboxGroup );

    super( backgroundNode, {
      tandem: tandem,
      top: top,
      centerX: layoutBounds.centerX,
      titleNode: new AccordionBoxTitleText( CenterAndVariabilityStrings.distanceInMetersAccordionBoxTitleStringProperty ),
      expandedProperty: model.isAccordionBoxExpandedProperty,
      fill: CAVColors.meanAndMedianAccordionBoxFillProperty
    } );
  }
}

centerAndVariability.register( 'MedianAccordionBox', MedianAccordionBox );