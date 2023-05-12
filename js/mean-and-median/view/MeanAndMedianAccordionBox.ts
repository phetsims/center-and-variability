// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import { AlignGroup, Node, Path, Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import MeanAndMedianPlotNode from './MeanAndMedianPlotNode.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import CAVConstants from '../../common/CAVConstants.js';

const MARGIN = 12.5;

export default class MeanAndMedianAccordionBox extends CAVAccordionBox {
  private readonly medianPlotNode: MeanAndMedianPlotNode;

  public constructor( model: MeanAndMedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number, playAreaNumberLineNode: Node ) {
    const iconGroup = new AlignGroup();

    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEAN_AND_OR_MEDIAN;
    const backgroundNode = new Path( backgroundShape, {
      clipArea: backgroundShape,
      fill: null
    } );

    // There is only one scene in the mean and median screen
    const sceneModel = model.selectedSceneModelProperty.value;

    const meanAndMedianPlotNode = new MeanAndMedianPlotNode( model, sceneModel, {
      tandem: tandem.createTandem( 'plotNode' )
    } ).mutate( {
      bottom: backgroundNode.height
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getMedianCheckboxWithIconItem( iconGroup, model.isTopMedianVisibleProperty ),
      AccordionBoxCheckboxFactory.getMeanCheckboxWithIconItem( iconGroup, model.isTopMeanVisibleProperty )
    ], {
      tandem: tandem.createTandem( 'accordionCheckboxGroup' ),
      right: backgroundNode.width - MARGIN,
      centerY: backgroundNode.height / 2
    } );

    backgroundNode.addChild( checkboxGroup );
    backgroundNode.addChild( meanAndMedianPlotNode );

    super( backgroundNode, {
        titleNode: new Text( CenterAndVariabilityStrings.distanceInMetersStringProperty, {
          font: new PhetFont( 16 ),
          maxWidth: 300
        } ),
        tandem: tandem,
        top: top,
        centerX: layoutBounds.centerX
      }
    );

    this.medianPlotNode = meanAndMedianPlotNode;
  }

  public alignWithPlayAreaNumberLineNode( x: number ): void {
    this.medianPlotNode.alignWithPlayAreaNumberLineNode( x );
  }
}

centerAndVariability.register( 'MeanAndMedianAccordionBox', MeanAndMedianAccordionBox );