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
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import ScreenView from '../../../../joist/js/ScreenView.js';

export default class InfoDialog extends Dialog {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, options: PickRequired<PhetioObject, 'tandem'> ) {

    const content = new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: tandem => new RangeInfoNode( model, sceneModel, { tandem: tandem } ),
      tandemName: 'rangeInfoNode'
    }, {
      value: VariabilityMeasure.IQR,
      createNode: tandem => new IQRInfoNode( model, sceneModel, { tandem: tandem } ),
      tandemName: 'iqrInfoNode'
    }, {
      value: VariabilityMeasure.MAD,
      createNode: tandem => new MADInfoNode( model, sceneModel, { tandem: tandem } ),
      tandemName: 'madInfoNode'
    } ], {
      tandem: options.tandem.createTandem( 'infoNode' ),
      excludeInvisibleChildrenFromBounds: true
    } );

    super( content, {

      // TODO: It seems there are 2 ways to hide the dialog. Is there a better way? See https://github.com/phetsims/center-and-variability/issues/179
      hideCallback: () => model.isInfoVisibleProperty.set( false ),

      // TODO: maxWidth options in Dialog are shrinking the number line, so it doesn't match with the play area size, see https://github.com/phetsims/center-and-variability/issues/207
      // TODO: I tried other options but couldn't get them working.  This doesn't seem ideal. Can we do better? see https://github.com/phetsims/center-and-variability/issues/207
      maxWidth: ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 2,
      maxHeight: ScreenView.DEFAULT_LAYOUT_BOUNDS.height * 2
    } );
  }
}

centerAndVariability.register( 'InfoDialog', InfoDialog );