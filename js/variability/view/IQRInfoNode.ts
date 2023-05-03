// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import IQRNode from './IQRNode.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';

export default class IQRInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, options: PickRequired<PhetioObject, 'tandem'> ) {

    const hasEnoughDataProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 5 );

    const distancesText = new Text( '', { fontSize: 18, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } );

    super( {
      align: 'left',
      spacing: 5,
      children: [
        new Text( CenterAndVariabilityStrings.interquartileRangeIQRStringProperty, {
          fontSize: 25,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: 10 }
        } ),
        new Text( CenterAndVariabilityStrings.iqrDescriptionStringProperty, { fontSize: 18, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH } ),

        // TODO: String key name
        distancesText,
        new Text( new PatternStringProperty( CenterAndVariabilityStrings.iqrCalculationPatternStringProperty, {
          q1: sceneModel.q1ValueProperty,
          q3: sceneModel.q3ValueProperty,
          iqr: sceneModel.iqrValueProperty
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH, layoutOptions: { bottomMargin: 10 } } ),

        new IQRNode( model, sceneModel, {
          parentContext: 'info',
          tandem: options.tandem.createTandem( 'iqrNode' ),
          layoutOptions: {
            topMargin: 50
          }
        } )
      ]
    } );

    const updateText = () => {
      let distanceTextString = CenterAndVariabilityStrings.iqrDistancesStringProperty.value;

      sceneModel.getSortedLandedObjects().forEach( obj => {
        distanceTextString = distanceTextString.concat( ' ' + obj.valueProperty.value! + ',' );
      } );

      // delete the trailing comma at the end
      distanceTextString = distanceTextString.substring( 0, distanceTextString.length - 1 );

      distancesText.string = distanceTextString;
    };

    sceneModel.objectChangedEmitter.addListener( updateText );
    sceneModel.numberOfDataPointsProperty.link( updateText );
  }
}

centerAndVariability.register( 'IQRInfoNode', IQRInfoNode );