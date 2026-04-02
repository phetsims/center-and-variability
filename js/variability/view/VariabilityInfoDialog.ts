// Copyright 2023-2026, University of Colorado Boulder

/**
 * VariabilityInfoDialog presents a dynamic dialogue box for the Variability Screen.
 * It displays a plot node (Range, IQR, or MAD) based on the selectedVariabilityMeasureProperty.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import CAVDialog from '../../common/view/CAVDialog.js';
import CAVToggleNode from '../../common/view/CAVToggleNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import IQRInfoNode from './IQRInfoNode.js';
import MADInfoNode from './MADInfoNode.js';
import RangeInfoNode from './RangeInfoNode.js';

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

    const accessibleNameStringProperty = CenterAndVariabilityFluent.a11y.variabilityScreen.infoDialog.accessibleName.createProperty( {
      measure: new DerivedProperty( [ model.selectedVariabilityMeasureProperty ], selectedMeasure => {
        return selectedMeasure === VariabilityMeasure.RANGE ? 'range' :
               selectedMeasure === VariabilityMeasure.IQR ? 'iqr' :
               'mad';
      } )
    } );

    super( toggleNode, tandem, {
      accessibleName: accessibleNameStringProperty
    } );
  }
}
