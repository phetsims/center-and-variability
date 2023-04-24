// Copyright 2023, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * DistributionType is used to identify the selected distribution type.
 * TODO: See also CAVConstants.RIGHT_SKEWED_DATA
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class DistributionType extends EnumerationValue {
  public static readonly UNIFORM = new DistributionType();
  public static readonly GAUSSIAN = new DistributionType();
  public static readonly SKEWED = new DistributionType();
  public static readonly BIMODAL = new DistributionType();
  private static readonly enumeration = new Enumeration( DistributionType, {} );
}

centerAndVariability.register( 'DistributionType', DistributionType );