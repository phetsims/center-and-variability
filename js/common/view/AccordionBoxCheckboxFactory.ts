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
import MedianBarNode from './MedianBarNode.js';
import CAVColors from '../CAVColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import PlayAreaCheckboxFactory from './PlayAreaCheckboxFactory.js';
import CAVModel from '../model/CAVModel.js';
import CardNodeContainer from '../../median/view/CardNodeContainer.js';
import SoccerSceneModel from '../../soccer-common/model/SoccerSceneModel.js';
import MeanIndicatorNode from './MeanIndicatorNode.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';

// constants
const ICON_WIDTH = CAVConstants.CHECKBOX_ICON_DIMENSION;

const LINE_WIDTH = MedianBarNode.LINE_WIDTH;

export default class AccordionBoxCheckboxFactory {

  public static createGridBox( text: Node, icon: Node, iconGroup: AlignGroup, textGroup: AlignGroup ): GridBox {
    return new GridBox( {
      spacing: 10,
      stretch: true,
      grow: 1,
      rows: [ [
        textGroup.createBox( text, { xAlign: 'left' } ),
        iconGroup.createBox( icon, { xAlign: 'right' } )
      ] ]
    } );
  }

  public static getSortDataCheckboxItem( isSortingDataProperty: Property<boolean>, sceneModel: SoccerSceneModel, cardNodeContainer: CardNodeContainer ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => new Text( CenterAndVariabilityStrings.sortDataStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      property: isSortingDataProperty,
      tandemName: 'sortDataCheckbox',
      options: {

        // Sound will be played in the model based on whether the data is already sorted or not
        checkedSoundPlayer: nullSoundPlayer
      }
    };
  }

  public static getMedianCheckboxWithIconItem( iconGroup: AlignGroup, textGroup: AlignGroup, isTopMedianVisibleProperty: Property<boolean>, model: CAVModel ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => {
        return AccordionBoxCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
          new MedianBarNode( {
            barStyle: 'continuous',
            arrowScale: 0.75
          } )
            .setMedianBarShape( 0, 0, ICON_WIDTH / 2 - LINE_WIDTH / 2, ICON_WIDTH - LINE_WIDTH, true ),
          iconGroup, textGroup
        );
      },
      property: isTopMedianVisibleProperty,
      tandemName: 'medianCheckbox',

      options: {

        // Sound managed in the MedianAnimationTone
        checkedSoundPlayer: nullSoundPlayer
      }
    };
  }

  public static getMedianCheckboxWithoutIconItem( isTopMedianVisibleProperty: Property<boolean>, model: CAVModel ): VerticalCheckboxGroupItem {
    return {
      createNode: ( tandem: Tandem ) => new Text( CenterAndVariabilityStrings.medianStringProperty, CAVConstants.CHECKBOX_TEXT_OPTIONS ),
      property: isTopMedianVisibleProperty,
      tandemName: 'medianCheckbox',
      options: {
        checkedSoundPlayer: PlayAreaCheckboxFactory.getMedianCheckedSoundPlayer( model )
      }
    };
  }

  public static getMeanCheckboxWithIconItem( iconGroup: AlignGroup, textGroup: AlignGroup, isTopMeanVisibleProperty: Property<boolean>, model: CAVModel ): VerticalCheckboxGroupItem {
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
              new MeanIndicatorNode( false, true )
            ]
          } ),
          iconGroup, textGroup
        );
      },
      property: isTopMeanVisibleProperty,
      tandemName: 'meanCheckbox',
      options: {
        checkedSoundPlayer: PlayAreaCheckboxFactory.getMeanCheckedSoundPlayer( model )
      }
    };
  }
}

centerAndVariability.register( 'AccordionBoxCheckboxFactory', AccordionBoxCheckboxFactory );