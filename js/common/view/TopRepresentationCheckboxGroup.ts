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
import { HBox, Line, Node, Text } from '../../../../scenery/js/imports.js';
import CASModel from '../model/CASModel.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import CASConstants from '../CASConstants.js';
import NumberLineNode from './NumberLineNode.js';
import MedianBarNode, { MedianBarNodeOptions } from './MedianBarNode.js';
import CASColors from '../CASColors.js';

type SelfOptions = {
  includeSortData?: boolean;
  includeMedian?: boolean;
  includeMean?: boolean;
  medianBarIconOptions: MedianBarNodeOptions;
  showMedianCheckboxIcon: boolean;
};
export type TopRepresentationCheckboxGroupOptions = SelfOptions & VerticalCheckboxGroupOptions;

// constants
const ICON_WIDTH = 24;

// TODO: Unify with line with in MedianBarNode?
const LINE_WIDTH = 2;
const TEXT_OPTIONS = {
  font: CASConstants.BUTTON_FONT,
  maxWidth: CASConstants.CHECKBOX_TEXT_MAX_WIDTH
};

class TopRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  constructor( model: CASModel, providedOptions?: TopRepresentationCheckboxGroupOptions ) {

    const options = optionize<TopRepresentationCheckboxGroupOptions, SelfOptions, VerticalCheckboxGroupOptions>( {
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
          new Node( {
            children: [

              // Horizontal line above the triangle
              new Line( -ICON_WIDTH / 2, -LINE_WIDTH / 2, ICON_WIDTH / 2, -LINE_WIDTH / 2, {
                stroke: CASColors.meanColorProperty,
                lineWidth: LINE_WIDTH
              } ),

              // Triangle
              NumberLineNode.createMeanIndicatorNode()
            ]
          } )
        ]
      } ),
      property: model.isShowingTopMeanProperty
    } );
    options.includeMedian && items.push( {
      node: new HBox( {
        spacing: 12,
        children: [
          new Text( centerAndSpreadStrings.median, TEXT_OPTIONS ),
          ...options.showMedianCheckboxIcon ? [
            new MedianBarNode( options.medianBarIconOptions )
              .setMedianBarShape( 0, 0, ICON_WIDTH / 2 - LINE_WIDTH / 2, ICON_WIDTH - LINE_WIDTH, true )
          ] : []
        ]
      } ),
      property: model.isShowingTopMedianProperty
    } );
    super( items, options );
  }
}

centerAndSpread.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );
export default TopRepresentationCheckboxGroup;