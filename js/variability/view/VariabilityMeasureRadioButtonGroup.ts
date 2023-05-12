// Copyright 2023, University of Colorado Boulder

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RangeIconNode from './RangeIconNode.js';
import IQRIconNode from './IQRIconNode.js';

type SelfOptions = EmptySelfOptions;
type VariabilityRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class VariabilityMeasureRadioButtonGroup extends RectangularRadioButtonGroup<VariabilityMeasure> {

  public constructor( property: Property<VariabilityMeasure>, providedOptions: VariabilityRadioButtonGroupOptions ) {
    const options = optionize<VariabilityRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {}, providedOptions );

    const createLabel = ( tandem: Tandem, label: string, fill: string ) => {

      const text = new Text( label, {
        fontSize: 16,
        fontWeight: 'bold',
        fill: 'black'
      } );
      return text;
    };
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
      createNode: tandem => createLabel( tandem, 'm', '#fdf454' ),
      tandemName: 'madRadioButton'
    } ], {
      ...options,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 5,
        yMargin: 5
      }
    } );
  }
}

centerAndVariability.register( 'VariabilityMeasureRadioButtonGroup', VariabilityMeasureRadioButtonGroup );