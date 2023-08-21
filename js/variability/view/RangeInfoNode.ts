// Copyright 2023, University of Colorado Boulder

/**
 * Contains the definition of range, a plot node that showcases the range Interval, and a range calculation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import centerAndVariability from '../../centerAndVariability.js';
import RangeNode from './RangeNode.js';
import CAVConstants from '../../common/CAVConstants.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';

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
          parentContext: 'info',
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN }
        } )
      ],
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'RangeInfoNode', RangeInfoNode );