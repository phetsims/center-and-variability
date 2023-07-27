// Copyright 2023, University of Colorado Boulder

/**
 * RangeNode overlays a range indicator on the plot. It is used in both the accordion and info views.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ManualConstraint, Rectangle, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVPlotNode, { CAVPlotNodeOptions, MIN_KICKS_TEXT_OFFSET } from '../../common/view/CAVPlotNode.js';
import CAVObjectType from '../../common/model/CAVObjectType.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVConstants, { DATA_POINT_SCALE_PROPERTY } from '../../common/CAVConstants.js';
import CAVColors from '../../common/CAVColors.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import SoccerBall from '../../soccer-common/model/SoccerBall.js';
import IntervalBarNode from '../../common/view/IntervalBarNode.js';
import TProperty from '../../../../axon/js/TProperty.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type RangeNodeOptions = SelfOptions & StrictOmit<CAVPlotNodeOptions, 'dataPointFill'>;

export default class RangeNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, isDataPointLayerVisibleProperty: TProperty<boolean>, providedOptions: RangeNodeOptions ) {

    const options = optionize<RangeNodeOptions, SelfOptions, CAVPlotNodeOptions>()( {
      dataPointFill: CAVColors.variabilityDataPointFill
    }, providedOptions );

    super( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, options );

    const needAtLeastOneKickText = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH
    } );

    ManualConstraint.create( this, [ needAtLeastOneKickText ], textProxy => {
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

      const leftmostDot = sortedDots[ 0 ] as SoccerBall | undefined;
      const rightmostDot = sortedDots[ sortedDots.length - 1 ] as SoccerBall | undefined;

      // Only redraw the shape if the feature is selected and the data is sorted, and there is at least one card
      const hasNonZeroRange = !!leftmostDot &&
                              !!rightmostDot &&
                              leftmostDot.valueProperty.value !== rightmostDot.valueProperty.value;
      if ( hasNonZeroRange ) {
        const left = this.modelViewTransform.modelToViewX( leftmostDot.valueProperty.value! );
        const right = this.modelViewTransform.modelToViewX( rightmostDot.valueProperty.value! );
        const highestYValue = this.modelViewTransform.modelToViewY(
          _.maxBy( sortedDots, dot => dot.positionProperty.value.y )!.positionProperty.value.y );


        const floor = this.modelViewTransform.modelToViewY( 0 );

        if ( options.parentContext === 'info' ) {
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
      const rangeVisibility = ( options.parentContext === 'info' && hasNonZeroRange ) ||
                              ( options.parentContext === 'accordion' && hasNonZeroRange && model.isRangeVisibleProperty.value );
      rangeRectangle.visible = rangeVisibility;
      rangeBar.visible = rangeVisibility;
      rangeTextReadout.visible = rangeVisibility;
      needAtLeastOneKickText.visible = sceneModel.numberOfDataPointsProperty.value === 0 && ( options.parentContext === 'info' ||
                                                                                              ( options.parentContext === 'accordion' && model.isRangeVisibleProperty.value ) );
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