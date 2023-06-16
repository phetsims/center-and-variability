// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import { AlignGroup, Text, TPaint, VBox } from '../../../../scenery/js/imports.js';
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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVColors from '../../common/CAVColors.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import AccordionBoxTitleText from '../../common/view/AccordionBoxTitleText.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';

export default class MeanAndMedianAccordionBox extends CAVAccordionBox {
  private readonly medianPlotNode: MeanAndMedianPlotNode;

  public constructor( model: MeanAndMedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number, playAreaNumberLineNode: NumberLineNode ) {
    const iconGroup = new AlignGroup();
    const textGroup = new AlignGroup();

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEAN_AND_OR_MEDIAN;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape, CAVColors.meanAndMedianAccordionBoxFillProperty );

    // There is only one scene in the mean and median screen
    const sceneModel = model.selectedSceneModelProperty.value;

    const meanAndMedianPlotNode = new MeanAndMedianPlotNode( model, sceneModel, playAreaNumberLineNode, {
      dataPointFill: 'black',
      tandem: tandem.createTandem( 'plotNode' )
    } ).mutate( {
      bottom: backgroundShape.bounds.height
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getMedianCheckboxWithIconItem( iconGroup, textGroup, model.isTopMedianVisibleProperty, model ),
      AccordionBoxCheckboxFactory.getMeanCheckboxWithIconItem( iconGroup, textGroup, model.isTopMeanVisibleProperty, model )
    ], {
      tandem: tandem.createTandem( 'accordionCheckboxGroup' ),
      right: backgroundShape.bounds.width - CAVConstants.ACCORDION_BOX_HORIZONTAL_MARGIN,
      centerY: backgroundShape.bounds.centerY
    } );

    backgroundNode.addChild( checkboxGroup );
    backgroundNode.addChild( meanAndMedianPlotNode );

    const createReadoutText = ( valueProperty: TReadOnlyProperty<number | null>, visibleProperty: TReadOnlyProperty<boolean>,
                                templateStringProperty: LinkableProperty<string>, fill: TPaint, readoutTandem: Tandem ) => {

      const readoutProperty = new DerivedProperty( [ valueProperty, CenterAndVariabilityStrings.valueUnknownStringProperty ],
        ( value, valueUnknownString ) => {
          return value === null ? valueUnknownString : Utils.toFixed( value, 1 );
        } );
      const readoutPatternStringProperty = new PatternStringProperty( templateStringProperty, { value: readoutProperty }, {
        tandem: readoutTandem
      } );

      return new Text( readoutPatternStringProperty, {
        fill: fill,
        font: new PhetFont( 16 ),
        maxWidth: 170,
        visibleProperty: visibleProperty
      } );
    };

    const readoutsNode = new VBox( {
      align: 'left',
      spacing: 8,
      excludeInvisibleChildrenFromBounds: false,
      children: [
        createReadoutText(
          sceneModel.medianValueProperty,
          model.isTopMedianVisibleProperty,
          CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty,
          CAVColors.medianColorProperty,
          tandem.createTandem( 'medianReadoutStringProperty' )
        ),
        createReadoutText(
          sceneModel.meanValueProperty,
          model.isTopMeanVisibleProperty,
          CenterAndVariabilityStrings.meanEqualsValuePatternStringProperty,
          CAVColors.meanColorProperty,
          tandem.createTandem( 'meanReadoutStringProperty' )
        )
      ],
      leftCenter: backgroundShape.bounds.leftCenter.plusXY( CAVConstants.ACCORDION_BOX_HORIZONTAL_MARGIN, 0 )
    } );

    backgroundNode.addChild( readoutsNode );

    super( backgroundNode, {
        titleNode: new AccordionBoxTitleText( CenterAndVariabilityStrings.distanceInMetersAccordionBoxTitleStringProperty ),
        tandem: tandem,
        top: top,
        centerX: layoutBounds.centerX,
        expandedProperty: model.isAccordionBoxExpandedProperty,
        fill: CAVColors.meanAndMedianAccordionBoxFillProperty
      }
    );

    this.medianPlotNode = meanAndMedianPlotNode;
  }
}

centerAndVariability.register( 'MeanAndMedianAccordionBox', MeanAndMedianAccordionBox );