// Copyright 2023, University of Colorado Boulder

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import DistributionType from '../model/DistributionType.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Text } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;
type DistributionRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class DistributionRadioButtonGroup extends RectangularRadioButtonGroup<DistributionType> {

  public constructor( property: Property<DistributionType>, providedOptions: DistributionRadioButtonGroupOptions ) {
    const options = optionize<DistributionRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {}, providedOptions );
    super( property, [ {
      value: DistributionType.SYMMETRIC_SMALL,
      createNode: tandem => new Text( 'Symmetric, small' )
    }, {
      value: DistributionType.SYMMETRIC_LARGE,
      createNode: tandem => new Text( 'Symmetric, large' )
    }, {
      value: DistributionType.SKEWED,
      createNode: tandem => new Text( 'Skewed' )
    }, {
      value: DistributionType.BIMODAL,
      createNode: tandem => new Text( 'Bimodal' )
    } ], options );
  }
}

centerAndVariability.register( 'DistributionRadioButtonGroup', DistributionRadioButtonGroup );