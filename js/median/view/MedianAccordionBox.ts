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
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';

export default class MedianAccordionBox extends CAVAccordionBox {
  public readonly infoButton: ButtonNode;

  public constructor( model: MedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEDIAN;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape, CAVColors.meanAndMedianAccordionBoxFillProperty );

    const cardNodeContainer = new CardNodeContainer( model.cardContainerModel, model.isSortingDataProperty,
      model.selectedSceneModelProperty.value, model.isTopMedianVisibleProperty, {

        // Expose this intermediate layer to make it so that clients can hide the number cards with one call
        tandem: tandem.createTandem( 'cardNodeContainer' ),
        y: backgroundShape.bounds.centerY - 5
      } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getSortDataCheckboxItem( model.isSortingDataProperty ),
      AccordionBoxCheckboxFactory.getMedianCheckboxWithoutIconItem( model.isTopMedianVisibleProperty, model )
    ], {
      tandem: tandem.createTandem( 'checkboxGroup' )
    } );

    const checkboxGroupAlignBox = new AlignBox( checkboxGroup, {
      alignBounds: backgroundShape.bounds,
      xAlign: 'right',
      yAlign: 'center'
    } );

    const infoButton = new CAVInfoButton( model.isInfoVisibleProperty, backgroundShape, tandem.createTandem( 'infoButton' ) );

    backgroundNode.addChild( infoButton );
    backgroundNode.addChild( cardNodeContainer );
    backgroundNode.addChild( checkboxGroupAlignBox );

    super( backgroundNode, {
      tandem: tandem,
      top: top,
      centerX: layoutBounds.centerX,
      titleNode: new AccordionBoxTitleNode( CenterAndVariabilityStrings.distanceInMetersAccordionBoxTitleStringProperty, CAVColors.meanAndMedianAccordionBoxFillProperty, tandem ),
      expandedProperty: model.isAccordionBoxExpandedProperty,
      fill: CAVColors.meanAndMedianAccordionBoxFillProperty
    } );

    // for pdom order
    this.infoButton = infoButton;
  }
}

centerAndVariability.register( 'MedianAccordionBox', MedianAccordionBox );