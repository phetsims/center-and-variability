// Copyright 2023, University of Colorado Boulder

import { Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import Dialog from '../../../../sun/js/Dialog.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

export default class InfoDialog extends Dialog {
  public constructor( model: VariabilityModel, chartViewWidth: number ) {

    const content = new ToggleNode( model.selectedVariabilityProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: tandem => {
        return new VBox( {
          align: 'left',
          spacing: 5,
          children: [
            new Text( CenterAndVariabilityStrings.rangeStringProperty, { fontSize: 25 } ),

            new VStrut( 10 ),

            // TODO: i18n
            new Text( 'Range is the distance between the maximum and minimum data points.', { fontSize: 18 } ),

            // TODO: Add "need at least 1 kick" message on the chart

            // TODO: String key name
            new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationPatternStringProperty, {
              max: model.maxValueProperty,
              min: model.minValueProperty
            } ), { fontSize: 18 } ),
            new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationResultPatternStringProperty, {
              range: model.rangeValueProperty
            } ), { fontSize: 18 } ),

            // TODO: This shows it as the same size as all the other views. Is that good, or is it supposed to
            // be magnified?
            new VariabilityPlotNode( model, chartViewWidth, {

              staticDisplay: VariabilityMeasure.RANGE,

              // TODO: Tandem
              tandem: Tandem.OPT_OUT
            } )
          ]
        } );
      }
    }, {
      value: VariabilityMeasure.IQR,
      createNode: tandem => {
        return new Text( 'IQR' );
      }
    }, {
      value: VariabilityMeasure.MAD,
      createNode: tandem => {
        return new Text( 'IQR' );
      }
    } ] );

    super( content, {

      // TODO: It seems there are 2 ways to hide the dialog. Is there a better way?
      hideCallback: () => model.isInfoShowingProperty.set( false )
    } );
  }
}

centerAndVariability.register( 'InfoDialog', InfoDialog );