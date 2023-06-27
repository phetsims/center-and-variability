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
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxTitleNode from '../../common/view/AccordionBoxTitleNode.js';
import CAVColors from '../../common/CAVColors.js';
import CAVInfoButton from '../../common/view/CAVInfoButton.js';
import { AlignBox } from '../../../../scenery/js/imports.js';

export default class MedianAccordionBox extends CAVAccordionBox {
  private readonly cardNodeContainer: CardNodeContainer;

  public constructor( model: MedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEDIAN;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape, CAVColors.meanAndMedianAccordionBoxFillProperty );

    const cardNodeContainer = new CardNodeContainer( model, {

      // Expose this intermediate layer to make it so that clients can hide the number cards with one call
      tandem: tandem.createTandem( 'cardNodeContainer' ),
      x: CAVConstants.ACCORDION_BOX_HORIZONTAL_MARGIN,
      y: backgroundShape.bounds.centerY - 5,
      parentContext: 'accordion'
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getSortDataCheckboxItem( model.isSortingDataProperty, model.sceneModels[ 0 ], cardNodeContainer ),
      AccordionBoxCheckboxFactory.getMedianCheckboxWithoutIconItem( model.isTopMedianVisibleProperty, model )
    ], {
      tandem: tandem.createTandem( 'checkboxGroup' )
    } );

    const checkboxGroupAlignBox = new AlignBox( checkboxGroup, {
      alignBounds: backgroundShape.bounds,
      xAlign: 'right',
      yAlign: 'center',
      margin: CAVConstants.ACCORDION_BOX_HORIZONTAL_MARGIN
    } );

    backgroundNode.addChild( new CAVInfoButton( model.isInfoVisibleProperty, backgroundShape, tandem.createTandem( 'infoButton' ) ) );

    backgroundNode.addChild( cardNodeContainer );
    backgroundNode.addChild( checkboxGroupAlignBox );

    super( backgroundNode, {
      tandem: tandem,
      top: top,
      centerX: layoutBounds.centerX,
      titleNode: new AccordionBoxTitleNode( CenterAndVariabilityStrings.distanceInMetersAccordionBoxTitleStringProperty, CAVColors.meanAndMedianAccordionBoxFillProperty ),
      expandedProperty: model.isAccordionBoxExpandedProperty,
      fill: CAVColors.meanAndMedianAccordionBoxFillProperty
    } );

    this.cardNodeContainer = cardNodeContainer;
  }

  public step( dt: number ): void {
    this.cardNodeContainer.step( dt );
  }
}

centerAndVariability.register( 'MedianAccordionBox', MedianAccordionBox );