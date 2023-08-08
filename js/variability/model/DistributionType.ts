// Copyright 2023, University of Colorado Boulder

/**
 * DistributionType is used to identify the selected distribution type.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */


import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class DistributionType extends EnumerationValue {
  public static readonly KICKER_1 = new DistributionType();
  public static readonly KICKER_2 = new DistributionType();
  public static readonly KICKER_3 = new DistributionType();
  public static readonly KICKER_4 = new DistributionType();

  public static readonly enumeration = new Enumeration( DistributionType, {} );
}

centerAndVariability.register( 'DistributionType', DistributionType );