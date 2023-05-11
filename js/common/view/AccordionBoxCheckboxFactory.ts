// Copyright 2022-2023, University of Colorado Boulder

/**
 * Factory that creates checkboxes for the AccordionBox.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
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

const LINE_WIDTH = MedianBarNode.LINE_WIDTH;

export default class AccordionBoxCheckboxFactory {

  private static createGridBox( text: Node, icon: Node, iconGroup: AlignGroup ): GridBox {
    return new GridBox( {
      spacing: 10,
      stretch: true,
      grow: 1,
      rows: [ [ new Node( { children: [ text ], layoutOptions: { xAlign: 'left' } } ),
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

  public static getMedianCheckboxWithIconItem( iconGroup: AlignGroup, isTopMedianVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return AccordionBoxCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
          new MedianBarNode( {
            notchDirection: 'down',
            barStyle: 'continuous',
            arrowScale: 0.75
          } )
            .setMedianBarShape( 0, 0, ICON_WIDTH / 2 - LINE_WIDTH / 2, ICON_WIDTH - LINE_WIDTH, true ),
          iconGroup
        );
      },
      property: isTopMedianVisibleProperty,
      tandemName: 'medianCheckbox'
    };
  }

  public static getMedianCheckboxWithoutIconItem( isTopMedianVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      property: isTopMedianVisibleProperty,
      tandemName: 'medianCheckbox'
    };
  }

  public static getMeanCheckboxWithIconItem( iconGroup: AlignGroup, isTopMeanVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return AccordionBoxCheckboxFactory.createGridBox(
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
      property: isTopMeanVisibleProperty,
      tandemName: 'meanCheckbox'
    };
  }

  public static getRangeCheckboxWithIconItem( iconGroup: AlignGroup, isRangeVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return AccordionBoxCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.rangeStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
          // TODO: Replace with range icon, see https://github.com/phetsims/center-and-variability/issues/156
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
      property: isRangeVisibleProperty,
      tandemName: 'rangeCheckbox'
    };
  }

  public static getIQRCheckboxWithIconItem( iconGroup: AlignGroup, isIQRVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return AccordionBoxCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.iqrStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
          // TODO: Replace with IQR icon, see https://github.com/phetsims/center-and-variability/issues/156
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
      property: isIQRVisibleProperty,
      tandemName: 'iqrCheckbox'
    };
  }

  public static getMADCheckboxWithIconItem( iconGroup: AlignGroup, isMADVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return AccordionBoxCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.madStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
          // TODO: Replace with MAD icon, see https://github.com/phetsims/center-and-variability/issues/156
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
      property: isMADVisibleProperty,
      tandemName: 'madCheckbox'
    };
  }
}

centerAndVariability.register( 'AccordionBoxCheckboxFactory', AccordionBoxCheckboxFactory );