// Copyright 2022-2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../axon/js/EnumerationProperty.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Tandem from '../../../tandem/js/Tandem.js';
import centerAndVariability from '../centerAndVariability.js';
import CAVQueryParameters from './CAVQueryParameters.js';
import PlotType from './model/PlotType.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import Range from '../../../dot/js/Range.js';
import { Shape } from '../../../kite/js/imports.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import { AlignGroup } from '../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import CAVColors from './CAVColors.js';

const NUMBER_LINE_MARGIN_X = 207;

// scales are empirically determined so that data points cut off when outside of
// clip-area (so that we show half of an "x" instead of ending on a complete "x").
export const MAX_KICKS_CONFIG = [
  { kicks: 5, scale: 1 },
  { kicks: 10, scale: 1 },
  { kicks: 15, scale: 1 },
  { kicks: 20, scale: 0.97 },
  { kicks: 25, scale: 0.92 },
  { kicks: 30, scale: 0.87 }
];

const PHYSICAL_RANGE = new Range( 1, 15 );
const CHART_VIEW_WIDTH = ScreenView.DEFAULT_LAYOUT_BOUNDS.width - NUMBER_LINE_MARGIN_X * 2;

const NUMBER_LINE_POSITION_Y = 127;

// View size of a data point in the chart for purposes of setting up the coordinate frame
const DATA_POINT_HEIGHT = 17;

const PLOT_NODE_TRANSFORM = ModelViewTransform2.createRectangleInvertedYMapping(
  new Bounds2( PHYSICAL_RANGE.min, 0, PHYSICAL_RANGE.max, 1 ),
  new Bounds2( 0, NUMBER_LINE_POSITION_Y - DATA_POINT_HEIGHT, CHART_VIEW_WIDTH, NUMBER_LINE_POSITION_Y )
);

const MAIN_FONT = new PhetFont( 16 );

const CAVConstants = {
  ACCORDION_BOX_TOP_MARGIN: 5,
  MAIN_FONT: MAIN_FONT,
  MAX_NUMBER_OF_CARDS: 15,
  CHECKBOX_TEXT_MAX_WIDTH: 107,
  CHECKBOX_ICON_DIMENSION: 25,

  CARD_DIMENSION: 43,
  CARD_SPACING: 10,

  // the top checkboxes are left aligned with the play area checkboxes, so their max width is smaller to accommodate
  // for the accordion box margin
  PLOT_TYPE_PROPERTY: new EnumerationProperty( CAVQueryParameters.plotType === 'dotPlot' ? PlotType.DOT_PLOT : PlotType.LINE_PLOT, {
    tandem: Tandem.PREFERENCES.createTandem( 'plotTypeProperty' ),
    phetioFeatured: true
  } ),

  CHART_VIEW_WIDTH: CHART_VIEW_WIDTH,
  NUMBER_LINE_MARGIN_X: NUMBER_LINE_MARGIN_X,

  VARIABILITY_PLOT_RECT_HEIGHT: 118,
  VARIABILITY_PLOT_BAR_OFFSET_Y: -3,

  INFO_DIALOG_FONT_SIZE: 16,
  INFO_DIALOG_TITLE_FONT_SIZE: 20,
  INFO_DIALOG_MAX_TEXT_WIDTH: 840,
  INFO_DIALOG_HEADING_BOTTOM_MARGIN: 5,
  INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN: 6,

  CHECKBOX_TEXT_OPTIONS: {
    font: MAIN_FONT,
    maxWidth: 90
  },
  IQR_LABEL_MAX_WIDTH: 40,

  PHYSICAL_RANGE: PHYSICAL_RANGE,
  VARIABILITY_DRAG_RANGE: new Range( 0, 16 ),
  MAX_KICKS_VALUES: [ 5, 10, 15, 20, 25, 30 ],

  ACCORDION_BOX_CONTENTS_SHAPE_MEDIAN: Shape.rect( 0, 10, 983, 205 ),
  ACCORDION_BOX_CONTENTS_SHAPE_MEAN_AND_MEDIAN: Shape.rect( 0, 10, 983, 232 ),
  ACCORDION_BOX_CONTENTS_SHAPE_VARIABILITY: Shape.rect( 0, 10, 926, 232 ),
  ACCORDION_BOX_VERTICAL_CHECKBOX_GROUP: new AlignGroup( { matchHorizontal: false } ),

  SCENE_VIEW_TANDEM: 'sceneView',

  // Shown above the numbers in the variability accordion box plots, like above the RangeNode bars
  VARIABILITY_MEASURE_NUMBER_READOUT_FONT: new PhetFont( { size: 13, weight: 'bold' } ),

  // How many decimal places to include the variability measure displays
  VARIABILITY_MEASURE_DECIMAL_POINTS: 1,

  VARIABILITY_KICKER_COLORS: [ CAVColors.kicker1RadioButtonFillColorProperty,
    CAVColors.kicker2RadioButtonFillColorProperty,
    CAVColors.kicker3RadioButtonFillColorProperty,
    CAVColors.kicker4RadioButtonFillColorProperty ],

  // There are numerous displays for values that could take a null value. We should never see the word null in the sim.
  // The corresponding texts should be invisible when the value is null. However, the strings are created during startup
  // so we cannot throw an error if the value is null.
  STRING_VALUE_NULL_MAP: ( value: number | null ): number | string => value === null ? 'null' : value,

  ARROW_LINE_WIDTH: 0.5,

  // Coordinates here are somewhat unusual, since x dimension is based off of meters, and y dimension is based off of
  // number of objects.
  PLOT_NODE_TRANSFORM: PLOT_NODE_TRANSFORM,

  NUMBER_LINE_POSITION_Y: NUMBER_LINE_POSITION_Y
};

// Global Properties

export const MAX_KICKS_PROPERTY = new NumberProperty( CAVQueryParameters.maxKicks, {
  validValues: MAX_KICKS_CONFIG.map( config => config.kicks ),
  tandem: Tandem.PREFERENCES.createTandem( 'maxKicksProperty' ),
  phetioDocumentation: 'This property is a global property that affects all screens. However, the Median screen is restricted to a maximum of 15 kicks.',
  phetioFeatured: true
} );

export const SHOW_OUTLIERS_PROPERTY = new BooleanProperty( CAVQueryParameters.showOutliers, {
  tandem: Tandem.PREFERENCES.createTandem( 'showOutliersProperty' ),
  phetioFeatured: true
} );

// The scaling for the data points depends on the max kicks selected, and applies across the entire sim
export const DATA_POINT_SCALE_PROPERTY = new DerivedProperty( [ MAX_KICKS_PROPERTY ], maxKicks => {

  // There are only 4 valid values for MAX_KICKS_PROPERTY and those are set by the MAX_KICKS_CONFIG.
  return MAX_KICKS_CONFIG.find( config => config.kicks === maxKicks )!.scale;
}, {
  validValues: MAX_KICKS_CONFIG.map( config => config.scale )
} );

centerAndVariability.register( 'CAVConstants', CAVConstants );
export default CAVConstants;