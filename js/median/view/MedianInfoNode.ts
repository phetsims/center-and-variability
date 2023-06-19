// Copyright 2023, University of Colorado Boulder

import { RichText, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants from '../../common/CAVConstants.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MedianModel from '../model/MedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import InfoValuesNode from '../../common/view/InfoValuesNode.js';
import CardNodeContainer from './CardNodeContainer.js';

export default class MedianInfoNode extends VBox {
  public constructor( model: MedianModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const infoDataValuesNode = new InfoValuesNode( sceneModel );
    const cardNodeContainer = new CardNodeContainer( model, {
      tandem: options.tandem.createTandem( 'cardNodeContainer' ),
      parentContext: 'info',
      excludeInvisibleChildrenFromBounds: true
    } );

    super( {
      align: 'center',
      spacing: 20,
      children: [
        new VBox( {
          align: 'left',
          spacing: 5,
          children: [
            new RichText( CenterAndVariabilityStrings.medianDescriptionStringProperty, {
              font: new PhetFont( 18 ),
              maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
              layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN }
            } ),
            infoDataValuesNode
          ]
        } ),
        cardNodeContainer
      ]
    } );

    const updateDataValuesDisplay = () => {

      // We only need to update the data display if the info box is showing, to improve performance on reset.
      if ( model.isInfoVisibleProperty.value ) {
        infoDataValuesNode.update();
      }
    };

    sceneModel.objectChangedEmitter.addListener( updateDataValuesDisplay );
    sceneModel.numberOfDataPointsProperty.lazyLink( updateDataValuesDisplay );
    model.isInfoVisibleProperty.lazyLink( updateDataValuesDisplay );

    updateDataValuesDisplay();
  }
}

centerAndVariability.register( 'MedianInfoNode', MedianInfoNode );