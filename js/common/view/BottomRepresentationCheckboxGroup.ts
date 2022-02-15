// Copyright 2022, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens for the bottom objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { Text } from '../../../../scenery/js/imports.js';
import CASModel from '../model/CASModel.js';
import CASConstants from '../CASConstants.js';

type BottomRepresentationCheckboxGroupSelfOptions = {};
export type BottomRepresentationCheckboxGroupOptions =
  BottomRepresentationCheckboxGroupSelfOptions
  & VerticalCheckboxGroupOptions;

class BottomRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  constructor( model: CASModel, providedOptions?: BottomRepresentationCheckboxGroupOptions ) {

    const options = optionize<BottomRepresentationCheckboxGroupOptions, BottomRepresentationCheckboxGroupSelfOptions, VerticalCheckboxGroupOptions>( {}, providedOptions );

    const TEXT_OPTIONS = {
      font: CASConstants.BUTTON_FONT
    };
    const items = [ {
      // TODO: i18n
      node: new Text( 'Median', TEXT_OPTIONS ),
      property: model.isShowingBottomMedianProperty
    } ];
    super( items, options );
  }
}

centerAndSpread.register( 'BottomRepresentationCheckboxGroup', BottomRepresentationCheckboxGroup );
export default BottomRepresentationCheckboxGroup;