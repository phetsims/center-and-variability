// Copyright 2022, University of Colorado Boulder

/**
 * For the "Mean and Median" screen and the "Variability" screen, show the readouts on the left of the dot plot.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import { TPaint, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import CAVModel from '../model/CAVModel.js';
import centerAndVariabilityStrings from '../../centerAndVariabilityStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVColors from '../CAVColors.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type SelfOptions = EmptySelfOptions;
export type ValueReadoutNodeOptions = SelfOptions & VBoxOptions;

class ValueReadoutsNode extends VBox {

  public constructor( model: CAVModel, providedOptions?: ValueReadoutNodeOptions ) {

    const createReadoutText = ( valueProperty: IReadOnlyProperty<number | null>, visibleProperty: IReadOnlyProperty<boolean>,
                                stringTemplate: string, fill: TPaint ) => {
      const text = new Text( '', {
        fill: fill,
        font: new PhetFont( 16 ),
        maxWidth: 170
      } );
      valueProperty.link( value => {
        text.text = StringUtils.fillIn( stringTemplate, {
          value: value === null ? centerAndVariabilityStrings.valueUnknown : Utils.toFixed( value, 1 )
        } );
      } );

      visibleProperty.link( visible => { text.visible = visible; } );

      return text;
    };

    const meanText = createReadoutText( model.meanValueProperty, model.isShowingTopMeanProperty,
      centerAndVariabilityStrings.meanEqualsValue, CAVColors.meanColorProperty );

    const medianText = createReadoutText( model.medianValueProperty, model.isShowingTopMedianProperty,
      centerAndVariabilityStrings.medianEqualsValue, CAVColors.medianColorProperty );

    const options = optionize<ValueReadoutNodeOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: 4,
      excludeInvisibleChildrenFromBounds: false,
      children: [
        meanText,
        medianText
      ]
    }, providedOptions );

    super( options );
  }
}

centerAndVariability.register( 'ValueReadoutsNode', ValueReadoutsNode );
export default ValueReadoutsNode;