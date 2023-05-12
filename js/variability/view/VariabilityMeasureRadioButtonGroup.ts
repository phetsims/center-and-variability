// Copyright 2023, University of Colorado Boulder

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import RangeIconNode from './RangeIconNode.js';
import IQRIconNode from './IQRIconNode.js';
import MADIconNode from './MADIconNode.js';

type SelfOptions = EmptySelfOptions;
type VariabilityRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class VariabilityMeasureRadioButtonGroup extends RectangularRadioButtonGroup<VariabilityMeasure> {

  public constructor( property: Property<VariabilityMeasure>, providedOptions: VariabilityRadioButtonGroupOptions ) {
    const options = optionize<VariabilityRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {}, providedOptions );

    super( property, [ {
      value: VariabilityMeasure.RANGE,
      createNode: tandem => new RangeIconNode(),
      tandemName: 'rangeRadioButton'
    }, {
      value: VariabilityMeasure.IQR,
      createNode: tandem => new IQRIconNode(),
      tandemName: 'iqrRadioButton'
    }, {
      value: VariabilityMeasure.MAD,
      createNode: tandem => new MADIconNode(),
      tandemName: 'madRadioButton'
    } ], {
      ...options,
      spacing: 5,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 0,
        yMargin: 0
      }
    } );
  }
}

centerAndVariability.register( 'VariabilityMeasureRadioButtonGroup', VariabilityMeasureRadioButtonGroup );