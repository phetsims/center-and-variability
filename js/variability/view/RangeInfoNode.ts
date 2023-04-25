// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';

export default class RangeInfoNode extends VBox {
  public constructor( model: VariabilityModel, chartViewWidth: number, options: PickRequired<PhetioObject, 'tandem'> ) {

    const hasEnoughDataProperty = new DerivedProperty( [ model.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );
    super( {
      align: 'left',
      spacing: 5,
      children: [
        new Text( CenterAndVariabilityStrings.rangeStringProperty, { fontSize: 25 } ),
        new VStrut( 10 ),
        new Text( CenterAndVariabilityStrings.rangeDescriptionStringProperty, { fontSize: 18 } ),

        // TODO: Add "need at least 1 kick" message on the chart. But only if you click on the range checkbox
        // or show the info dialog. In that case, don't show these texts at all.
        // TODO: Range needs at least 1
        // TODO: MAD needs at least 1
        // TODO: IQR needs at least 5

        // TODO: String key name
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationPatternStringProperty, {
          max: model.maxValueProperty,
          min: model.minValueProperty
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty } ),
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationResultPatternStringProperty, {
          range: model.rangeValueProperty
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty } ),
        new VStrut( 10 ),

        // TODO: This shows it as the same size as all the other views. Is that good, or is it supposed to
        // be magnified?
        new VariabilityPlotNode( model, chartViewWidth, {
          staticDisplay: VariabilityMeasure.RANGE,
          tandem: options.tandem.createTandem( 'variabilityPlotNode' )
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'RangeInfoNode', RangeInfoNode );