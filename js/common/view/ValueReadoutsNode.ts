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
import CAVSceneModel from '../model/CAVSceneModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVColors from '../CAVColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';

type SelfOptions = EmptySelfOptions;
export type ValueReadoutNodeOptions = SelfOptions & VBoxOptions;

export default class ValueReadoutsNode extends VBox {

  public constructor( model: CAVSceneModel, providedOptions?: ValueReadoutNodeOptions ) {

    const createReadoutText = ( valueProperty: TReadOnlyProperty<number | null>, visibleProperty: TReadOnlyProperty<boolean>,
                                stringTemplate: LinkableProperty<string>, fill: TPaint ) => {
      const text = new Text( '', {
        fill: fill,
        font: new PhetFont( 16 ),
        maxWidth: 170
      } );
      valueProperty.link( value => {
        text.string = StringUtils.fillIn( stringTemplate, {
          value: value === null ? CenterAndVariabilityStrings.valueUnknownStringProperty : Utils.toFixed( value, 1 )
        } );
      } );

      visibleProperty.link( visible => { text.visible = visible; } );

      return text;
    };

    const meanText = createReadoutText( model.meanValueProperty, model.isShowingTopMeanProperty,
      CenterAndVariabilityStrings.meanEqualsValuePatternStringProperty, CAVColors.meanColorProperty );

    const medianText = createReadoutText( model.medianValueProperty, model.isShowingTopMedianProperty,
      CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty, CAVColors.medianColorProperty );

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