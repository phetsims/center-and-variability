// Copyright 2022, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * Whether to show dots or x's in the plot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
class PlotType extends EnumerationValue {
  public static LINE_PLOT = new PlotType();
  public static DOT_PLOT = new PlotType();
  private static enumeration = new Enumeration( PlotType );
}

centerAndVariability.register( 'PlotType', PlotType );
export default PlotType;