// Copyright 2023-2025, University of Colorado Boulder

/**
 * VariabilityAccordionBox is a specialized accordion box for the Variability Screen. It visualizes
 * data measures such as Range, IQR, and MAD using dynamic graphical representations. The accordion box
 * creates four plot nodes for each data measure, facilitating user interactions and scene-specific data views.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty, { UnknownDerivedProperty } from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import HighlightFromNode from '../../../../scenery/js/accessibility/HighlightFromNode.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants from '../../common/CAVConstants.js';
import AccordionBoxTitleNode from '../../common/view/AccordionBoxTitleNode.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVInfoButton from '../../common/view/CAVInfoButton.js';
import CAVToggleNode from '../../common/view/CAVToggleNode.js';
import IntervalToolModel from '../model/IntervalToolModel.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import IntervalToolRectangle from './IntervalToolRectangle.js';
import VariabilityMeasureCheckbox from './VariabilityMeasureCheckbox.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import VariabilityReadoutText from './VariabilityReadoutText.js';
import FluentPattern from '../../../../chipper/js/browser/FluentPattern.js';

export default class VariabilityAccordionBox extends CAVAccordionBox {

  public readonly infoButton: ButtonNode;
  private readonly intervalToolNode: IntervalToolRectangle;

  public constructor( model: VariabilityModel, intervalToolModel: IntervalToolModel, tandem: Tandem, playAreaNumberLineNode: NumberLineNode ) {

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

    const intervalToolNode = new IntervalToolRectangle( intervalToolModel.handle1ValueProperty,
      intervalToolModel.handle2ValueProperty, CAVConstants.PLOT_NODE_TRANSFORM, new Property( -18 ),
      new BooleanProperty( false ), {
        focusable: false,
        visibleProperty: intervalToolModel.isVisibleProperty,
        enabledProperty: intervalToolModel.isTranslationEnabledProperty,
        tandem: tandem.createTandem( 'intervalToolNode' )
      } );

    const contents = _.range( model.variabilitySceneModels.length ).map( i => {
      return {
        value: model.sceneModels[ i ],
        createNode: () => {
          return new VariabilityPlotNode( model, model.variabilitySceneModels[ i ], playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, intervalToolNode, {
            bottom: backgroundShape.bounds.height
          } );
        }
      };
    } );

    const plotToggleNode = new CAVToggleNode( model.selectedSceneModelProperty, contents, {
      bottom: backgroundShape.bounds.height
    } );

    const checkboxesTandem = tandem.createTandem( 'checkboxes' );
    const checkboxToggleNode = new AlignBox( new CAVToggleNode( model.selectedVariabilityMeasureProperty, [ {
      createNode: () => CAVConstants.ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP.createBox( new VariabilityMeasureCheckbox( model.isRangeVisibleProperty,
        CenterAndVariabilityStrings.rangeStringProperty, CAVColors.rangeFillProperty,
        {
          tandem: checkboxesTandem.createTandem( 'rangeCheckbox' ),
          accessibleHelpText: CenterAndVariabilityFluent.a11y.variabilityScreen.rangeCheckbox.accessibleHelpTextStringProperty
        } ), { yAlign: 'top' } ),
      value: VariabilityMeasure.RANGE
    }, {
      createNode: () => CAVConstants.ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP.createBox( new VariabilityMeasureCheckbox( model.isIQRVisibleProperty,
        CenterAndVariabilityStrings.iqrStringProperty, CAVColors.iqrColorProperty,
        {
          tandem: checkboxesTandem.createTandem( 'iqrCheckbox' ),
          accessibleHelpText: CenterAndVariabilityFluent.a11y.variabilityScreen.iqrCheckbox.accessibleHelpTextStringProperty
        } ), { yAlign: 'top' } ),
      value: VariabilityMeasure.IQR
    }, {
      createNode: () => CAVConstants.ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP.createBox( new VariabilityMeasureCheckbox( model.isMADVisibleProperty,
        CenterAndVariabilityStrings.madStringProperty, CAVColors.madRectangleColorProperty,
        {
          tandem: checkboxesTandem.createTandem( 'madCheckbox' ),
          accessibleHelpText: CenterAndVariabilityFluent.a11y.variabilityScreen.madCheckbox.accessibleHelpTextStringProperty
        } ), { yAlign: 'top' } ),
      value: VariabilityMeasure.MAD
    } ], {
      alignChildren: ToggleNode.RIGHT
    } ), { alignBounds: backgroundShape.bounds, xAlign: 'right', yAlign: 'center' } );

    backgroundNode.addChild( plotToggleNode );
    backgroundNode.addChild( checkboxToggleNode );

    // We want the data points to fade out of the accordion box when a data point stack gets too high to indicate that
    // more data points exist that may not be visible.
    const topGradient = new LinearGradient( 0, backgroundShape.bounds.minY, 0, backgroundShape.bounds.minY + 30 ).addColorStop( 0.15, CAVColors.variabilityAccordionBoxFillProperty )
      .addColorStop( 1, CAVColors.variabilityAccordionBottomGradientColorProperty );
    const gradientRectangle = new Rectangle( 0, backgroundShape.bounds.minY, backgroundShape.bounds.maxX, backgroundShape.bounds.minY + 5, { fill: topGradient } );
    backgroundNode.addChild( gradientRectangle );

    const infoButton = new CAVInfoButton( model.infoButtonPressedEmitter, backgroundShape, {
      tandem: tandem.createTandem( 'infoButton' ),
      accessibleName: CenterAndVariabilityFluent.a11y.variabilityScreen.infoButton.accessibleName.createProperty( {
        measure: accordionBoxTitleProperty
      } )
    } );
    backgroundNode.addChild( infoButton );

    const createDerivedValueProperty = ( accessor: ( sceneModel: VariabilitySceneModel ) => TReadOnlyProperty<number | null>, roundToDecimal: number | null ) => {
      return DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( accessor ), CenterAndVariabilityStrings.valueUnknownStringProperty ], () => {
        const value = accessor( model.selectedSceneModelProperty.value ).value;
        return value === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value :
               roundToDecimal === null ? value :
               toFixed( value, roundToDecimal );
      } );
    };
    const createAccessibleParagraphProperty = ( valueProperty: TReadOnlyProperty<number | null>, fluentPattern: FluentPattern<Record<string, unknown>> ) => {
      const valueAccessibleParagraphProperty = new DerivedProperty(
        [ valueProperty ], value => value === null ? 'null' : value );
      return fluentPattern.createProperty( {
        value: valueAccessibleParagraphProperty
      } );
    };

    const rangeValueProperty = createDerivedValueProperty( sceneModel => sceneModel.rangeValueProperty, null );
    const medianValueProperty = createDerivedValueProperty( sceneModel => sceneModel.medianValueProperty, null );
    const iqrValueProperty = createDerivedValueProperty( sceneModel => sceneModel.iqrValueProperty, null );
    const madValueProperty = createDerivedValueProperty( sceneModel => sceneModel.madValueProperty, CAVConstants.VARIABILITY_MEASURE_DECIMAL_POINTS );
    const meanValueProperty = createDerivedValueProperty( sceneModel => sceneModel.meanValueProperty, CAVConstants.VARIABILITY_MEASURE_DECIMAL_POINTS );

    const rangePatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.rangeEqualsValueMPatternStringProperty, {
      value: rangeValueProperty
    } );

    const medianPatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.medianEqualsValueMPatternStringProperty, {
      value: medianValueProperty
    } );

    const iqrPatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.iqrEqualsValueMPatternStringProperty, {
      value: iqrValueProperty
    } );

    const meanPatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.meanEqualsValueMPatternStringProperty, {
      value: meanValueProperty
    } );

    const madPatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.madEqualsValueMPatternStringProperty, {
      value: madValueProperty
    } );

    const deriveStringProperty = ( accessor: ( variabilitySceneModel: VariabilitySceneModel ) => TReadOnlyProperty<number | null>,
                                   valueUnknownStringProperty: TReadOnlyProperty<string>, valuePatternStringProperty: PatternStringProperty<{
        value: UnknownDerivedProperty<number | string>;
      }> ) => {
      return DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( accessor ),
        valuePatternStringProperty, valueUnknownStringProperty ], () => {
        const result = accessor( model.selectedSceneModelProperty.value ).value;
        return result === null ? valueUnknownStringProperty.value : valuePatternStringProperty.value;
      } );
    };

    const readoutsTandem = tandem.createTandem( 'valueReadouts' );
    const readoutsToggleNode = new AlignBox( new CAVToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: () => {
        const rangeEqualsValueStringProperty = deriveStringProperty( vsm => vsm.rangeValueProperty,
          CenterAndVariabilityStrings.rangeEqualsUnknownStringProperty, rangePatternStringProperty );

        const rangeAccessibleParagraphProperty = createAccessibleParagraphProperty(
          new DynamicProperty<number | null, number | null, VariabilitySceneModel>( model.selectedSceneModelProperty, {
            derive: 'rangeValueProperty'
          } ), CenterAndVariabilityFluent.a11y.variabilityScreen.measureAccordionBox.rangeAccessibleParagraph );

        const rangeReadoutText = new VariabilityReadoutText( rangeEqualsValueStringProperty, rangeAccessibleParagraphProperty, {
          fill: CAVColors.rangeReadoutColorProperty,
          visibleProperty: model.isRangeVisibleProperty
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
      createNode: () => {

        const medianEqualsValueStringProperty = deriveStringProperty( vsm => vsm.medianValueProperty,
          CenterAndVariabilityStrings.medianEqualsUnknownStringProperty, medianPatternStringProperty );

        const medianAccessibleParagraphProperty = createAccessibleParagraphProperty(
          new DynamicProperty<number | null, number | null, VariabilitySceneModel>( model.selectedSceneModelProperty, {
            derive: 'medianValueProperty'
          } ), CenterAndVariabilityFluent.a11y.medianReadout.accessibleParagraph );

        const medianReadoutText = new VariabilityReadoutText( medianEqualsValueStringProperty, medianAccessibleParagraphProperty, {
          fill: CAVColors.medianColorProperty,
          tandem: readoutsTandem.createTandem( 'medianReadoutText' ),
          phetioVisiblePropertyInstrumented: true,
          visiblePropertyOptions: {
            phetioFeatured: true
          }
        } );

        const iqrEqualsValueStringProperty = deriveStringProperty( vsm => vsm.iqrValueProperty,
          CenterAndVariabilityStrings.iqrEqualsUnknownStringProperty, iqrPatternStringProperty );

        const iqrAccessibleParagraphProperty = createAccessibleParagraphProperty(
          new DynamicProperty<number | null, number | null, VariabilitySceneModel>( model.selectedSceneModelProperty, {
          derive: 'iqrValueProperty'
        } ), CenterAndVariabilityFluent.a11y.variabilityScreen.measureAccordionBox.iqrAccessibleParagraph );

        const iqrReadoutText = new VariabilityReadoutText( iqrEqualsValueStringProperty, iqrAccessibleParagraphProperty, {
          fill: CAVColors.iqrLabelColorProperty,
          visibleProperty: model.isIQRVisibleProperty
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
      createNode: () => {

        const meanEqualsValueStringProperty = deriveStringProperty( vsm => vsm.meanValueProperty,
          CenterAndVariabilityStrings.meanEqualsUnknownStringProperty, meanPatternStringProperty );
        const meanAccessibleParagraphProperty = createAccessibleParagraphProperty(
          new DynamicProperty<number | null, number | null, VariabilitySceneModel>( model.selectedSceneModelProperty, {
            derive: 'meanValueProperty'
          } ), CenterAndVariabilityFluent.a11y.meanReadout.accessibleParagraph );

        const madEqualsValueStringProperty = deriveStringProperty( vsm => vsm.madValueProperty,
          CenterAndVariabilityStrings.madEqualsUnknownStringProperty, madPatternStringProperty );
        const madAccessibleParagraphProperty = createAccessibleParagraphProperty(
          new DynamicProperty<number | null, number | null, VariabilitySceneModel>( model.selectedSceneModelProperty, {
            derive: 'madValueProperty'
          } ), CenterAndVariabilityFluent.a11y.variabilityScreen.measureAccordionBox.madAccessibleParagraph );

        const meanReadoutText = new VariabilityReadoutText( meanEqualsValueStringProperty, meanAccessibleParagraphProperty, {
          fill: CAVColors.meanColorProperty,
          tandem: readoutsTandem.createTandem( 'meanReadoutText' ),
          phetioVisiblePropertyInstrumented: true,
          visiblePropertyOptions: {
            phetioFeatured: true
          }
        } );

        const madReadoutText = new VariabilityReadoutText( madEqualsValueStringProperty, madAccessibleParagraphProperty, {
          fill: CAVColors.madColorProperty,
          visibleProperty: model.isMADVisibleProperty
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
      alignChildren: ToggleNode.NONE
    } ), { alignBounds: backgroundShape.bounds, xAlign: 'left', yAlign: 'center' } );

    backgroundNode.addChild( readoutsToggleNode );

    super( backgroundNode, {
      tandem: tandem,
      titleNode: new AccordionBoxTitleNode( accordionBoxTitleProperty, CAVColors.variabilityAccordionBoxFillProperty ),
      expandedProperty: model.isAccordionBoxExpandedProperty,

      // Leave space for the radio buttons at the left
      left: 65,
      fill: CAVColors.variabilityAccordionBoxFillProperty
    } );

    model.selectedVariabilityMeasureProperty.link( selectedVariabilityMeasure => {
      this.accessibleHelpText = selectedVariabilityMeasure === VariabilityMeasure.RANGE ?
                                CenterAndVariabilityFluent.a11y.variabilityScreen.measureAccordionBox.rangeAccessibleHelpTextStringProperty :
                                selectedVariabilityMeasure === VariabilityMeasure.IQR ?
                                CenterAndVariabilityFluent.a11y.variabilityScreen.measureAccordionBox.iqrAccessibleHelpTextStringProperty :
                                CenterAndVariabilityFluent.a11y.variabilityScreen.measureAccordionBox.madAccessibleHelpTextStringProperty;
    } );

    // for pdom order
    this.infoButton = infoButton;
    this.intervalToolNode = intervalToolNode;

    backgroundNode.setPDOMOrder( [
      readoutsToggleNode,
      plotToggleNode,
      checkboxToggleNode
    ] );
  }

  /**
   * Match the highlighting for the accordion box section of the interval tool to be the same as the one in the play area.
   */
  public setFocusHighlightForIntervalTool( parentIntervalToolNode: IntervalToolRectangle ): void {
    this.intervalToolNode.setFocusHighlight( new HighlightFromNode( parentIntervalToolNode ) );
  }
}

centerAndVariability.register( 'VariabilityAccordionBox', VariabilityAccordionBox );