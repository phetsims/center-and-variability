// Copyright 2023, University of Colorado Boulder

import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import Dialog from '../../../../sun/js/Dialog.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import RangeInfoNode from './RangeInfoNode.js';
import IQRInfoNode from './IQRInfoNode.js';
import MADInfoNode from './MADInfoNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import NumberLineNode from '../../soccer-common/view/NumberLineNode.js';

export default class VariabilityInfoDialog extends Dialog {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const toggleNode = new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: tandem => new RangeInfoNode( model, sceneModel, playAreaNumberLineNode, { tandem: tandem } ),
      tandemName: 'rangeInfoNode'
    }, {
      value: VariabilityMeasure.IQR,
      createNode: tandem => new IQRInfoNode( model, sceneModel, playAreaNumberLineNode, { tandem: tandem } ),
      tandemName: 'iqrInfoNode'
    }, {
      value: VariabilityMeasure.MAD,
      createNode: tandem => new MADInfoNode( model, sceneModel, playAreaNumberLineNode, { tandem: tandem } ),
      tandemName: 'madInfoNode'
    } ], {
      tandem: options.tandem.createTandem( 'toggleNode' ),
      excludeInvisibleChildrenFromBounds: true,
      alignChildren: ToggleNode.NONE
    } );

    super( toggleNode, {

      // When the user manually dismisses the Dialog, we need to reflect it back in the model property.
      // The Dialog API does not function with a visibleProperty on its own. We know that this is circular,
      // but is necessary for the implementation of Dialog.
      hideCallback: () => model.isInfoVisibleProperty.set( false ),
      tandem: options.tandem
    } );
  }
}

centerAndVariability.register( 'VariabilityInfoDialog', VariabilityInfoDialog );