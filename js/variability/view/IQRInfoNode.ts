// Copyright 2023, University of Colorado Boulder

/**
 * Contains the definition of IQR (interquartile), shows the IQR calculation, and a plot node with
 * quartile range.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import IQRNode from './IQRNode.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import IQRInfoValuesNode from './IQRInfoValuesNode.js';
import { PLOT_NODE_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';

export default class IQRInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const hasEnoughDataForIQRProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 5 );

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
          tandem: options.tandem.createTandem( 'iqrCalculation1StringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataForIQRProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),

        new Text( new PatternStringProperty( CenterAndVariabilityStrings.iqrEqualsIQRUnitsPatternStringProperty, {
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
          tandem: options.tandem.createTandem( 'iqrCalculation2StringProperty' )
        } ), {
          fontSize: CAVConstants.INFO_DIALOG_FONT_SIZE,
          visibleProperty: hasEnoughDataForIQRProperty,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { topMargin: 5 }
        } ),

        new IQRNode( model, sceneModel, playAreaNumberLineNode, model.isDataPointLayerVisibleProperty, {
          parentContext: 'info',
          layoutOptions: { topMargin: PLOT_NODE_TOP_MARGIN }
        } )
      ]
    } );

    sceneModel.objectChangedEmitter.addListener( () => iqrInfoValuesNode.update() );
    sceneModel.numberOfDataPointsProperty.lazyLink( () => iqrInfoValuesNode.update() );
    model.infoButtonPressedEmitter.addListener( () => iqrInfoValuesNode.update() );

    iqrInfoValuesNode.update();
  }
}

centerAndVariability.register( 'IQRInfoNode', IQRInfoNode );
