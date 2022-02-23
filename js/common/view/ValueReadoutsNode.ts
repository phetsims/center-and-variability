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

type ValueReadoutsNodeSelfOptions = {};
export type ValueReadoutNodeOptions = ValueReadoutsNodeSelfOptions & VBoxOptions;

class ValueReadoutsNode extends VBox {

  constructor( model: CASModel, providedOptions?: ValueReadoutNodeOptions ) {

    const meanText = new Text( '' );
    model.meanValueProperty.link( meanValue => {
      meanText.text = StringUtils.fillIn( centerAndSpreadStrings.meanEqualsValue, {
        value: meanValue === null ? '?' : Utils.toFixed( meanValue, 1 )
      } );
    } );

    const options = optionize<ValueReadoutNodeOptions, ValueReadoutsNodeSelfOptions, VBoxOptions, 'children'>( {
      children: [
        meanText
      ]
    }, providedOptions );


    super( options );
  }
}

centerAndSpread.register( 'ValueReadoutsNode', ValueReadoutsNode );
export default ValueReadoutsNode;