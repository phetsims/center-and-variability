// Copyright 2023, University of Colorado Boulder

import { AlignGroup, Color, Path, Text, VBox, Node } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import AccordionBoxCheckboxFactory from '../../common/view/AccordionBoxCheckboxFactory.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VariabilityReadoutText from './VariabilityReadoutText.js';
import CAVColors from '../../common/CAVColors.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVSceneModel from '../../common/model/CAVSceneModel.js';

export default class VariabilityAccordionBox extends CAVAccordionBox {

  // private plotNode: Node;
  private plotToggleNode: ToggleNode<CAVSceneModel, VariabilityPlotNode>;

  public constructor( model: VariabilityModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_VARIABILITY;
    const backgroundNode = new Path( backgroundShape, {
      clipArea: backgroundShape,
      fill: new Color( 255, 0, 0, 0.2 )
    } );

    const currentProperty = new DerivedProperty( [ model.selectedVariabilityProperty ], selectedVariability =>
      selectedVariability === VariabilityMeasure.RANGE ? CenterAndVariabilityStrings.rangeStringProperty :
      selectedVariability === VariabilityMeasure.IQR ? CenterAndVariabilityStrings.interquartileRangeIQRStringProperty :
      CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty
    );

    const accordionBoxTitleProperty = new DynamicProperty<string, unknown, unknown>( currentProperty );

    const contents = _.range( 4 ).map( i => {
      return {
        value: model.sceneModels[ i ],
        createNode: ( tandem: Tandem ) => new VariabilityPlotNode( model, model.variabilitySceneModels[ i ], {
          tandem: tandem.createTandem( 'plotNode' + i ),
          bottom: backgroundNode.height
        } )
      };
    } );

    const plotToggleNode = new ToggleNode( model.selectedSceneModelProperty, contents, {
      bottom: backgroundNode.height
    } );

    const infoButton = new InfoButton( {
      iconFill: 'cornflowerblue',
      scale: 0.5,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'infoButton' ),
      listener: () => {
        model.isInfoShowingProperty.value = true;
      },

      // TODO: How to position this properly? Can we use AlignBox? See https://github.com/phetsims/center-and-variability/issues/170
      top: 0,
      right: backgroundNode.right
    } );
    backgroundNode.addChild( infoButton );

    const iconGroup = new AlignGroup();
    const checkboxToggleNode = new ToggleNode( model.selectedVariabilityProperty, [ {

      // TODO: Why should these be "group"? see https://github.com/phetsims/center-and-variability/issues/170
      createNode: tandem => new VerticalCheckboxGroup( [
        AccordionBoxCheckboxFactory.getRangeCheckboxWithIconItem( iconGroup, model.isShowingRangeProperty )
      ], { tandem: tandem.createTandem( 'rangeAccordionCheckboxGroup' ) } ),
      tandemName: 'rangeAccordionCheckboxGroup',
      value: VariabilityMeasure.RANGE
    }, {
      createNode: tandem => new VerticalCheckboxGroup( [
        AccordionBoxCheckboxFactory.getIQRCheckboxWithIconItem( iconGroup, model.isShowingIQRProperty )
      ], { tandem: tandem.createTandem( 'iqrAccordionCheckboxGroup' ) } ),
      tandemName: 'iqrAccordionCheckboxGroup',
      value: VariabilityMeasure.IQR
    }, {
      createNode: tandem => new VerticalCheckboxGroup( [
        AccordionBoxCheckboxFactory.getMADCheckboxWithIconItem( iconGroup, model.isShowingMADProperty )
      ], { tandem: tandem.createTandem( 'madAccordionCheckboxGroup' ) } ),
      tandemName: 'madAccordionCheckboxGroup',
      value: VariabilityMeasure.MAD
    } ], {
      rightCenter: backgroundNode.rightCenter.plusXY( -10, 0 ),
      alignChildren: ToggleNode.LEFT
    } );

    // Since the title is visible while the accordion box is open, this background will not any area above the bottom of
    // the expand/collapse button. To vertically-center things, make a new set of bounds that includes the missing space.
    // Values come from the height of the expand/collapse button plus the y margin above and below it. Also add the
    // horizontal content margin that is not part of backgroundNode so these bounds are the full area of the accordion box.
    // const fullBackgroundBounds =
    //   backgroundNode.localBounds.withOffsets( CONTENT_MARGIN, CONTENT_MARGIN * 2 + BUTTON_SIDE_LENGTH, CONTENT_MARGIN, 0 );

    // add clip area so dot stacks that are taller than the accordion box are clipped appropriately
    // backgroundNode.clipArea = Shape.bounds( fullBackgroundBounds );

    // plotToggleNode.bottom = backgroundNode.height;

