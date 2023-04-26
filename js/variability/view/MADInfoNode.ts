// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { HBox, HSeparator, Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import Utils from '../../../../dot/js/Utils.js';
import MADNode from './MADNode.js';

export default class MADInfoNode extends VBox {
  public constructor( model: VariabilityModel, options: PickRequired<PhetioObject, 'tandem'> ) {

    // TODO-design: Should we change this to >1 ? Since you need >1 to show a calculation?
    const hasEnoughDataProperty = new DerivedProperty( [ model.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );

    const numeratorText = new Text( '', { fontSize: 16 } );
    const denominatorText = new Text( '', { fontSize: 16 } );

    const resultNumeratorText = new Text( '', { fontSize: 16 } );
    const resultDenominatorText = new Text( '', { fontSize: 16 } );

    model.objectChangedEmitter.addListener( () => {
      const values = model.getSortedLandedObjects().map( landedObject => landedObject.valueProperty.value! );
      const mads = values.map( value => Math.abs( value - model.meanValueProperty.value! ) );
      const madStrings = mads.map( mad => Utils.toFixed( mad, 1 ) );
      numeratorText.string = madStrings.join( ' + ' );
      denominatorText.string = values.length.toString();

      // TODO-design: If the roundings don't match up, should we keep adding decimal points until the roundings match?
      const sum = _.reduce( mads, ( sum, mad ) => sum + mad, 0 );
      resultNumeratorText.string = Utils.toFixed( sum, 1 );
      resultDenominatorText.string = values.length.toString();
    } );

    const calculationFraction = new VBox( {
      children: [ numeratorText, new HSeparator(), denominatorText ],
      align: 'center'
    } );

    const resultFraction = new VBox( {
      children: [ resultNumeratorText, new HSeparator(), resultDenominatorText ],
      align: 'center'
    } );

    super( {
      align: 'left',
      spacing: 6,
      children: [
        new Text( CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty, { fontSize: 25 } ),
        new VStrut( 10 ),
        new Text( CenterAndVariabilityStrings.madDescriptionStringProperty, { fontSize: 18 } ),
        new VStrut( 10 ),
        new HBox( {
          spacing: 10,
          children: [
            new Text( CenterAndVariabilityStrings.madCalculationPatternStringProperty, { fontSize: 18 } ),
            calculationFraction,

            // TODO-design: We don't typically i18n math, and even if we did, we don't have a placeholder language
            // to put nodes in the placeholders. So probably this is good. But should be translate the equals sign anyways?
            new Text( '=', { fontSize: 18 } ),
            resultFraction
          ],
          visibleProperty: hasEnoughDataProperty
        } ),

        // TODO-design: I changed the wording slightly from the design doc
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.madCalculationResultPatternStringProperty, {
          mad: new DerivedProperty( [ model.madValueProperty ], madValue => madValue === null ? null : Utils.toFixed( madValue, 1 ) )
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty } ),
        new VStrut( 10 ),

        new MADNode( model, {
          parentContext: 'info',
          tandem: options.tandem.createTandem( 'madNode' )
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'MADInfoNode', MADInfoNode );