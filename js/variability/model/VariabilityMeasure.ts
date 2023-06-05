// Copyright 2023, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * VariabilityMeasure is used to identify which kind of variability the user has selected to explore.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class VariabilityMeasure extends EnumerationValue {
  public static readonly RANGE = new VariabilityMeasure();
  public static readonly IQR = new VariabilityMeasure();
  public static readonly MAD = new VariabilityMeasure();
  private static readonly enumeration = new Enumeration( VariabilityMeasure );
}

centerAndVariability.register( 'VariabilityMeasure', VariabilityMeasure );