// Copyright 2022, University of Colorado Boulder

/**
 * For the "Mean and Median" screen and the "Spread" screen, show the readouts on the left of the dot plot.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import CASModel from '../model/CASModel.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Utils from '../../../../dot/js/Utils.js';
import CASColors from '../CASColors.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type ValueReadoutsNodeSelfOptions = {};
export type ValueReadoutNodeOptions = ValueReadoutsNodeSelfOptions & VBoxOptions;

class ValueReadoutsNode extends VBox {

  constructor( model: CASModel, providedOptions?: ValueReadoutNodeOptions ) {

    const createReadoutText = ( valueProperty: IReadOnlyProperty<number | null>, visibleProperty: IReadOnlyProperty<boolean>,
                                stringTemplate: string, fill: ColorDef ) => {
      const text = new Text( '', {
        fill: fill,
        font: new PhetFont( 16 )
      } );
      valueProperty.link( value => {
        text.text = StringUtils.fillIn( stringTemplate, {
          value: value === null ? centerAndSpreadStrings.valueUnknown : Utils.toFixed( value, 1 )
        } );
      } );

      visibleProperty.link( visible => { text.visible = visible; } );

      return text;
    };

    const meanText = createReadoutText( model.meanValueProperty, model.isShowingTopMeanProperty,
      centerAndSpreadStrings.meanEqualsValue, CASColors.meanColorProperty );

    const medianText = createReadoutText( model.medianValueProperty, model.isShowingTopMedianProperty,
      centerAndSpreadStrings.medianEqualsValue, CASColors.medianColorProperty );

    const options = optionize<ValueReadoutNodeOptions, ValueReadoutsNodeSelfOptions, VBoxOptions>( {
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

centerAndSpread.register( 'ValueReadoutsNode', ValueReadoutsNode );
export default ValueReadoutsNode;