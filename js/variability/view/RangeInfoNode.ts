// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import RangeNode from './RangeNode.js';
import CAVConstants from '../../common/CAVConstants.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';

export default class RangeInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const hasEnoughDataProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );
    super( {
      align: 'left',
      spacing: 5,
      children: [
        new RichText( CenterAndVariabilityStrings.rangeDescriptionStringProperty, {
          font: new PhetFont( CAVConstants.INFO_DIALOG_TITLE_FONT_SIZE ),
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN }
        } ),

        // TODO: String key name, see https://github.com/phetsims/center-and-variability/issues/181
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationPatternStringProperty, {
          max: sceneModel.maxValueProperty,
          min: sceneModel.minValueProperty
        }, {
          maps: {
            max: CAVConstants.STRING_VALUE_NULL_MAP,
            min: CAVConstants.STRING_VALUE_NULL_MAP
          },
          tandem: options.tandem.createTandem( 'rangeCalculationStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.rangeCalculationResultPatternStringProperty, {
          range: sceneModel.rangeValueProperty
        }, {
          maps: {
            range: CAVConstants.STRING_VALUE_NULL_MAP
          },
          tandem: options.tandem.createTandem( 'rangeCalculationResultStringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),

        new RangeNode( model, sceneModel, playAreaNumberLineNode, {
          parentContext: 'info',
          tandem: options.tandem.createTandem( 'rangeNode' ),
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN }
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'RangeInfoNode', RangeInfoNode );