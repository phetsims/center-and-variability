// Copyright 2023, University of Colorado Boulder

/**
 * MeanAndMedianAccordionBox is a UI component for the Mean and Median Screen. It provides an interactive accordion box that
 * features a plot visualization, checkboxes for toggling the visibility of mean and median indicators, and readouts
 * for displaying the mean and median values.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import { AlignBox, LinearGradient, Rectangle, Text, TPaint, VBox } from '../../../../scenery/js/imports.js';
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
import Utils from '../../../../dot/js/Utils.js';
import CAVColors from '../../common/CAVColors.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import AccordionBoxTitleNode from '../../common/view/AccordionBoxTitleNode.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import CAVInfoButton from '../../common/view/CAVInfoButton.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PlotType from '../../common/model/PlotType.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';

export default class MeanAndMedianAccordionBox extends CAVAccordionBox {
  public readonly infoButton: ButtonNode;

  public constructor( model: MeanAndMedianModel, layoutBounds: Bounds2, tandem: Tandem, top: number, playAreaNumberLineNode: NumberLineNode ) {

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_MEAN_AND_MEDIAN;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape, CAVColors.meanAndMedianAccordionBoxFillProperty );

    // There is only one scene in the mean and median screen
    const sceneModel = model.selectedSceneModelProperty.value;

    const meanAndMedianPlotNode = new MeanAndMedianPlotNode( model, sceneModel, playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, {
      dataPointFill: 'black',
      representationContext: 'accordion'
    } ).mutate( {
      bottom: backgroundShape.bounds.height
    } );

    const checkboxGroup = CAVConstants.ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP.createBox( new VerticalCheckboxGroup( [
      AccordionBoxCheckboxFactory.getMedianCheckboxWithIconItem( model.isMedianVisibleProperty ),
      AccordionBoxCheckboxFactory.getMeanCheckboxWithIconItem( model.isMeanVisibleProperty, model.selectedSceneModelProperty )
    ], {
      tandem: tandem.createTandem( 'checkboxGroup' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } ), { yAlign: 'top' } );

    const checkboxGroupAlignBox = new AlignBox( checkboxGroup, {
      alignBounds: backgroundShape.bounds,
      xAlign: 'right',
      yAlign: 'center'
    } );

    backgroundNode.addChild( checkboxGroupAlignBox );
    backgroundNode.addChild( meanAndMedianPlotNode );

    // We want the data points to fade out of the accordion box when a data point stack gets too high to indicate that
    // more data points exist that may not be visible.
    const topGradient = new LinearGradient( 0, backgroundShape.bounds.minY, 0, backgroundShape.bounds.minY + 30 )
      .addColorStop( 0.15, CAVColors.meanAndMedianAccordionBoxFillProperty )
      .addColorStop( 1, CAVColors.meanAndMedianAccordionBottomGradientColorProperty );
    const gradientRectangle = new Rectangle( 0, backgroundShape.bounds.minY, backgroundShape.bounds.maxX, backgroundShape.bounds.minY + 5, { fill: topGradient } );
    backgroundNode.addChild( gradientRectangle );

    const infoButton = new CAVInfoButton( model.infoButtonPressedEmitter, backgroundShape, tandem.createTandem( 'infoButton' ) );
    backgroundNode.addChild( infoButton );

    const createReadoutText = ( valueProperty: TReadOnlyProperty<number | null>, visibleProperty: TReadOnlyProperty<boolean>,
                                patternStringProperty: TReadOnlyProperty<string>, unknownStringProperty: LocalizedStringProperty, fill: TPaint, decimalPlaces: number | null ) => {

      const readoutProperty = new DerivedProperty( [ valueProperty, CenterAndVariabilityStrings.valueUnknownStringProperty ],
        ( value, valueUnknownString ) => {
          return value === null ? valueUnknownString : typeof decimalPlaces === 'number' ? Utils.toFixed( value, decimalPlaces ) : value;
        } );

      const valuePatternStringProperty = new PatternStringProperty( patternStringProperty, {
        value: readoutProperty
      } );
      const readoutPatternStringProperty = DerivedProperty.deriveAny( [ unknownStringProperty, model.selectedSceneModelProperty, valueProperty ], () => {
        const result = valueProperty.value;
        return result === null ? unknownStringProperty.value : valuePatternStringProperty.value;
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
          model.isMedianVisibleProperty,
          CenterAndVariabilityStrings.medianEqualsValueMPatternStringProperty,
          CenterAndVariabilityStrings.medianEqualsUnknownStringProperty,
          CAVColors.medianColorProperty,
          null
        ),
        createReadoutText(
          sceneModel.meanValueProperty,
          model.isMeanVisibleProperty,
          CenterAndVariabilityStrings.meanEqualsValueMPatternStringProperty,
          CenterAndVariabilityStrings.meanEqualsUnknownStringProperty,
          CAVColors.meanColorProperty,
          1
        )
      ],
      leftCenter: backgroundShape.bounds.leftCenter
    } );

    backgroundNode.addChild( readoutsNode );

    const titleTextProperty = new DerivedStringProperty( [
      CenterAndVariabilityStrings.dotPlotStringProperty,
      CenterAndVariabilityStrings.linePlotStringProperty,
      CAVConstants.PLOT_TYPE_PROPERTY
    ], ( dotPlotString, linePlotString, plotType ) => {
      return plotType === PlotType.DOT_PLOT ? dotPlotString : linePlotString;
    } );
    super( backgroundNode, {
        titleNode: new AccordionBoxTitleNode( titleTextProperty, CAVColors.meanAndMedianAccordionBoxFillProperty ),
        tandem: tandem,
        top: top,
        centerX: layoutBounds.centerX,
        expandedProperty: model.isAccordionBoxExpandedProperty,
        fill: CAVColors.meanAndMedianAccordionBoxFillProperty
      }
    );

    // for pdom order
    this.infoButton = infoButton;
  }
}

centerAndVariability.register( 'MeanAndMedianAccordionBox', MeanAndMedianAccordionBox );