// Copyright 2023-2025, University of Colorado Boulder

/**
 * RangeNode overlays an indicator on the plot to display the range.
 * It's designed to adapt its visualization based on the context, whether shown in an accordion or information view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants, { DATA_POINT_SCALE_PROPERTY } from '../../common/CAVConstants.js';
import CAVObjectType from '../../common/model/CAVObjectType.js';
import RepresentationContext from '../../common/model/RepresentationContext.js';
import CAVPlotNode, { CAVPlotNodeOptions, MIN_KICKS_TEXT_OFFSET } from '../../common/view/CAVPlotNode.js';
import IntervalBarNode from '../../common/view/IntervalBarNode.js';
import NeedAtLeastNKicksText from '../../common/view/NeedAtLeastNKicksText.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';

type SelfOptions = {
  representationContext: RepresentationContext;
};
type RangeNodeOptions = SelfOptions & StrictOmit<CAVPlotNodeOptions, 'dataPointFill'>;

export default class RangeNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, isDataPointLayerVisibleProperty: TProperty<boolean>, providedOptions: RangeNodeOptions ) {

    const options = optionize<RangeNodeOptions, SelfOptions, CAVPlotNodeOptions>()( {
      dataPointFill: CAVColors.variabilityDataPointFill
    }, providedOptions );

    super( false, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, DerivedProperty.valueEqualsConstant( model.selectedVariabilityMeasureProperty, VariabilityMeasure.MAD ), options );

    const needAtLeastOneKickText = new NeedAtLeastNKicksText( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty );

    ManualConstraint.create( this, [ needAtLeastOneKickText ], () => {
      needAtLeastOneKickText.center = this.modelViewTransform.modelToViewXY( CAVConstants.PHYSICAL_RANGE.getCenter(), MIN_KICKS_TEXT_OFFSET );
    } );
    this.addChild( needAtLeastOneKickText );

    // This adds a top margin to the text, separating it from the info dialog subheading
    // needAtLeastOneKickText.localBounds = needAtLeastOneKickText.localBounds.dilatedY( MIN_KICKS_TEXT_TOP_MARGIN );

    const rangeTextReadout = new Text( '', {
      font: CAVConstants.VARIABILITY_MEASURE_NUMBER_READOUT_FONT
    } );

    const rangeBar = new IntervalBarNode();
    const rangeRectangle = new Rectangle( 0, 50, 100, CAVConstants.VARIABILITY_PLOT_RECT_HEIGHT, {
      fill: CAVColors.rangeFillProperty
    } );
    this.addChild( rangeBar );
    this.addChild( rangeRectangle );
    this.addChild( rangeTextReadout );

    const updateRangeNode = () => {

      const sortedDots = sceneModel.getSortedLandedObjects();

      // Typescript doesn't know that sortedDots could have 0 elements, so we must
      // set the type as SoccerBall or undefined.
      const leftmostDot = sortedDots[ 0 ] as SoccerBall | undefined;
      const rightmostDot = sortedDots[ sortedDots.length - 1 ] as SoccerBall | undefined;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card.
      // We need the double bang for leftmostDot and rightmostDot because they are potentially undefined.
      // See:  https://github.com/phetsims/center-and-variability/issues/191
      const hasNonZeroRange = !!leftmostDot &&
                              !!rightmostDot &&
                              leftmostDot.valueProperty.value !== rightmostDot.valueProperty.value;
      if ( hasNonZeroRange ) {
        const left = this.modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        const right = this.modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );
        const highestYValue = this.modelViewTransform.modelToViewY(
          _.maxBy( sortedDots, dot => dot.positionProperty.value.y )!.positionProperty.value.y );

        const floor = this.modelViewTransform.modelToViewY( 0 );

        if ( options.representationContext === 'info' ) {
          const dataPointRadius = this.modelViewTransform.modelToViewDeltaX( CAVObjectType.DATA_POINT.radius ) * DATA_POINT_SCALE_PROPERTY.value;
          const topPadding = 3 * dataPointRadius;
          rangeRectangle.rectHeight = floor - highestYValue + dataPointRadius + topPadding;
        }
        rangeRectangle.rectWidth = right - left;
        rangeRectangle.left = left;
        rangeRectangle.bottom = floor;

        rangeBar.setIntervalBarNodeWidth( rangeRectangle.rectWidth );
        rangeBar.centerX = rangeRectangle.centerX;
        rangeBar.bottom = rangeRectangle.top + CAVConstants.VARIABILITY_PLOT_BAR_OFFSET_Y;

        rangeTextReadout.string = sceneModel.rangeValueProperty.value + '';
        rangeTextReadout.centerBottom = rangeBar.centerTop;
      }
      const rangeVisibility = ( options.representationContext === 'info' && hasNonZeroRange ) ||
                              ( options.representationContext === 'accordion' && hasNonZeroRange && model.isRangeVisibleProperty.value );
      rangeRectangle.visible = rangeVisibility;
      rangeBar.visible = rangeVisibility;
      rangeTextReadout.visible = rangeVisibility;
      needAtLeastOneKickText.visible = sceneModel.numberOfDataPointsProperty.value === 0 && ( options.representationContext === 'info' ||
                                                                                              ( options.representationContext === 'accordion' && model.isRangeVisibleProperty.value ) );
    };

    model.isRangeVisibleProperty.link( updateRangeNode );
    model.selectedVariabilityMeasureProperty.link( updateRangeNode );

    // It's important to avoid inconsistent intermediate states during the updateDataMeasures calculation, so we
    // only update once it's complete
    sceneModel.variabilityDataMeasuresUpdatedEmitter.addListener( updateRangeNode );

    rangeRectangle.moveToBack();
  }
}

centerAndVariability.register( 'RangeNode', RangeNode );