// Copyright 2022, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { HBox, Line, Node, Text } from '../../../../scenery/js/imports.js';
import CAVModel from '../model/CAVModel.js';
import centerAndVariabilityStrings from '../../centerAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import NumberLineNode from './NumberLineNode.js';
import MedianBarNode, { MedianBarNodeOptions } from './MedianBarNode.js';
import CAVColors from '../CAVColors.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  includeSortData?: boolean;
  includeMedian?: boolean;
  includeMean?: boolean;
  medianBarIconOptions: MedianBarNodeOptions;
  showMedianCheckboxIcon: boolean;
};
export type TopRepresentationCheckboxGroupOptions = SelfOptions & VerticalCheckboxGroupOptions &
  PickRequired<VerticalCheckboxGroupOptions, 'tandem'>;

// constants
const ICON_WIDTH = 24;

// TODO: Unify with line with in MedianBarNode?
const LINE_WIDTH = 2;
const TEXT_OPTIONS = {
  font: CAVConstants.BUTTON_FONT,
  maxWidth: CAVConstants.PLAY_AREA_CHECKBOX_TEXT_MAX_WIDTH
};

class TopRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  public constructor( model: CAVModel, providedOptions?: TopRepresentationCheckboxGroupOptions ) {

    const options = optionize<TopRepresentationCheckboxGroupOptions, SelfOptions, VerticalCheckboxGroupOptions>()( {
      includeSortData: false,
      includeMean: true,
      includeMedian: true
    }, providedOptions );

    const items = [];
    options.includeSortData && items.push( {
      node: new Text( centerAndVariabilityStrings.sortData, TEXT_OPTIONS ),
      property: model.isSortingDataProperty,
      tandem: options.tandem.createTandem( 'sortDataCheckbox' )
    } );
    options.includeMean && items.push( {
      node: new HBox( {

        // TODO: align icons
        spacing: 24.5,
        children: [
          new Text( centerAndVariabilityStrings.mean, TEXT_OPTIONS ),
          new Node( {
            children: [

              // Horizontal line above the triangle
              new Line( -ICON_WIDTH / 2, -LINE_WIDTH / 2, ICON_WIDTH / 2, -LINE_WIDTH / 2, {
                stroke: CAVColors.meanColorProperty,
                lineWidth: LINE_WIDTH
              } ),

              // Triangle
              NumberLineNode.createMeanIndicatorNode( false )
            ]
          } )
        ]
      } ),
      property: model.isShowingTopMeanProperty,
      tandem: options.tandem.createTandem( 'meanCheckbox' )
    } );
    options.includeMedian && items.push( {
      node: new HBox( {
        spacing: 12,
        children: [
          new Text( centerAndVariabilityStrings.median, TEXT_OPTIONS ),
          ...options.showMedianCheckboxIcon ? [
            new MedianBarNode( options.medianBarIconOptions )
              .setMedianBarShape( 0, 0, ICON_WIDTH / 2 - LINE_WIDTH / 2, ICON_WIDTH - LINE_WIDTH, true )
          ] : []
        ]
      } ),
      property: model.isShowingTopMedianProperty,
      tandem: options.tandem.createTandem( 'medianCheckbox' )
    } );
    super( items, options );
  }
}

centerAndVariability.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );
export default TopRepresentationCheckboxGroup;