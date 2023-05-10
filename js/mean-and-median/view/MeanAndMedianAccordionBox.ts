// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import { AlignGroup, Color, Node, Path, Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import MedianPlotNode from './MedianPlotNode.js';
import TopRepresentationCheckboxGroup from '../../common/view/TopRepresentationCheckboxGroup.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import CAVConstants from '../../common/CAVConstants.js';

const MARGIN = 12.5;

export default class MeanAndMedianAccordionBox extends CAVAccordionBox {
  private readonly medianPlotNode: MedianPlotNode;

  public constructor( model: MeanAndMedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number, playAreaNumberLineNode: Node ) {
    const iconGroup = new AlignGroup();

    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEAN_AND_OR_MEDIAN;
    const backgroundNode = new Path( backgroundShape, {
      clipArea: backgroundShape,
      fill: new Color( 255, 0, 0, 0.2 )
    } );

    // There is only one scene in the mean and median screen
    const sceneModel = model.selectedSceneModelProperty.value;

    // TODO: https://github.com/phetsims/center-and-variability/issues/170 Why is this called the MedianPlotNode?
    const medianPlotNode = new MedianPlotNode( model, sceneModel, {
      tandem: tandem.createTandem( 'plotNode' )
    } ).mutate( {
      bottom: backgroundNode.height
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      TopRepresentationCheckboxGroup.getMedianCheckboxWithIconItem( iconGroup, model.isShowingTopMedianProperty ),
      TopRepresentationCheckboxGroup.getMeanCheckboxWithIconItem( iconGroup, model.isShowingTopMeanProperty )
    ], {
      tandem: tandem.createTandem( 'accordionCheckboxGroup' ),
      right: backgroundNode.width - MARGIN,
      centerY: backgroundNode.height / 2
    } );

    backgroundNode.addChild( checkboxGroup );
    backgroundNode.addChild( medianPlotNode );

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

    this.medianPlotNode = medianPlotNode;
  }

  public alignWithPlayAreaNumberLineNode( x: number ): void {
    this.medianPlotNode.alignWithPlayAreaNumberLineNode( x );
  }
}

centerAndVariability.register( 'MeanAndMedianAccordionBox', MeanAndMedianAccordionBox );