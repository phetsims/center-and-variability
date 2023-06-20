// Copyright 2023, University of Colorado Boulder

/**
 * Shows the content for the median info dialog.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
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

      // So it will remain centered in the dialog
      excludeInvisibleChildrenFromBounds: true
    } );

    const textVBox = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new RichText( CenterAndVariabilityStrings.medianDescriptionStringProperty, {
          font: new PhetFont( CAVConstants.INFO_DIALOG_TITLE_FONT_SIZE ),
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN }
        } ),
        infoDataValuesNode
      ]
    } );
    super( {
      align: 'center',
      spacing: 20,
      children: [
        textVBox,
        cardNodeContainer
      ]
    } );

    const updateDataValuesDisplay = () => {

      // We only need to update the data display if the info box is showing, to improve performance on reset.
      if ( model.isInfoVisibleProperty.value ) {
        infoDataValuesNode.update();

        // The text should always be on the left, and the card node container should always be centered. This can be
        // implemented by checking if the card node container is wider than the text, and if so, centering the contents.
        this.align = cardNodeContainer.width > textVBox.width ? 'left' : 'center';
      }
    };

    sceneModel.objectChangedEmitter.addListener( updateDataValuesDisplay );
    sceneModel.numberOfDataPointsProperty.lazyLink( updateDataValuesDisplay );
    model.isInfoVisibleProperty.lazyLink( updateDataValuesDisplay );

    updateDataValuesDisplay();
  }
}

centerAndVariability.register( 'MedianInfoNode', MedianInfoNode );