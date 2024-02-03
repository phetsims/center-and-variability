// Copyright 2022-2023, University of Colorado Boulder

/**
 * The `PlotType` class provides an enumeration to determine the representation of data in a plot.
 * It helps decide whether the data should be displayed as dots or as lines on the plot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class PlotType extends EnumerationValue {

  // Represents a plot where data is visualized as X's
  public static readonly LINE_PLOT = new PlotType();

  // Represents a plot where data is visualized as dots
  public static readonly DOT_PLOT = new PlotType();

  public static readonly enumeration = new Enumeration( PlotType );
}

centerAndVariability.register( 'PlotType', PlotType );