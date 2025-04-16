// Copyright 2023-2025, University of Colorado Boulder

/**
 * The MedianInfoNode is a visual component designed to display the content for the Median Info dialog.
 * It provides a comprehensive definition of the median along with a visualization of sorted cards, which are for
 * display purposes and are non-interactive.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import InfoTitleDescriptionRichText from '../../common/view/InfoTitleDescriptionRichText.js';
import InfoValuesNode from '../../common/view/InfoValuesNode.js';
import NeedAtLeastNKicksText from '../../common/view/NeedAtLeastNKicksText.js';
import CardContainerModel from '../model/CardContainerModel.js';
import MedianModel from '../model/MedianModel.js';
import CardNodeContainer from './CardNodeContainer.js';

export default class MedianInfoNode extends VBox {
  public constructor( model: MedianModel, sceneModel: CAVSoccerSceneModel, tandem: Tandem ) {

    const hasZeroKicksProperty = DerivedProperty.valueEqualsConstant( sceneModel.numberOfDataPointsProperty, 0 );
    const infoDataValuesNode = new InfoValuesNode( sceneModel );

    const cardContainerModel = new CardContainerModel( model, { representationContext: 'info', tandem: tandem } );
    const cardNodeContainer = new CardNodeContainer( cardContainerModel, model.selectedSceneModelProperty.value,
      model.medianVisibleProperty, {

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

    const needAtLeastOneKickText = new NeedAtLeastNKicksText( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      visibleProperty: hasZeroKicksProperty
    } );

    super( {
      align: 'center',
      spacing: 20,
      children: [
        textVBox,
        cardNodeContainer,
        needAtLeastOneKickText
      ],
      isDisposable: false
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