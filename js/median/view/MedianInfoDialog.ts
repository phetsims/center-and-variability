// Copyright 2023, University of Colorado Boulder

import centerAndVariability from '../../centerAndVariability.js';
import Dialog from '../../../../sun/js/Dialog.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MedianInfoNode from './MedianInfoNode.js';
import MedianModel from '../model/MedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

export default class MedianInfoDialog extends Dialog {
  public constructor( model: MedianModel, sceneModel: CAVSoccerSceneModel, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const medianInfoNode = new MedianInfoNode( model, sceneModel );

    super( medianInfoNode, {

      // When the user manually dismisses the Dialog, we need to reflect it back in the model property.
      // The Dialog API does not function with a visibleProperty on its own. We know that this is circular,
      // but is necessary for the implementation of Dialog.
      hideCallback: () => model.isInfoVisibleProperty.set( false ),

      tandem: options.tandem
    } );
  }
}

centerAndVariability.register( 'MedianInfoDialog', MedianInfoDialog );