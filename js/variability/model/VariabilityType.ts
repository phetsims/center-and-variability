// Copyright 2022-2023, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * VariabilityType is used to identify which kind of variability the user has selected to explore.
 * TODO: Is this the correct name for this enumeration?
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class VariabilityType extends EnumerationValue {
  public static readonly RANGE = new VariabilityType();
  public static readonly IQR = new VariabilityType();
  public static readonly MAD = new VariabilityType();
  private static readonly enumeration = new Enumeration( VariabilityType );
}

centerAndVariability.register( 'VariabilityType', VariabilityType );