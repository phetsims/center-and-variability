// Copyright 2023, University of Colorado Boulder

/**
 * Must show one of three plot nodes according to the selectedVariabilityMeasureProperty.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import RangeInfoNode from './RangeInfoNode.js';
import IQRInfoNode from './IQRInfoNode.js';
import MADInfoNode from './MADInfoNode.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVDialog from '../../common/view/CAVDialog.js';
import CAVToggleNode from '../../common/view/CAVToggleNode.js';

export default class VariabilityInfoDialog extends CAVDialog {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, tandem: Tandem ) {

    const toggleNode = new CAVToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: () => new RangeInfoNode( model, sceneModel, playAreaNumberLineNode, tandem.createTandem( 'rangeInfoNode' ) )
    }, {
      value: VariabilityMeasure.IQR,
      createNode: () => new IQRInfoNode( model, sceneModel, playAreaNumberLineNode, tandem.createTandem( 'iqrInfoNode' ) )
    }, {
      value: VariabilityMeasure.MAD,
      createNode: () => new MADInfoNode( model, sceneModel, playAreaNumberLineNode, tandem.createTandem( 'madInfoNode' ) )
    } ], {
      excludeInvisibleChildrenFromBounds: true,
      alignChildren: ToggleNode.NONE
    } );

    super( toggleNode, tandem );
  }
}

centerAndVariability.register( 'VariabilityInfoDialog', VariabilityInfoDialog );