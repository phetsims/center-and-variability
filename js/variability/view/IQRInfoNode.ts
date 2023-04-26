// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import IQRNode from './IQRNode.js';

export default class IQRInfoNode extends VBox {
  public constructor( model: VariabilityModel, chartViewWidth: number, options: PickRequired<PhetioObject, 'tandem'> ) {

    const hasEnoughDataProperty = new DerivedProperty( [ model.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );
    super( {
      align: 'left',
      spacing: 5,
      children: [
        new Text( CenterAndVariabilityStrings.rangeStringProperty, { fontSize: 25 } ),
        new VStrut( 10 ),
        new Text( CenterAndVariabilityStrings.rangeDescriptionStringProperty, { fontSize: 18 } ),

        // TODO: String key name
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationPatternStringProperty, {
          max: model.maxValueProperty,
          min: model.minValueProperty
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty } ),
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationResultPatternStringProperty, {
          range: model.rangeValueProperty
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty } ),
        new VStrut( 10 ),

        new IQRNode( model, {
          parentContext: 'info',
          tandem: options.tandem.createTandem( 'iqrNode' )
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'IQRInfoNode', IQRInfoNode );