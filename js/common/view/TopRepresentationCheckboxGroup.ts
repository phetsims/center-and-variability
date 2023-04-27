// Copyright 2022-2023, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { AlignGroup, GridBox, Line, Node, Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import NumberLineNode from './NumberLineNode.js';
import MedianBarNode from './MedianBarNode.js';
import CAVColors from '../CAVColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';

// constants
const ICON_WIDTH = 24;

// TODO: Unify with line with in MedianBarNode?
const LINE_WIDTH = 2;

export default class TopRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  private static createGridBox( text: Node, icon: Node, iconGroup: AlignGroup ): GridBox {
    return new GridBox( {
      rows: [ [ new Node( { children: [ text ], layoutOptions: { align: 'left' } } ),
        iconGroup.createBox( icon, { xAlign: 'center', layoutOptions: { xAlign: 'right' } } ) ]
      ]
    } );
  }

  public static getSortDataCheckboxItem( isSortingDataProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => new Text( CenterAndVariabilityStrings.sortDataStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      property: isSortingDataProperty,
      tandemName: 'sortDataCheckbox'
    };
  }

  public static getMedianCheckboxWithIconItem( iconGroup: AlignGroup, isShowingTopMedianProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return TopRepresentationCheckboxGroup.createGridBox(
          new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
          new MedianBarNode( {
            notchDirection: 'up',
            barStyle: 'continuous'
          } )
            .setMedianBarShape( 0, 0, ICON_WIDTH / 2 - LINE_WIDTH / 2, ICON_WIDTH - LINE_WIDTH, true ),
          iconGroup
        );
      },
      property: isShowingTopMedianProperty,
      tandemName: 'medianCheckbox'
    };
  }

  public static getMedianCheckboxWithoutIconItem( isShowingTopMedianProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      property: isShowingTopMedianProperty,
      tandemName: 'medianCheckbox'
    };
  }

  public static getMeanCheckboxWithIconItem( iconGroup: AlignGroup, isShowingTopMeanProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return TopRepresentationCheckboxGroup.createGridBox(
          new Text( CenterAndVariabilityStrings.meanStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
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
          } ),
          iconGroup
        );
      },
      property: isShowingTopMeanProperty,
      tandemName: 'meanCheckbox'
    };
  }
}

centerAndVariability.register( 'TopRepresentationCheckboxGroup', TopRepresentationCheckboxGroup );