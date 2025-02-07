// Copyright 2023-2024, University of Colorado Boulder

/**
 * VariabilityPlotNode shows the dot plots or line plots on the "Variability" screen.
 * It uses CAVToggleNodes to switch between the Range, IQR and MAD plots.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberLineNode from '.../../../../soccer-common/js/view/NumberLineNode.js';
import TProperty from '../../../../axon/js/TProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVPlotNode from '../../common/view/CAVPlotNode.js';
import CAVToggleNode from '../../common/view/CAVToggleNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import IntervalToolRectangle from './IntervalToolRectangle.js';
import IQRNode from './IQRNode.js';
import MADNode from './MADNode.js';
import RangeNode from './RangeNode.js';

export type CAVPlotOptions = NodeOptions;

export default class VariabilityPlotNode extends Node {

  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode,
                      isDataPointLayerVisibleProperty: TProperty<boolean>, intervalToolNode: IntervalToolRectangle, providedOptions: CAVPlotOptions ) {
    super( combineOptions<CAVPlotOptions>( { isDisposable: false }, providedOptions ) );

    // We need to specify CAVPlotNode manually because otherwise TypeScript will infer all Nodes as the first element (RangeNode), see https://github.com/phetsims/sun/issues/846
    const toggleNode = new CAVToggleNode<VariabilityMeasure, CAVPlotNode>( model.selectedVariabilityMeasureProperty, [ {
      createNode: tandem => new RangeNode( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, {
        representationContext: 'accordion',
        tandem: tandem.createTandem( 'rangeNode' )
      } ),
      value: VariabilityMeasure.RANGE
    }, {
      createNode: tandem => new IQRNode( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, {
        representationContext: 'accordion',
        tandem: tandem.createTandem( 'iqrNode' )
      } ),
      value: VariabilityMeasure.IQR
    }, {
      createNode: tandem => new MADNode( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, {
        representationContext: 'accordion',
        tandem: tandem.createTandem( 'madNode' )
      } ),
      value: VariabilityMeasure.MAD
    } ], {
      alignChildren: ToggleNode.NONE
    } );
    this.addChild( toggleNode );
    toggleNode.moveToBack();

    toggleNode.nodes.forEach( node => node.insertChild( 0, intervalToolNode ) );
  }
}

centerAndVariability.register( 'VariabilityPlotNode', VariabilityPlotNode );