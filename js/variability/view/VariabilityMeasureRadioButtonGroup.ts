// Copyright 2023-2025, University of Colorado Boulder

/**
 * VariabilityMeasureRadioButtonGroup is a radio button group that allows use to choose between the different variability measures.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import IQRIconNode from './IQRIconNode.js';
import MADIconNode from './MADIconNode.js';
import RangeIconNode from './RangeIconNode.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

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
      touchAreaYDilation: 2.5,
      accessibleName: CenterAndVariabilityFluent.a11y.variability.measuresRadioButtonGroup.groupNameStringProperty,
      accessibleHelpText: CenterAndVariabilityFluent.a11y.variability.measuresRadioButtonGroup.accessibleHelpTextStringProperty
    }, providedOptions );

    super( property, [ {
        value: VariabilityMeasure.RANGE,
        createNode: () => new RangeIconNode(),
        tandemName: 'rangeRadioButton',
        options: {
          accessibleName: CenterAndVariabilityFluent.rangeStringProperty
        }
      }, {
        value: VariabilityMeasure.IQR,
        createNode: () => new IQRIconNode(),
        tandemName: 'iqrRadioButton',
        options: {
          accessibleName: CenterAndVariabilityFluent.interquartileRangeIQRStringProperty
        }
      }, {
        value: VariabilityMeasure.MAD,
        createNode: () => new MADIconNode(),
        tandemName: 'madRadioButton',
        options: {
          accessibleName: CenterAndVariabilityFluent.meanAbsoluteDeviationMADStringProperty
        }
      } ],
      options
    );
  }
}

centerAndVariability.register( 'VariabilityMeasureRadioButtonGroup', VariabilityMeasureRadioButtonGroup );