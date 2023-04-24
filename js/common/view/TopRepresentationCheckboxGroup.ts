// Copyright 2022-2023, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { HBox, Line, Node, Text } from '../../../../scenery/js/imports.js';
import CAVModel from '../model/CAVModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import NumberLineNode from './NumberLineNode.js';
import MedianBarNode, { MedianBarNodeOptions } from './MedianBarNode.js';
import CAVColors from '../CAVColors.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VariabilityModel from '../../variability/model/VariabilityModel.js';

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

export default class TopRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  public constructor( model: CAVModel, providedOptions?: TopRepresentationCheckboxGroupOptions ) {

    const options = optionize<TopRepresentationCheckboxGroupOptions, SelfOptions, VerticalCheckboxGroupOptions>()( {
      includeSortData: false,
      includeMean: true,
      includeMedian: true
    }, providedOptions );

    const items: VerticalCheckboxGroupItem[] = [];
    options.includeSortData && items.push( {
      createNode: ( tandem: Tandem ) => new Text( CenterAndVariabilityStrings.sortDataStringProperty, TEXT_OPTIONS ),
      property: model.isSortingDataProperty,
      tandemName: 'sortDataCheckbox'
    } );
    options.includeMean && items.push( {
      createNode: ( tandem: Tandem ) => new HBox( {

        // TODO: align icons
        spacing: 24.5,
        children: [
          new Text( CenterAndVariabilityStrings.meanStringProperty, TEXT_OPTIONS ),
          new Node( {
            children: [

              // Horizontal line above the triangle
              new Line( -ICON_WIDTH / 2, -LINE_WIDTH / 2, ICON_WIDTH / 2, -LINE_WIDTH / 2, {
                stroke: CAVColors.meanColorProperty,
                lineWidth: LINE_WIDTH
              } ),

              // Triangle
              NumberLineNode.createMeanIndicatorNode( false, true )
            ]
          } )
        ]
      } ),
      property: model.isShowingTopMeanProperty,
      tandemName: 'meanCheckbox'
    } );
    options.includeMedian && items.push( {
      createNode: ( tandem: Tandem ) => new HBox( {
        spacing: 12,
        children: [
          new Text( CenterAndVariabilityStrings.medianStringProperty, TEXT_OPTIONS ),
          ...options.showMedianCheckboxIcon ? [
            new MedianBarNode( options.medianBarIconOptions )
              .setMedianBarShape( 0, 0, ICON_WIDTH / 2 - LINE_WIDTH / 2, ICON_WIDTH - LINE_WIDTH, true )
          ] : []
        ]
      } ),
      property: model.isShowingTopMedianProperty,
      tandemName: 'medianCheckbox'
    } );

    // TODO: See https://github.com/phetsims/center-and-variability/issues/153
    ( model instanceof VariabilityModel ) && items.push( {
      createNode: ( tandem: Tandem ) => new HBox( {
        spacing: 12,
        children: [

          // TODO: Different i18n key for Range title vs range checkbox?
          new Text( CenterAndVariabilityStrings.rangeStringProperty, TEXT_OPTIONS )
        ]
      } ),
      property: model.isShowingRangeProperty,
      tandemName: 'rangeCheckbox'
    } );
    super( items, options );
  }
}

centerAndVariability.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );