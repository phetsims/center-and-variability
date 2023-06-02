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
import NumberLineNode from '../../common/view/NumberLineNode.js';

export default class InfoDialog extends Dialog {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const content = new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
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
      tandem: options.tandem.createTandem( 'infoNode' ),
      excludeInvisibleChildrenFromBounds: true,
      alignChildren: ToggleNode.NONE
    } );

    super( content, {

      // TODO: It seems there are 2 ways to hide the dialog. Is there a better way? See https://github.com/phetsims/center-and-variability/issues/179
      hideCallback: () => model.isInfoVisibleProperty.set( false )
    } );
  }
}

centerAndVariability.register( 'InfoDialog', InfoDialog );