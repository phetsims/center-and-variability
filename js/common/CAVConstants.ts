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

// Right skewed means most of the data is on the left, see https://github.com/phetsims/center-and-variability/issues/112
const RIGHT_SKEWED_DATA = [
  10, 18, 30, 45, 26,
  18, 10, 5, 4, 4,
  4, 4, 4, 4, 4
];

const NUMBER_LINE_MARGIN_X = 207;

// scales are empirically determined so that data points cut off when outside of
// clip-area (so that we show half of an "x" instead of ending on a complete "x").
export const MAX_KICKS_CONFIG = [
  { kicks: 15, scale: 0.98 },
  { kicks: 20, scale: 0.98 },
  { kicks: 25, scale: 0.91 },
  { kicks: 30, scale: 0.84 }
];

const MAIN_FONT = new PhetFont( 16 );
const CAVConstants = {
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  ACCORDION_BOX_TOP_MARGIN: 5,
  MAIN_FONT: MAIN_FONT,
  NUMBER_OF_OBJECTS: 15, // number of objects in the play area on each screen
  CHECKBOX_TEXT_MAX_WIDTH: 107,
  CHECKBOX_ICON_DIMENSION: 25,

  // the top checkboxes are left aligned with the play area checkboxes, so their max width is smaller to accommodate
  // for the accordion box margin
  PLOT_TYPE_PROPERTY: new EnumerationProperty( CAVQueryParameters.plotType === 'dotPlot' ? PlotType.DOT_PLOT : PlotType.LINE_PLOT, {
    tandem: Tandem.PREFERENCES.createTandem( 'plotTypeProperty' )
  } ),
  RIGHT_SKEWED_DATA: RIGHT_SKEWED_DATA,
  LEFT_SKEWED_DATA: RIGHT_SKEWED_DATA.slice().reverse(),

  CHART_VIEW_WIDTH: ScreenView.DEFAULT_LAYOUT_BOUNDS.width - NUMBER_LINE_MARGIN_X * 2,
  NUMBER_LINE_MARGIN_X: NUMBER_LINE_MARGIN_X,

  VARIABILITY_PLOT_RECT_HEIGHT: 70,
  VARIABILITY_PLOT_BAR_OFFSET_Y: 2,

  INFO_DIALOG_FONT_SIZE: 16,
  INFO_DIALOG_TITLE_FONT_SIZE: 20,
  INFO_DIALOG_MAX_TEXT_WIDTH: 700,
  INFO_DIALOG_HEADING_BOTTOM_MARGIN: 5,
  INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN: 6,

  CHECKBOX_TEXT_OPTIONS: {
    font: MAIN_FONT,
    maxWidth: 90
  },

  PHYSICAL_RANGE: new Range( 1, 15 ),
  VARIABILITY_DRAG_RANGE: new Range( 0, 16 ),
  MAX_KICKS_VALUES: [ 15, 20, 25, 30 ],

  ACCORDION_BOX_CONTENTS_SHAPE_MEDIAN: Shape.rect( 0, 10, 987, 180 ),
  ACCORDION_BOX_CONTENTS_SHAPE_MEAN_AND_MEDIAN: Shape.rect( 0, 10, 987, 240 ),
  ACCORDION_BOX_CONTENTS_SHAPE_VARIABILITY: Shape.rect( 0, 10, 930, 240 ),
  ACCORDION_BOX_HORIZONTAL_MARGIN: 12.5,

  SCENE_VIEW_TANDEM: 'sceneView',

  // Shown above the numbers in the variability accordion box plots, like above the RangeNode bars
  VARIABILITY_MEASURE_NUMBER_READOUT_FONT: new PhetFont( 13 ),

  // There are numerous displays for values that could take a null value. We should never see the word null in the sim.
  // The corresonding texts should be invisible when the value is null. However, the strings are created during startup
  // so we cannot throw an error if the value is null.
  STRING_VALUE_NULL_MAP: ( value: number | null ): number | string => value === null ? 'null' : value,

  ARROW_LINE_WIDTH: 0.5
};

// Global Properties

export const MAX_KICKS_PROPERTY = new NumberProperty( CAVQueryParameters.maxKicks, {
  validValues: MAX_KICKS_CONFIG.map( config => config.kicks ),
  tandem: Tandem.PREFERENCES.createTandem( 'maxKicksProperty' )
} );

export const SHOW_OUTLIERS_PROPERTY = new BooleanProperty( false, {
  tandem: Tandem.PREFERENCES.createTandem( 'showOutliersProperty' )
} );

// The scaling for the data points depends on the max kicks selected, and applies across the entire sim
export const DATA_POINT_SCALE_PROPERTY = new DerivedProperty( [ MAX_KICKS_PROPERTY ], maxKicks => {

  // There are only 4 valid values for maxKicks property and those are set by the MAX_KICKS_CONFIG.
  return MAX_KICKS_CONFIG.find( config => config.kicks === maxKicks )!.scale;
}, {
  validValues: MAX_KICKS_CONFIG.map( config => config.scale )
} );

centerAndVariability.register( 'CAVConstants', CAVConstants );
export default CAVConstants;