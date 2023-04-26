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

// Right skewed means most of the data is on the left, see https://github.com/phetsims/center-and-variability/issues/112
const RIGHT_SKEWED_DATA = [
  6, 9, 11, 14, 11,
  8, 6, 5, 5, 5,
  5, 5, 5, 5, 5
];

const NUMBER_LINE_MARGIN_X = 207;

const CAVConstants = {
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  GRAVITY: -9.8, // in meters/second^2
  BUTTON_FONT: new PhetFont( 16 ),
  NUMBER_OF_OBJECTS: 15, // number of objects in the play area on each screen
  TOP_CHECKBOX_TEXT_MAX_WIDTH: 107,

  // the top checkboxes are left aligned with the plat area checkboxes, so their max width is smaller to accommodate
  // for the accordion box margin
  PLAY_AREA_CHECKBOX_TEXT_MAX_WIDTH: 90,
  PLOT_TYPE_PROPERTY: new EnumerationProperty( CAVQueryParameters.plotType === 'dotPlot' ? PlotType.DOT_PLOT : PlotType.LINE_PLOT, {
    tandem: Tandem.PREFERENCES.createTandem( 'plotTypeProperty' )
  } ),
  ARROW_LINE_WIDTH: 0.5,
  RIGHT_SKEWED_DATA: RIGHT_SKEWED_DATA,
  LEFT_SKEWED_DATA: RIGHT_SKEWED_DATA.slice().reverse(),

  CHART_VIEW_WIDTH: ScreenView.DEFAULT_LAYOUT_BOUNDS.width - NUMBER_LINE_MARGIN_X * 2,
  NUMBER_LINE_MARGIN_X: NUMBER_LINE_MARGIN_X,

  // TODO: Add to color profile, then assign to @cathy, This is the color from the design doc, but perhaps #777777 or darker would be better? Let's discuss once the IQR lines are drawn
  GRAY_DATA_POINT_FILL: '#8f8f8f',

  INFO_DIALOG_MAX_TEXT_WIDTH: 400
};

centerAndVariability.register( 'CAVConstants', CAVConstants );
export default CAVConstants;