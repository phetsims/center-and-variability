// Copyright 2023-2025, University of Colorado Boulder

/**
 * The MedianAccordionBox is an accordion box designed for the Median screen.
 * It is responsible for rendering cards that users can drag and sort. Additionally,
 * it provides checkboxes that empower users to visualize the median in a sorted set of cards.
 *
 * Main features:
 * - Draggable and sortable cards.
 * - Visualization controls for the median in a sorted card set.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import AccordionBoxTitleNode from '../../common/view/AccordionBoxTitleNode.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVInfoButton from '../../common/view/CAVInfoButton.js';
import MedianModel from '../model/MedianModel.js';
import InteractiveCardNodeContainer from './InteractiveCardNodeContainer.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class MedianAccordionBox extends CAVAccordionBox {
  public readonly infoButton: ButtonNode;

  public constructor( model: MedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEDIAN;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape, CAVColors.meanAndMedianAccordionBoxFillProperty );

    const cardNodeContainer = new InteractiveCardNodeContainer( model.interactiveCardContainerModel, model.isSortingDataProperty,
      model.selectedSceneModelProperty.value, model.medianVisibleProperty, {

        // Expose this intermediate layer to make it so that clients can hide the number cards with one call
        tandem: tandem.createTandem( 'cardNodeContainer' ),
        y: backgroundShape.bounds.centerY - 20
      } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getSortDataCheckboxItem( model.isSortingDataProperty ),
      AccordionBoxCheckboxFactory.getMedianCheckboxWithoutIconItem( model.medianVisibleProperty, model.selectedSceneModelProperty )
    ], {
      tandem: tandem.createTandem( 'checkboxGroup' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    const checkboxGroupAlignBox = new AlignBox( checkboxGroup, {
      alignBounds: backgroundShape.bounds,
      xAlign: 'right',
      yAlign: 'center'
    } );

    const infoButton = new CAVInfoButton( model.infoButtonPressedEmitter, backgroundShape, {
      tandem: tandem.createTandem( 'infoButton' ),
      accessibleName: CenterAndVariabilityFluent.a11y.medianScreen.infoButton.accessibleNameStringProperty
    } );

    backgroundNode.addChild( infoButton );
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

    // for pdom order
    this.infoButton = infoButton;

    backgroundNode.setPDOMOrder( [
      cardNodeContainer.medianTextNode,
      cardNodeContainer,
      checkboxGroupAlignBox
    ] );
  }
}

centerAndVariability.register( 'MedianAccordionBox', MedianAccordionBox );