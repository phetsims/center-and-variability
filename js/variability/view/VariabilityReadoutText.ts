// Copyright 2023, University of Colorado Boulder

/**
 * For the "Mean and Median" screen and the "Variability" screen, show the readouts on the left of the dot plot.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import { HBox, Text, TextOptions } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
export type ValueReadoutTextOptions = SelfOptions & TextOptions;

export default class VariabilityReadoutText extends HBox {


  public constructor( stringProperty: TReadOnlyProperty<string>, variabilityMeasureProperty: TReadOnlyProperty<number | null>, visibleProperty: TReadOnlyProperty<boolean>, providedOptions: ValueReadoutTextOptions ) {


    const options = optionize<ValueReadoutTextOptions, SelfOptions, TextOptions>()( {
      font: new PhetFont( 16 ),
      maxWidth: 100
    }, providedOptions );

    const variabilityValueText = new Text( stringProperty, options );
    const metersVisibleProperty = new DerivedProperty( [ variabilityMeasureProperty, visibleProperty ], ( variabilityMeasure, visible ) => {
      return variabilityMeasure !== null && visible;
    } );

    const metersAbbreviationText = new Text( CenterAndVariabilityStrings.metersAbbreviationStringProperty, {
      visibleProperty: metersVisibleProperty,
      font: new PhetFont( 16 ),
      fill: options.fill
    } );

    super( { children: [ variabilityValueText, metersAbbreviationText ], spacing: 4, excludeInvisibleChildrenFromBounds: false } );
  }
}

centerAndVariability.register( 'VariabilityReadoutText', VariabilityReadoutText );