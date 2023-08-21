// Copyright 2023, University of Colorado Boulder

/**
 * Info dialog on the median screen. Contains the MedianInfoNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import Dialog from '../../../../sun/js/Dialog.js';
import MedianInfoNode from './MedianInfoNode.js';
import MedianModel from '../model/MedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MedianInfoDialog extends Dialog {
  public constructor( model: MedianModel, sceneModel: CAVSoccerSceneModel, tandem: Tandem ) {

    const medianInfoNode = new MedianInfoNode( model, sceneModel, tandem.createTandem( 'medianInfoNode' ) );

    super( medianInfoNode, {
      tandem: tandem,
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'MedianInfoDialog', MedianInfoDialog );