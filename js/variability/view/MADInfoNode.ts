// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { HBox, Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import Utils from '../../../../dot/js/Utils.js';

export default class MADInfoNode extends VBox {
  public constructor( model: VariabilityModel, chartViewWidth: number, options: PickRequired<PhetioObject, 'tandem'> ) {

    const hasEnoughDataProperty = new DerivedProperty( [ model.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );

    super( {
      align: 'left',
      spacing: 5,
      children: [
        new Text( CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty, { fontSize: 25 } ),
        new VStrut( 10 ),
        new Text( CenterAndVariabilityStrings.madDescriptionStringProperty, { fontSize: 18 } ),
        new HBox( {
          children: [ new Text( CenterAndVariabilityStrings.madCalculationPatternStringProperty, { fontSize: 18 } ) ]
        } ),

        // TODO: String key name
        // new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationPatternStringProperty, {
        //   max: model.maxValueProperty,
        //   min: model.minValueProperty
        // } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty } ),

        // TODO-design: I changed the wording slightly from the design doc
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.madCalculationResultPatternStringProperty, {
          mad: new DerivedProperty( [ model.madValueProperty ], madValue => madValue === null ? null : Utils.toFixed( madValue, 1 ) )
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty } ),
        new VStrut( 10 ),

        new VariabilityPlotNode( model, chartViewWidth, {
          staticDisplay: VariabilityMeasure.MAD,
          tandem: options.tandem.createTandem( 'variabilityPlotNode' )
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'MADInfoNode', MADInfoNode );