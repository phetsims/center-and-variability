// Copyright 2023, University of Colorado Boulder

/**
 * Radio Button group that allows use to choose between the different variability measures.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import RangeIconNode from './RangeIconNode.js';
import IQRIconNode from './IQRIconNode.js';
import MADIconNode from './MADIconNode.js';

type SelfOptions = EmptySelfOptions;
type VariabilityMeasureRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class VariabilityMeasureRadioButtonGroup extends RectangularRadioButtonGroup<VariabilityMeasure> {

  public constructor( property: Property<VariabilityMeasure>, providedOptions: VariabilityMeasureRadioButtonGroupOptions ) {
    const options = optionize<VariabilityMeasureRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      spacing: 5,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 0,
        yMargin: 0,
        buttonAppearanceStrategyOptions: {
          selectedLineWidth: 3
        }
      },
      isDisposable: false,
      touchAreaXDilation: 5,
      touchAreaYDilation: 2.5
    }, providedOptions );

    super( property, [ {
        value: VariabilityMeasure.RANGE,
        createNode: () => new RangeIconNode(),
        tandemName: 'rangeRadioButton'
      }, {
        value: VariabilityMeasure.IQR,
        createNode: () => new IQRIconNode(),
        tandemName: 'iqrRadioButton'
      }, {
        value: VariabilityMeasure.MAD,
        createNode: () => new MADIconNode(),
        tandemName: 'madRadioButton'
      } ],
      options
    );
  }
}

centerAndVariability.register( 'VariabilityMeasureRadioButtonGroup', VariabilityMeasureRadioButtonGroup );