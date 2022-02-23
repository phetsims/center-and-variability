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
import { HBox, Text } from '../../../../scenery/js/imports.js';
import CASModel from '../model/CASModel.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import CASConstants from '../CASConstants.js';
import NumberLineNode from './NumberLineNode.js';
import MedianBarsNode, { MedianBarsNodeOptions } from './MedianBarsNode.js';

type TopRepresentationCheckboxGroupSelfOptions = {
  includeSortData?: boolean;
  includeMedian?: boolean;
  includeMean?: boolean;
  medianBarIconOptions: MedianBarsNodeOptions;
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
      includeMean: true,
      includeMedian: true
    }, providedOptions );

    const items = [];
    options.includeSortData && items.push( {
      node: new Text( centerAndSpreadStrings.sortData, TEXT_OPTIONS ),
      property: model.isSortingDataProperty
    } );
    options.includeMean && items.push( {
      node: new HBox( {
        // TODO: align icons
        spacing: 24.5,
        children: [
          new Text( centerAndSpreadStrings.mean, TEXT_OPTIONS ),
          NumberLineNode.createMeanIndicatorNode()
        ]
      } ),
      property: model.isShowingTopMeanProperty
    } );
    options.includeMedian && items.push( {
      node: new HBox( {
        spacing: 14,
        children: [
          new Text( centerAndSpreadStrings.median, TEXT_OPTIONS ),
          new MedianBarsNode( options.medianBarIconOptions ).setMedianBarsShape( 0, 0, 5, 10 )
        ]
      } ),
      property: model.isShowingTopMedianProperty
    } );
    super( items, options );
  }
}

centerAndSpread.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );
export default TopRepresentationCheckboxGroup;