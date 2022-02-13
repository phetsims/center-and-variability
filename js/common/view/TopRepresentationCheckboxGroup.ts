// Copyright 2022, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { Text } from '../../../../scenery/js/imports.js';
import CASModel from '../model/CASModel.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import CASConstants from '../CASConstants.js';

type TopRepresentationCheckboxGroupSelfOptions = {};
export type TopRepresentationCheckboxGroupOptions = TopRepresentationCheckboxGroupSelfOptions & VerticalCheckboxGroupOptions;

class TopRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  constructor( model: CASModel, providedOptions?: TopRepresentationCheckboxGroupOptions ) {

    const options = optionize<TopRepresentationCheckboxGroupOptions, TopRepresentationCheckboxGroupSelfOptions, VerticalCheckboxGroupOptions>( {}, providedOptions );

    const TEXT_OPTIONS = {
      font: CASConstants.BUTTON_FONT
    };
    const items = [ {
      node: new Text( centerAndSpreadStrings.sortData, TEXT_OPTIONS ),
      property: model.isSortingDataProperty
    }, {
      node: new Text( 'Show Median', TEXT_OPTIONS ),
      property: model.isShowingMedianProperty
    } ];
    super( items, options );
  }
}

centerAndSpread.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );
export default TopRepresentationCheckboxGroup;