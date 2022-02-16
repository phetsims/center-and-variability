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

type TopRepresentationCheckboxGroupSelfOptions = {
  includeSortData?: boolean;
  includeShowMedian?: boolean;
  includeShowMean?: boolean;
};
export type TopRepresentationCheckboxGroupOptions = TopRepresentationCheckboxGroupSelfOptions & VerticalCheckboxGroupOptions;

// constants
const TEXT_OPTIONS = {
  font: CASConstants.BUTTON_FONT
};

class TopRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  constructor( model: CASModel, providedOptions?: TopRepresentationCheckboxGroupOptions ) {

    const options = optionize<TopRepresentationCheckboxGroupOptions, TopRepresentationCheckboxGroupSelfOptions, VerticalCheckboxGroupOptions>( {
      includeSortData: false,
      includeShowMean: true,
      includeShowMedian: true
    }, providedOptions );

    const items = [];
    options.includeSortData && items.push( {
      node: new Text( centerAndSpreadStrings.sortData, TEXT_OPTIONS ),
      property: model.isSortingDataProperty
    } );
    options.includeShowMean && items.push( {
      node: new Text( centerAndSpreadStrings.showMean, TEXT_OPTIONS ),
      property: model.isShowingTopMeanProperty
    } );
    options.includeShowMedian && items.push( {
      node: new Text( centerAndSpreadStrings.showMedian, TEXT_OPTIONS ),
      property: model.isShowingTopMedianProperty
    } );
    super( items, options );
  }
}

centerAndSpread.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );
export default TopRepresentationCheckboxGroup;