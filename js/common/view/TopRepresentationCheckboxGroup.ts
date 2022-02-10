// Copyright 2022, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import { NodeOptions, Text } from '../../../../scenery/js/imports.js';
import CASModel from '../model/CASModel.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';

type TopRepresentationCheckboxGroupSelfOptions = {};
type VerticalCheckboxGroupOptions = NodeOptions; // TODO: Add Options in VerticalCheckboxGroup
export type TopRepresentationCheckboxGroupOptions = TopRepresentationCheckboxGroupSelfOptions & VerticalCheckboxGroupOptions;

class TopRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  constructor( model: CASModel, providedOptions?: TopRepresentationCheckboxGroupOptions ) {

    const options = optionize<TopRepresentationCheckboxGroupOptions, TopRepresentationCheckboxGroupSelfOptions, VerticalCheckboxGroupOptions>( {}, providedOptions );

    const items = [ {
      node: new Text( centerAndSpreadStrings.sortData ),
      property: model.isSortingDataProperty
    } ];
    super( items, options );
  }
}

centerAndSpread.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );
export default TopRepresentationCheckboxGroup;