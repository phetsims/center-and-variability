// Copyright 2023, University of Colorado Boulder

/**
 * Must show one of three plot nodes according to the selectedVariabilityMeasureProperty.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

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
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';

export default class VariabilityInfoDialog extends Dialog {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, options: PickRequired<PhetioObjectOptions, 'tandem'> ) {

    const toggleNode = new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: () => new RangeInfoNode( model, sceneModel, playAreaNumberLineNode, { tandem: options.tandem.createTandem( 'rangeInfoNode' ) } )
    }, {
      value: VariabilityMeasure.IQR,
      createNode: () => new IQRInfoNode( model, sceneModel, playAreaNumberLineNode, { tandem: options.tandem.createTandem( 'iqrInfoNode' ) } )
    }, {
      value: VariabilityMeasure.MAD,
      createNode: () => new MADInfoNode( model, sceneModel, playAreaNumberLineNode, { tandem: options.tandem.createTandem( 'madInfoNode' ) } )
    } ], {
      excludeInvisibleChildrenFromBounds: true,
      alignChildren: ToggleNode.NONE
    } );

    super( toggleNode, {
      tandem: options.tandem,
      isDisposable: false
    } );
  }
}

centerAndVariability.register( 'VariabilityInfoDialog', VariabilityInfoDialog );