// Copyright 2022-2023, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens for the bottom objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { AlignGroup, GridBox, Node, TColor, Text } from '../../../../scenery/js/imports.js';
import CAVConstants from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../CAVColors.js';
import PredictionThumbNode from './PredictionThumbNode.js';
import checkboxCheckedSoundPlayer from '../../../../tambo/js/shared-sound-players/checkboxCheckedSoundPlayer.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import MeanIndicatorNode from './MeanIndicatorNode.js';
import SoccerCommonColors from '../../../../soccer-common/js/SoccerCommonColors.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import VariabilityMeasureIconNode from '../../variability/view/VariabilityMeasureIconNode.js';
import NumberTone from '../../../../soccer-common/js/model/NumberTone.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const TEXT_OPTIONS = {
  font: CAVConstants.MAIN_FONT,
  maxWidth: CAVConstants.CHECKBOX_TEXT_MAX_WIDTH
};

const TEXT_ALIGN_GROUP = new AlignGroup();
const ICON_ALIGN_GROUP = new AlignGroup();

export default class PlayAreaCheckboxFactory {

  private static createGridBox( text: Node, icon: Node ): GridBox {
    return new GridBox( {
      stretch: true,
      spacing: 5,
      grow: 1,
      rows: [ [
        TEXT_ALIGN_GROUP.createBox( new Node( { children: [ text ] } ), { layoutOptions: { xAlign: 'left' }, xAlign: 'left' } ),
        ICON_ALIGN_GROUP.createBox( icon, { layoutOptions: { xAlign: 'right' }, xAlign: 'center' } )
      ] ]
    } );
  }

  public static getIntervalToolCheckboxItem( isIntervalToolVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return {
      createNode: () => {
        return PlayAreaCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.intervalToolStringProperty, TEXT_OPTIONS ),

          // Sampled from the design in https://github.com/phetsims/center-and-variability/issues/182
          new VariabilityMeasureIconNode( CAVColors.intervalToolIconRectangleFillColorProperty, CAVConstants.CHECKBOX_ICON_DIMENSION - 5 )
        );
      },
      property: isIntervalToolVisibleProperty,
      tandemName: 'intervalToolCheckbox'
    };
  }

  public static getMedianCheckedSoundPlayer( selectedSceneModelProperty: TReadOnlyProperty<CAVSoccerSceneModel> ): TSoundPlayer {
    return {
      play: () => {
        const median = selectedSceneModelProperty.value.medianValueProperty.value;
        if ( median !== null ) {
          NumberTone.playMedian( median );
        }
        else {
          checkboxCheckedSoundPlayer.play();
        }
      },
      stop: () => {
        // nothing to do since those are short-term clips
      }
    };
  }

  public static getMeanCheckedSoundPlayer( selectedSceneModelProperty: TReadOnlyProperty<CAVSoccerSceneModel> ): TSoundPlayer {
    return {
      play: () => {
        const mean = selectedSceneModelProperty.value.meanValueProperty.value;
        if ( mean !== null ) {
          NumberTone.playMean( mean );
        }
        else {
          checkboxCheckedSoundPlayer.play();
        }
      },
      stop: () => {
        // nothing to do since those are short-term clips
      }
    };
  }

  public static getMedianCheckboxItem( isPlayAreaMedianVisibleProperty: Property<boolean>, selectedSceneModelProperty: TReadOnlyProperty<CAVSoccerSceneModel> ): VerticalCheckboxGroupItem {

    return {
      createNode: () => {
        return PlayAreaCheckboxFactory.createGridBox(
          new Text( CenterAndVariabilityStrings.medianStringProperty, TEXT_OPTIONS ),
          new ArrowNode( 0, 0, 0, 27, {
            fill: CAVColors.medianColorProperty,
            stroke: SoccerCommonColors.arrowStrokeProperty,
            lineWidth: CAVConstants.ARROW_LINE_WIDTH,
            headHeight: 12,
            headWidth: CAVConstants.CHECKBOX_ICON_DIMENSION - 7,
            maxHeight: CAVConstants.CHECKBOX_ICON_DIMENSION - 4
          } ) );
      },
      property: isPlayAreaMedianVisibleProperty,
      tandemName: 'medianCheckbox',

      options: {
        checkedSoundPlayer: PlayAreaCheckboxFactory.getMedianCheckedSoundPlayer( selectedSceneModelProperty )
      }
    };
  }

  public static getMeanCheckboxItem( isPlayAreaMeanVisibleProperty: Property<boolean>, selectedSceneModelProperty: TReadOnlyProperty<CAVSoccerSceneModel> ): VerticalCheckboxGroupItem {
    return {
      createNode: () => PlayAreaCheckboxFactory.createGridBox( new Text( CenterAndVariabilityStrings.meanStringProperty, TEXT_OPTIONS ),
        new MeanIndicatorNode( true, true ) ),
      property: isPlayAreaMeanVisibleProperty,
      tandemName: 'meanCheckbox',
      options: {
        checkedSoundPlayer: PlayAreaCheckboxFactory.getMeanCheckedSoundPlayer( selectedSceneModelProperty )
      }
    };
  }

  private static createPredictionItem( selectedProperty: Property<boolean>, stringProperty: PhetioProperty<string>, color: TColor,
                                       tandemName: string ): VerticalCheckboxGroupItem {
    return {
      createNode: () => {
        return PlayAreaCheckboxFactory.createGridBox(
          new Text( stringProperty, TEXT_OPTIONS ),
          new PredictionThumbNode( { color: color, maxHeight: 24, pickable: false, style: 'arrow' } ) );
      },
      property: selectedProperty,
      tandemName: tandemName
    };
  }

  public static getPredictMedianCheckboxItem( isPredictMedianVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return PlayAreaCheckboxFactory.createPredictionItem(
      isPredictMedianVisibleProperty,
      CenterAndVariabilityStrings.predictMedianStringProperty,
      CAVColors.medianColorProperty,
      'predictMedianCheckbox'
    );
  }

  public static getPredictMeanCheckboxItem( isPredictMeanVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return PlayAreaCheckboxFactory.createPredictionItem(
      isPredictMeanVisibleProperty,
      CenterAndVariabilityStrings.predictMeanStringProperty,
      CAVColors.meanColorProperty,
      'predictMeanCheckbox'
    );
  }

  public static getPointerCheckboxItem( isPointerVisibleProperty: Property<boolean> ): VerticalCheckboxGroupItem {
    return PlayAreaCheckboxFactory.createPredictionItem(
      isPointerVisibleProperty,
      CenterAndVariabilityStrings.pointerStringProperty,
      CAVColors.pointerColorProperty,
      'pointerCheckbox'
    );
  }
}

centerAndVariability.register( 'PlayAreaCheckboxFactory', PlayAreaCheckboxFactory );