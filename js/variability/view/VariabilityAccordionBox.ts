// Copyright 2023, University of Colorado Boulder

import { AlignBox, AlignGroup, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import VariabilityReadoutText from './VariabilityReadoutText.js';
import CAVColors from '../../common/CAVColors.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVConstants from '../../common/CAVConstants.js';
import SoccerSceneModel from '../../soccer-common/model/SoccerSceneModel.js';
import Utils from '../../../../dot/js/Utils.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VariabilityMeasureCheckbox from './VariabilityMeasureCheckbox.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import AccordionBoxTitleText from '../../common/view/AccordionBoxTitleText.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import CAVInfoButton from '../../common/view/CAVInfoButton.js';

export default class VariabilityAccordionBox extends CAVAccordionBox {

  private readonly plotToggleNode: ToggleNode<SoccerSceneModel, VariabilityPlotNode>;

  public constructor( model: VariabilityModel, layoutBounds: Bounds2, tandem: Tandem, top: number, playAreaNumberLineNode: NumberLineNode ) {

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_VARIABILITY;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape, CAVColors.variabilityAccordionBoxFillProperty );

    // Determine which title string we are showing based off the selectedVariabilityMeasure
    const currentProperty = new DerivedProperty( [ model.selectedVariabilityMeasureProperty ], selectedVariability =>
      selectedVariability === VariabilityMeasure.RANGE ? CenterAndVariabilityStrings.rangeStringProperty :
      selectedVariability === VariabilityMeasure.IQR ? CenterAndVariabilityStrings.interquartileRangeIQRStringProperty :
      CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty
    );

    const accordionBoxTitleProperty = new DynamicProperty<string, unknown, unknown>( currentProperty );

    const contents = _.range( 4 ).map( i => {
      return {
        value: model.sceneModels[ i ],
        createNode: ( tandem: Tandem ) => new VariabilityPlotNode( model, model.variabilitySceneModels[ i ], playAreaNumberLineNode, {
          tandem: tandem,
          bottom: backgroundShape.bounds.height
        } ),

        tandemName: 'plotNode' + ( i + 1 )
      };
    } );

    const plotToggleNode = new ToggleNode( model.selectedSceneModelProperty, contents, {
      bottom: backgroundShape.bounds.height,
      tandem: tandem.createTandem( 'plotToggleNode' )
    } );

    backgroundNode.addChild( new CAVInfoButton( model.isInfoVisibleProperty, backgroundShape, tandem.createTandem( 'infoButton' ) ) );

    // Ensure a consistent width among both the icons and the text across the different accordionBox views.
    const textGroup = new AlignGroup();
    const iconGroup = new AlignGroup();

    const checkboxToggleNode = new AlignBox( new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      createNode: tandem => new VariabilityMeasureCheckbox( model.isRangeVisibleProperty,
        CenterAndVariabilityStrings.rangeStringProperty, iconGroup, textGroup, CAVColors.rangeFillProperty, { tandem: tandem } ),
      tandemName: 'rangeAccordionCheckbox',
      value: VariabilityMeasure.RANGE
    }, {
      createNode: tandem => new VariabilityMeasureCheckbox( model.isIQRVisibleProperty,
        CenterAndVariabilityStrings.iqrStringProperty, iconGroup, textGroup, CAVColors.iqrColorProperty, { tandem: tandem } ),
      tandemName: 'iqrAccordionCheckbox',
      value: VariabilityMeasure.IQR
    }, {
      createNode: tandem => new VariabilityMeasureCheckbox( model.isMADVisibleProperty,
        CenterAndVariabilityStrings.madStringProperty, iconGroup, textGroup, CAVColors.madRectangleColorProperty, { tandem: tandem } ),
      tandemName: 'madAccordionCheckbox',
      value: VariabilityMeasure.MAD
    } ], {
      alignChildren: ToggleNode.RIGHT
    } ), { alignBounds: backgroundShape.bounds, xAlign: 'right', yAlign: 'center' } );

    backgroundNode.addChild( plotToggleNode );
    backgroundNode.addChild( checkboxToggleNode );

    const deriveValueProperty = ( accessor: ( variabilitySceneModel: VariabilitySceneModel ) => TReadOnlyProperty<number | null>, roundToDecimal = 0 ) => {
      return DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( accessor ), CenterAndVariabilityStrings.valueUnknownStringProperty ], () => {
        const result = accessor( model.selectedSceneModelProperty.value as VariabilitySceneModel ).value;
        const resultRounded = result !== null && roundToDecimal > 0 ? Utils.toFixed( result, roundToDecimal ) : result;
        return resultRounded === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value : resultRounded;
      } );
    };

    const rangeValueProperty = deriveValueProperty( vsm => vsm.rangeValueProperty );
    const medianValueProperty = deriveValueProperty( vsm => vsm.medianValueProperty );
    const iqrValueProperty = deriveValueProperty( vsm => vsm.iqrValueProperty );
    const madValueProperty = deriveValueProperty( vsm => vsm.madValueProperty, 1 );
    const meanValueProperty = deriveValueProperty( vsm => vsm.meanValueProperty, 1 );

    const readoutsToggleNode = new AlignBox( new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      tandemName: 'rangeReadoutToggleNode',
      createNode: tandem => {
        const rangeEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.rangeEqualsValuePatternStringProperty,
          { value: rangeValueProperty }, {
            tandem: tandem.createTandem( 'rangeEqualsValueStringProperty' )
          }
        );

        const rangeReadoutText = new VariabilityReadoutText( rangeEqualsValueStringProperty, {
          fill: CAVColors.meanColorProperty,
          visibleProperty: model.isRangeVisibleProperty,
          tandem: tandem.createTandem( 'rangeReadoutText' )
        } );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new VBox( {
          align: 'left',
          spacing: 10,
          children: [ rangeReadoutText ]
        } );
      }
    }, {
      value: VariabilityMeasure.IQR,
      tandemName: 'iqrReadoutToggleNode',
      createNode: tandem => {

        const medianEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty,
          { value: medianValueProperty }, {
            tandem: tandem.createTandem( 'medianEqualsValueStringProperty' )
          }
        );
        const medianReadoutText = new VariabilityReadoutText( medianEqualsValueStringProperty, {
          fill: CAVColors.medianColorProperty,
          tandem: tandem.createTandem( 'medianReadoutText' )
        } );

        const iqrEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.iqrEqualsValuePatternStringProperty,
          { value: iqrValueProperty }, {
            tandem: tandem.createTandem( 'iqrEqualsValueStringProperty' )
          }
        );
        const iqrReadoutText = new VariabilityReadoutText( iqrEqualsValueStringProperty, {
          fill: CAVColors.iqrLabelColorProperty,
          visibleProperty: model.isIQRVisibleProperty,
          tandem: tandem.createTandem( 'iqrReadoutText' )
        } );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new VBox( {
          align: 'left',
          spacing: 10,
          excludeInvisibleChildrenFromBounds: false,
          children: [
            medianReadoutText,
            iqrReadoutText
          ]
        } );
      }
    }, {
      value: VariabilityMeasure.MAD,
      tandemName: 'madReadoutToggleNode',
      createNode: tandem => {

        const meanEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.meanEqualsValuePatternStringProperty,
          { value: meanValueProperty }, {
            tandem: tandem.createTandem( 'meanEqualsValueStringProperty' )
          }
        );
        const madEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.madEqualsValuePatternStringProperty,
          { value: madValueProperty }, {
            tandem: tandem.createTandem( 'madEqualsValueStringProperty' )
          }
        );

        const meanReadoutText = new VariabilityReadoutText( meanEqualsValueStringProperty, {
          fill: CAVColors.meanColorProperty,
          tandem: tandem.createTandem( 'meanReadoutText' )
        } );
        const madReadoutText = new VariabilityReadoutText( madEqualsValueStringProperty, {
          fill: CAVColors.madColorProperty,
          visibleProperty: model.isMADVisibleProperty,
          tandem: tandem.createTandem( 'madReadoutText' )
        } );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new VBox( {
          spacing: 10,
          align: 'left',
          excludeInvisibleChildrenFromBounds: false,
          children: [
            meanReadoutText,
            madReadoutText
          ]
        } );
      }
    } ], {
      alignChildren: ToggleNode.NONE,
      tandem: tandem.createTandem( 'readoutsToggleNode' )
    } ), { alignBounds: backgroundShape.bounds, xAlign: 'left', yAlign: 'center' } );

    backgroundNode.addChild( readoutsToggleNode );

    super( backgroundNode, {
      tandem: tandem,
      titleNode: new AccordionBoxTitleText( accordionBoxTitleProperty ),
      expandedProperty: model.isAccordionBoxExpandedProperty,

      // Leave space for the radio buttons at the left
      left: 65,
      fill: CAVColors.variabilityAccordionBoxFillProperty
    } );

    this.plotToggleNode = plotToggleNode;
  }
}

centerAndVariability.register( 'VariabilityAccordionBox', VariabilityAccordionBox );