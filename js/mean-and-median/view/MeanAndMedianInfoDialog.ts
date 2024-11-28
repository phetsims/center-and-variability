// Copyright 2023-2024, University of Colorado Boulder

/**
 * MeanAndMedianInfoDialog is a UI component for the Mean and Median Screen. It provides a dialog that displays
 * detailed information using the MeanAndMedianInfoNode. The dialog leverages information from the provided
 * model, scene model, and a number line node.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import CAVDialog from '../../common/view/CAVDialog.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import MeanAndMedianInfoNode from './MeanAndMedianInfoNode.js';

export default class MeanAndMedianInfoDialog extends CAVDialog {
  public constructor( model: MeanAndMedianModel, sceneModel: CAVSoccerSceneModel, playAreaNumberLineNode: NumberLineNode, tandem: Tandem ) {

    const meanAndMedianInfoNode = new MeanAndMedianInfoNode(
      model,
      sceneModel,
      playAreaNumberLineNode,
      tandem.createTandem( 'meanAndMedianInfoNode' )
    );

    super( meanAndMedianInfoNode, tandem );
  }
}

centerAndVariability.register( 'MeanAndMedianInfoDialog', MeanAndMedianInfoDialog );