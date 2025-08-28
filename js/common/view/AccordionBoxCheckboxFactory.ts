// Copyright 2022-2025, University of Colorado Boulder

/**
 * AccordionBoxCheckboxFactory is responsible for generating checkboxes with associated functionality
 * for use within an AccordionBox. The factory provides methods to create checkboxes with various
 * types of indicators, such as text, icons, and specific configurations for median and mean
 * representation. The created checkboxes can be used to control different elements and Properties
 * within the simulation's interface, and some of the checkboxes come with associated sound effects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import nullSoundPlayer from '../../../../tambo/js/nullSoundPlayer.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import MeanIndicatorNode from './MeanIndicatorNode.js';
import MedianBarNode from './MedianBarNode.js';
import PlayAreaCheckboxFactory from './PlayAreaCheckboxFactory.js';

// constants
const ICON_WIDTH = CAVConstants.CHECKBOX_ICON_DIMENSION;

const LINE_WIDTH = MedianBarNode.LINE_WIDTH;

const TEXT_GROUP = new AlignGroup();
const ICON_GROUP = new AlignGroup();
const CHECKBOX_GROUP = new AlignGroup();

export default class AccordionBoxCheckboxFactory {

  public static createGridBox( text: Node, icon: Node ): Node {
    return CHECKBOX_GROUP.createBox( new GridBox( {
      spacing: 10,
      stretch: true,
      grow: 1,
      rows: [ [
        TEXT_GROUP.createBox( text, { xAlign: 'left' } ),
        ICON_GROUP.createBox( icon, { xAlign: 'right' } )
      ] ]
    } ) );
  }

  public static getSortDataCheckboxItem( isSortingDataProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: () => CHECKBOX_GROUP.createBox( new Text( CenterAndVariabilityStrings.sortDataStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ), { xAlign: 'left' } ),
      property: isSortingDataProperty,
      tandemName: 'sortDataCheckbox',
      options: {

        // Sound will be played in the model based on whether the data is already sorted or not
        checkedSoundPlayer: nullSoundPlayer,
        accessibleName: CenterAndVariabilityStrings.a11y.medianScreen.sortDataCheckbox.accessibleNameStringProperty,
        accessibleHelpText: CenterAndVariabilityStrings.a11y.medianScreen.sortDataCheckbox.accessibleHelpTextStringProperty
      }
    };
  }

  public static getMedianCheckboxWithIconItem( medianVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: () => {
        return AccordionBoxCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
          new MedianBarNode( {
            barStyle: 'continuous',
            arrowScale: 0.75
          } ).setMedianBarShape( 0, 0, ICON_WIDTH / 2 - LINE_WIDTH / 2, ICON_WIDTH - LINE_WIDTH, true )
        );
      },
      property: medianVisibleProperty,
      tandemName: 'medianCheckbox',

      options: {
        phetioDisplayOnlyPropertyInstrumented: true,

        // Sound managed in the MedianAnimationTone
        checkedSoundPlayer: nullSoundPlayer,
        accessibleName: CenterAndVariabilityStrings.a11y.meanAndMedianScreen.plotMedianCheckbox.accessibleNameStringProperty,
        accessibleHelpText: CenterAndVariabilityStrings.a11y.meanAndMedianScreen.plotMedianCheckbox.accessibleHelpTextStringProperty
      }
    };
  }

  public static getMedianCheckboxWithoutIconItem( medianVisibleProperty: Property<boolean>, selectedSceneModelProperty: TReadOnlyProperty<CAVSoccerSceneModel> ): VerticalCheckboxGroupItem {
    return {
      createNode: () => CHECKBOX_GROUP.createBox( new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ), { xAlign: 'left' } ),
      property: medianVisibleProperty,
      tandemName: 'medianCheckbox',
      options: {
        checkedSoundPlayer: PlayAreaCheckboxFactory.getMedianCheckedSoundPlayer( selectedSceneModelProperty ),
        accessibleName: CenterAndVariabilityStrings.a11y.medianScreen.medianCheckbox.accessibleNameStringProperty,
        accessibleHelpText: CenterAndVariabilityStrings.a11y.medianScreen.medianCheckbox.accessibleHelpTextStringProperty
      }
    };
  }

  public static getMeanCheckboxWithIconItem( isTopMeanVisibleProperty: Property<boolean>, selectedSceneModelProperty: TReadOnlyProperty<CAVSoccerSceneModel> ): VerticalCheckboxGroupItem {
    return {
      createNode: () => {
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
              new MeanIndicatorNode( false, true )
            ]
          } )
        );
      },
      property: isTopMeanVisibleProperty,
      tandemName: 'meanCheckbox',
      options: {
        checkedSoundPlayer: PlayAreaCheckboxFactory.getMeanCheckedSoundPlayer( selectedSceneModelProperty ),
        accessibleName: CenterAndVariabilityStrings.a11y.meanAndMedianScreen.meanCheckbox.accessibleNameStringProperty,
        accessibleHelpText: CenterAndVariabilityStrings.a11y.meanAndMedianScreen.meanCheckbox.accessibleHelpTextStringProperty,
        phetioDisplayOnlyPropertyInstrumented: true
      }
    };
  }
}

centerAndVariability.register( 'AccordionBoxCheckboxFactory', AccordionBoxCheckboxFactory );