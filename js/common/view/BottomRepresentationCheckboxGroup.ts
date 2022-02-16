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
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';

type BottomRepresentationCheckboxGroupSelfOptions = {
  includeMedian?: boolean,
  includeMean?: boolean
};
export type BottomRepresentationCheckboxGroupOptions =
  BottomRepresentationCheckboxGroupSelfOptions
  & VerticalCheckboxGroupOptions;

// constants
const TEXT_OPTIONS = {
  font: CASConstants.BUTTON_FONT
};

class BottomRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  constructor( model: CASModel, providedOptions?: BottomRepresentationCheckboxGroupOptions ) {

    const options = optionize<BottomRepresentationCheckboxGroupOptions, BottomRepresentationCheckboxGroupSelfOptions, VerticalCheckboxGroupOptions>( {
      includeMean: true,
      includeMedian: true
    }, providedOptions );

    const items = [];
    options.includeMean && items.push( {
      node: new Text( centerAndSpreadStrings.mean, TEXT_OPTIONS ),
      property: model.isShowingBottomMeanProperty
    } );
    options.includeMedian && items.push( {
      node: new Text( centerAndSpreadStrings.median, TEXT_OPTIONS ),
      property: model.isShowingBottomMedianProperty
    } );
    super( items, options );
  }
}

centerAndSpread.register( 'BottomRepresentationCheckboxGroup', BottomRepresentationCheckboxGroup );
export default BottomRepresentationCheckboxGroup;