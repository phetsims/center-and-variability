// Copyright 2023-2024, University of Colorado Boulder

/**
 * `RangeInfoNode`: Displays the range, its calculation, and visual representation on a plot.
 * It showcases details about the range in a more informative view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../../common/CAVConstants.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import RangeNode from './RangeNode.js';

export default class RangeInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, tandem: Tandem ) {

    const hasEnoughDataProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );
    super( {
      align: 'left',
      spacing: 5,
      children: [
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.rangeDescriptionStringProperty ),
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeEqualsMaxMinusMinPatternStringProperty, {
          max: sceneModel.maxValueProperty,
          min: sceneModel.minValueProperty
        }, {
          maps: {
            max: CAVConstants.STRING_VALUE_NULL_MAP,
            min: CAVConstants.STRING_VALUE_NULL_MAP
          },
          tandem: tandem.createTandem( 'rangeCalculationStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),


        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeEqualsRangeUnitsPatternStringProperty, {
          range: sceneModel.rangeValueProperty,

          // Show "1 meter" but "1.5 meters"
          units: new DerivedProperty( [
            sceneModel.rangeValueProperty,
            CenterAndVariabilityStrings.meterStringProperty,
            CenterAndVariabilityStrings.metersStringProperty
          ], rangeValue => rangeValue === 1 ? CenterAndVariabilityStrings.meterStringProperty.value : CenterAndVariabilityStrings.metersStringProperty.value )
        }, {
          maps: {
            range: CAVConstants.STRING_VALUE_NULL_MAP
          },
          tandem: tandem.createTandem( 'rangeCalculationResultStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),

        new RangeNode( model, sceneModel, playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, {
          representationContext: 'info',
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN }
        } )
      ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'RangeInfoNode', RangeInfoNode );