// Copyright 2021-2022, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndSpread from '../../centerAndSpread.js';

/**
 * Whether to show dots or x's in the plot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
class PlotType extends EnumerationValue {
  static LINE_PLOT = new PlotType();
  static DOT_PLOT = new PlotType();
  static enumeration = new Enumeration( PlotType );
}

centerAndSpread.register( 'PlotType', PlotType );
export default PlotType;