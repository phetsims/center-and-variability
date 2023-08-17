// Copyright 2023, University of Colorado Boulder

/**
 * Accordion box for the Variability Screen. There are three possible plot nodes it can render:
 * Range, IQR, and MAD. The accordion box creates four of each plot node, 1 per scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { AlignBox, HighlightFromNode, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import DerivedProperty, { UnknownDerivedProperty } from '../../../../axon/js/DerivedProperty.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import VariabilityReadoutText from './VariabilityReadoutText.js';
import CAVColors from '../../common/CAVColors.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVConstants from '../../common/CAVConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VariabilityMeasureCheckbox from './VariabilityMeasureCheckbox.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import AccordionBoxTitleNode from '../../common/view/AccordionBoxTitleNode.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import CAVInfoButton from '../../common/view/CAVInfoButton.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import IntervalToolNode from './IntervalToolNode.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

export default class VariabilityAccordionBox extends CAVAccordionBox {

  public readonly infoButton: ButtonNode;
  private readonly intervalToolNode: IntervalToolNode;

  public constructor( model: VariabilityModel, tandem: Tandem, playAreaNumberLineNode: NumberLineNode ) {

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

    const intervalToolNode = new IntervalToolNode( model.intervalTool1ValueProperty,
      model.intervalTool2ValueProperty, CAVConstants.PLOT_NODE_TRANSFORM, new Property( -18 ),
      new BooleanProperty( false ), {
        focusable: false,
        visibleProperty: model.isIntervalToolVisibleProperty,
        enabledProperty: model.isIntervalToolInputEnabledProperty,
        tandem: tandem.createTandem( 'intervalToolNode' )
      } );

    const contents = _.range( 4 ).map( i => {
      return {
        value: model.sceneModels[ i ],
        createNode: () => {
          return new VariabilityPlotNode( model, model.variabilitySceneModels[ i ], playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, intervalToolNode, {
            bottom: backgroundShape.bounds.height
          } );
        }
      };
    } );

    const plotToggleNode = new ToggleNode( model.selectedSceneModelProperty, contents, {
      bottom: backgroundShape.bounds.height
    } );

    const infoButton = new CAVInfoButton( model.infoButtonPressedEmitter, backgroundShape, tandem.createTandem( 'infoButton' ) );
    backgroundNode.addChild( infoButton );

    const checkboxesTandem = tandem.createTandem( 'checkboxes' );
    const checkboxToggleNode = new AlignBox( new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      createNode: () => CAVConstants.ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP.createBox( new VariabilityMeasureCheckbox( model.isRangeVisibleProperty,
        CenterAndVariabilityStrings.rangeStringProperty, CAVColors.rangeFillProperty,
        { tandem: checkboxesTandem.createTandem( 'rangeAccordionCheckbox' ) } ), { yAlign: 'top' } ),
      value: VariabilityMeasure.RANGE
    }, {
      createNode: () => CAVConstants.ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP.createBox( new VariabilityMeasureCheckbox( model.isIQRVisibleProperty,
        CenterAndVariabilityStrings.iqrStringProperty, CAVColors.iqrColorProperty,
        { tandem: checkboxesTandem.createTandem( 'iqrAccordionCheckbox' ) } ), { yAlign: 'top' } ),
      value: VariabilityMeasure.IQR
    }, {
      createNode: () => CAVConstants.ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP.createBox( new VariabilityMeasureCheckbox( model.isMADVisibleProperty,
        CenterAndVariabilityStrings.madStringProperty, CAVColors.madRectangleColorProperty,
        { tandem: checkboxesTandem.createTandem( 'madAccordionCheckbox' ) } ), { yAlign: 'top' } ),
      value: VariabilityMeasure.MAD
    } ], {
      alignChildren: ToggleNode.RIGHT
    } ), { alignBounds: backgroundShape.bounds, xAlign: 'right', yAlign: 'center' } );

    backgroundNode.addChild( plotToggleNode );
    backgroundNode.addChild( checkboxToggleNode );

    const createDerivedValueProperty = ( accessor: ( sceneModel: VariabilitySceneModel ) => TReadOnlyProperty<number | null>, roundToDecimal: number | null ) => {
      return DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( accessor ), CenterAndVariabilityStrings.valueUnknownStringProperty ], () => {
        const value = accessor( model.selectedSceneModelProperty.value as VariabilitySceneModel ).value;
        return value === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value :
               roundToDecimal === null ? value :
               Utils.toFixed( value, roundToDecimal );
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
                                   valueUnknownStringProperty: LocalizedStringProperty, valuePatternStringProperty: PatternStringProperty<{
        value: UnknownDerivedProperty<number | string>;
      }> ) => {
      return DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( accessor ) ], () => {
        const result = accessor( model.selectedSceneModelProperty.value as VariabilitySceneModel ).value;
        return result === null ? valueUnknownStringProperty.value : valuePatternStringProperty.value;
      } );
    };

    const readoutsTandem = tandem.createTandem( 'valueReadouts' );
    const readoutsToggleNode = new AlignBox( new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: () => {
        const rangeEqualsValueStringProperty = deriveStringProperty( vsm => vsm.rangeValueProperty,
          CenterAndVariabilityStrings.rangeUnknownValueStringProperty, rangePatternStringProperty );

        const rangeReadoutText = new VariabilityReadoutText( rangeEqualsValueStringProperty, {
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
          CenterAndVariabilityStrings.medianUnknownValueStringProperty, medianPatternStringProperty );

        const medianReadoutText = new VariabilityReadoutText( medianEqualsValueStringProperty, {
          fill: CAVColors.medianColorProperty,
          tandem: readoutsTandem.createTandem( 'medianReadoutText' ),
          phetioVisiblePropertyInstrumented: true,
          visiblePropertyOptions: {
            phetioFeatured: true
          }
        } );

        const iqrEqualsValueStringProperty = deriveStringProperty( vsm => vsm.iqrValueProperty,
          CenterAndVariabilityStrings.iqrUnknownValueStringProperty, iqrPatternStringProperty );

        const iqrReadoutText = new VariabilityReadoutText( iqrEqualsValueStringProperty, {
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
          CenterAndVariabilityStrings.meanUnknownValueStringProperty, meanPatternStringProperty );

        const madEqualsValueStringProperty = deriveStringProperty( vsm => vsm.madValueProperty,
          CenterAndVariabilityStrings.madUnknownValueStringProperty, madPatternStringProperty );

        const meanReadoutText = new VariabilityReadoutText( meanEqualsValueStringProperty, {
          fill: CAVColors.meanColorProperty,
          tandem: readoutsTandem.createTandem( 'meanReadoutText' ),
          phetioVisiblePropertyInstrumented: true,
          visiblePropertyOptions: {
            phetioFeatured: true
          }
        } );

        const madReadoutText = new VariabilityReadoutText( madEqualsValueStringProperty, {
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

    // for pdom order
    this.infoButton = infoButton;
    this.intervalToolNode = intervalToolNode;
  }

  /**
   * Match the highlighting for the accordion box section of the interval tool to be the same as the one in the play area.
   */
  public setFocusHighlightForIntervalTool( parentIntervalToolNode: IntervalToolNode ): void {
    this.intervalToolNode.setFocusHighlight( new HighlightFromNode( parentIntervalToolNode ) );
  }
}

centerAndVariability.register( 'VariabilityAccordionBox', VariabilityAccordionBox );