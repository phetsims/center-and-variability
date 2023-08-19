// Copyright 2023, University of Colorado Boulder

/**
 * Info dialog on the median screen. Contains the MedianInfoNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import Dialog from '../../../../sun/js/Dialog.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MedianInfoNode from './MedianInfoNode.js';
import MedianModel from '../model/MedianModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

export default class MedianInfoDialog extends Dialog {
  public constructor( model: MedianModel, sceneModel: CAVSoccerSceneModel, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const medianInfoNode = new MedianInfoNode( model, sceneModel, { tandem: options.tandem.createTandem( 'medianInfoNode' ) } );

    super( medianInfoNode, {
      tandem: options.tandem,
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'MedianInfoDialog', MedianInfoDialog );