    // Will later be centered by a ManualConstraint to align with the one in the play area
    // plotToggleNode.left = backgroundNode.left;
    backgroundNode.addChild( plotToggleNode );
    backgroundNode.addChild( checkboxToggleNode );

    const rangeValueProperty = DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( vsm => vsm.rangeValueProperty ) ], () => {
      return model.selectedSceneModelProperty.value.rangeValueProperty.value;
    } );

    const medianValueProperty = DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( vsm => vsm.medianValueProperty ) ], () => {
      return model.selectedSceneModelProperty.value.medianValueProperty.value;
    } );

    const iqrValueProperty = DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( vsm => vsm.iqrValueProperty ) ], () => {
      return model.selectedSceneModelProperty.value.iqrValueProperty.value;
    } );

    const madValueProperty = DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( vsm => vsm.madValueProperty ) ], () => {
      return model.selectedSceneModelProperty.value.madValueProperty.value;
    } );

    // TODO: Why can't this infer the type parameter? See https://github.com/phetsims/center-and-variability/issues/170
    const readoutsToggleNode = new ToggleNode<VariabilityMeasure>( model.selectedVariabilityProperty, [ {
      value: VariabilityMeasure.RANGE,
      tandemName: 'rangeReadoutToggleNode',
      createNode: tandem => {
        const rangeReadoutValueProperty = new DerivedProperty( [ rangeValueProperty ],
          rangeValue => rangeValue === null ? '?' : `${rangeValue}`
        );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new Node( {
          children: [ new VariabilityReadoutText( rangeReadoutValueProperty,
            CenterAndVariabilityStrings.rangeEqualsValuePatternStringProperty, {
              fill: CAVColors.meanColorProperty,
              visibleProperty: model.isShowingRangeProperty,
              left: 0,
              centerY: backgroundNode.height / 2,
              tandem: tandem.createTandem( 'rangeReadoutText' )
            } ) ]
        } );
      }
    }, {
      value: VariabilityMeasure.IQR,
      tandemName: 'iqrReadoutToggleNode',
      createNode: tandem => {
        const textReadoutGroup = new VBox( {
          align: 'left',
          spacing: 10
        } );

        const medianReadoutValueProperty = new DerivedProperty( [ medianValueProperty ],
          medianValue => medianValue === null ? '?' : `${medianValue}`
        );
        const iqrReadoutValueProperty = new DerivedProperty( [ iqrValueProperty ], iqrValue => {
          return iqrValue ? `${iqrValue}` : '?';
        } );

        const medianReadoutText = new VariabilityReadoutText( medianReadoutValueProperty, CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty, {
          fill: CAVColors.medianColorProperty
          // tandem: options.tandem.createTandem( 'medianReadoutText' )
        } );
        const iqrReadoutText = new VariabilityReadoutText( iqrReadoutValueProperty, CenterAndVariabilityStrings.iqrEqualsValuePatternStringProperty, {
          fill: CAVColors.iqrColorProperty,
          visibleProperty: model.isShowingIQRProperty
          // tandem: options.tandem.createTandem( 'iqrReadoutText' )
        } );

        textReadoutGroup.addChild( medianReadoutText );
        textReadoutGroup.addChild( iqrReadoutText );

        return textReadoutGroup;
      }
    }, {
      value: VariabilityMeasure.MAD,
      tandemName: 'madReadoutToggleNode',
      createNode: tandem => {
        const madReadoutValueProperty = new DerivedProperty( [ madValueProperty ], madValue => {
          return madValue ? `${madValue}` : '?';
        } );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new Node( {
          children: [ new VariabilityReadoutText( madReadoutValueProperty,
            CenterAndVariabilityStrings.meanEqualsValuePatternStringProperty, {
              fill: CAVColors.meanColorProperty,
              visibleProperty: model.isShowingMADProperty
              // tandem: options.tandem.createTandem( 'rangeReadoutText' )
            } ) ]
        } );
      }
    } ], {
      left: 5
    } );

    backgroundNode.addChild( readoutsToggleNode );

    super( backgroundNode, {
      tandem: tandem,
      titleNode: new Text( accordionBoxTitleProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } ),
      left: 100
    } );

    this.plotToggleNode = plotToggleNode;
  }

  // TODO https://github.com/phetsims/center-and-variability/issues/170 do the checkboxes in the accordion box need to
  // align with the checkboxes in the play area?  If so, consider laying out "accordion box" items in the play area,
  // and just pretending they are in the accordion box?
  public alignWithPlayAreaNumberLineNode( x: number ): void {
    this.plotToggleNode.nodes.forEach( plotNode => plotNode.alignWithPlayAreaNumberLineNode( x ) );
  }
}

centerAndVariability.register( 'VariabilityAccordionBox', VariabilityAccordionBox );