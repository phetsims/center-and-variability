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
      tandem: options.tandem
    } );
  }
}

centerAndVariability.register( 'VariabilityInfoDialog', VariabilityInfoDialog );