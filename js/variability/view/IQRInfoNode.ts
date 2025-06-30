// Copyright 2023-2025, University of Colorado Boulder

/**
 * `IQRInfoNode` presents the Interquartile Range (IQR) by visualizing its calculation and plotting quartile ranges.
 * The node is responsive, adjusting the displayed data based on the available data points. It also provides textual
 * information about the IQR, alongside visualizations of quartile calculations.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../../common/CAVConstants.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import IQRInfoValuesNode from './IQRInfoValuesNode.js';
import IQRNode from './IQRNode.js';

export default class IQRInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, tandem: Tandem ) {

    const hasEnoughDataForIQRProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 5 );

    const iqrCalculation2StringProperty = new PatternStringProperty( CenterAndVariabilityStrings.iqrEqualsIQRUnitsPatternStringProperty, {
      iqr: sceneModel.iqrValueProperty,

      // Show "1 meter" but "1.5 meters"
      units: new DerivedProperty( [
        sceneModel.iqrValueProperty,
        CenterAndVariabilityStrings.meterStringProperty,
        CenterAndVariabilityStrings.metersStringProperty
      ], iqrValue => iqrValue === 1 ? CenterAndVariabilityStrings.meterStringProperty.value : CenterAndVariabilityStrings.metersStringProperty.value )
    }, {
      maps: {
        iqr: CAVConstants.STRING_VALUE_NULL_MAP
      },
      tandem: tandem.createTandem( 'iqrCalculation2StringProperty' )
    } );

    const iqrInfoValuesNode = new IQRInfoValuesNode( sceneModel, hasEnoughDataForIQRProperty );

    super( {
      align: 'left',
      children: [
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.iqrDescriptionStringProperty ),
        iqrInfoValuesNode,

        new Text( new PatternStringProperty( CenterAndVariabilityStrings.iqrEqualsQ3MinusQ3PatternStringProperty, {
          q1: sceneModel.q1ValueProperty,
          q3: sceneModel.q3ValueProperty
        }, {
          maps: {
            q1: CAVConstants.STRING_VALUE_NULL_MAP,
            q3: CAVConstants.STRING_VALUE_NULL_MAP
          },
          tandem: tandem.createTandem( 'iqrCalculation1StringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataForIQRProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 },
          accessibleParagraph: CenterAndVariabilityFluent.a11y.variabilityScreen.infoDialog.iqrMinusPattern.createProperty( {
            q3: new DerivedProperty( [ sceneModel.q3ValueProperty ], CAVConstants.STRING_VALUE_NULL_MAP ),
            q1: new DerivedProperty( [ sceneModel.q1ValueProperty ], CAVConstants.STRING_VALUE_NULL_MAP )
          } )
        } ),

        new Text( iqrCalculation2StringProperty, {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataForIQRProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 },
          accessibleParagraph: iqrCalculation2StringProperty
        } ),

        new IQRNode( model, sceneModel, playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, {
          representationContext: 'info',
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN },
          accessibleParagraph: CenterAndVariabilityFluent.a11y.variabilityScreen.infoDialog.boxPlot.accessibleParagraphStringProperty
        } )
      ],
      isDisposable: false
    } );

    sceneModel.objectChangedEmitter.addListener( () => iqrInfoValuesNode.update() );
    sceneModel.numberOfDataPointsProperty.lazyLink( () => iqrInfoValuesNode.update() );
    model.infoButtonPressedEmitter.addListener( () => iqrInfoValuesNode.update() );

    iqrInfoValuesNode.update();
  }
}

centerAndVariability.register( 'IQRInfoNode', IQRInfoNode );