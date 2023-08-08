// Copyright 2023, University of Colorado Boulder

/**
 * Shows the content for the median info dialog. A definition of median,
 * and sorted cards that are not interactive.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
import { Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianModel from '../model/MedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import InfoValuesNode from '../../common/view/InfoValuesNode.js';
import CardNodeContainer from './CardNodeContainer.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import CAVConstants from '../../common/CAVConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import CardContainerModel from '../model/CardContainerModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

export default class MedianInfoNode extends VBox {
  public constructor( model: MedianModel, sceneModel: CAVSoccerSceneModel, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const hasZeroKicksProperty = DerivedProperty.valueEqualsConstant( sceneModel.numberOfDataPointsProperty, 0 );
    const infoDataValuesNode = new InfoValuesNode( sceneModel );

    const cardContainerModel = new CardContainerModel( model, { parentContext: 'info', tandem: options.tandem } );
    const cardNodeContainer = new CardNodeContainer( cardContainerModel, model.isSortingDataProperty,
      model.selectedSceneModelProperty.value, model.medianVisibleProperty, {

        // So it will remain centered in the dialog
        excludeInvisibleChildrenFromBounds: true,

        visibleProperty: DerivedProperty.not( hasZeroKicksProperty )
      } );

    const textVBox = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new InfoTitleDescriptionRichText( CenterAndVariabilityStrings.medianDescriptionStringProperty ),
        infoDataValuesNode
      ],
      excludeInvisibleChildrenFromBounds: true
    } );

    const needAtLeastOneKickText = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
      visibleProperty: hasZeroKicksProperty
    } );

    super( {
      align: 'center',
      spacing: 20,
      children: [
        textVBox,
        cardNodeContainer,
        needAtLeastOneKickText
      ]
    } );

    const updateDataValuesDisplay = () => {

      infoDataValuesNode.update();

      // The text should always be on the left, and the card node container should always be centered. This can be
      // implemented by checking if the card node container is wider than the text, and if so, centering the contents.
      this.align = cardNodeContainer.width > textVBox.width ? 'left' : 'center';
    };

    sceneModel.objectChangedEmitter.addListener( updateDataValuesDisplay );
    sceneModel.numberOfDataPointsProperty.lazyLink( updateDataValuesDisplay );
    model.infoButtonPressedEmitter.addListener( updateDataValuesDisplay );

    updateDataValuesDisplay();
  }
}

centerAndVariability.register( 'MedianInfoNode', MedianInfoNode );