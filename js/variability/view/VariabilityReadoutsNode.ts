// Copyright 2022-2023, University of Colorado Boulder

/**
 * For the "Mean and Median" screen and the "Variability" screen, show the readouts on the left of the dot plot.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import { TPaint, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CAVColors from '../../common/CAVColors.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';

type SelfOptions = EmptySelfOptions;
export type ValueReadoutNodeOptions = SelfOptions & VBoxOptions;

// TODO: How to abstract and share code with ValueReadoutsNode?
export default class VariabilityReadoutsNode extends VBox {

  public constructor( model: VariabilityModel, providedOptions?: ValueReadoutNodeOptions ) {

    const createReadoutText = ( valueProperty: TReadOnlyProperty<Range | null>, visibleProperty: TReadOnlyProperty<boolean>,
                                stringTemplate: LinkableProperty<string>, fill: TPaint ) => {
      const text = new Text( '', {
        fill: fill,
        font: new PhetFont( 16 ),
        maxWidth: 170
      } );
      valueProperty.link( value => {
        text.string = StringUtils.fillIn( stringTemplate, {

          // TODO: Range is computed very differently in the RangeNode.
          // TODO: Also, perhaps instrument rangeProperty as a number|null for phet-io?
          value: value === null ? CenterAndVariabilityStrings.valueUnknownStringProperty : ( value.max - value.min )
        } );
      } );

      visibleProperty.link( visible => { text.visible = visible; } );

      return text;
    };

    const rangeText = createReadoutText(
      model.dataRangeProperty,
      DerivedProperty.and( [ model.isShowingRangeProperty, DerivedProperty.valueEqualsConstant( model.selectedVariabilityProperty, VariabilityMeasure.RANGE ) ] ),
      CenterAndVariabilityStrings.rangeEqualsValueStringProperty,
      CAVColors.meanColorProperty
    );

    const options = optionize<ValueReadoutNodeOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: 4,
      excludeInvisibleChildrenFromBounds: false,
      children: [
        rangeText
      ]
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'VariabilityReadoutsNode', VariabilityReadoutsNode );