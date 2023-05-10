// Copyright 2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VariabilityModel from '../model/VariabilityModel.js';
import RangeNode from './RangeNode.js';
import IQRNode from './IQRNode.js';
import MADNode from './MADNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import CAVPlotNode from '../../common/view/CAVPlotNode.js';

export type CAVPlotOptions = NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VariabilityPlotNode extends Node {
  private toggleNode: ToggleNode<VariabilityMeasure, CAVPlotNode>;

  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, providedOptions: CAVPlotOptions ) {
    super( providedOptions );

    // TODO: Why can't it infer reasonable types here? See https://github.com/phetsims/center-and-variability/issues/170
    const toggleNode = new ToggleNode<VariabilityMeasure, CAVPlotNode>( model.selectedVariabilityProperty, [ {
      createNode: tandem => new RangeNode( model, sceneModel, {
        parentContext: 'accordion',
        tandem: tandem.createTandem( 'rangeNode' )
      } ),
      tandemName: 'rangeNode',
      value: VariabilityMeasure.RANGE
    }, {
      createNode: tandem => new IQRNode( model, sceneModel, {
        parentContext: 'accordion',
        tandem: tandem.createTandem( 'iqrNode' )
      } ),
      tandemName: 'iqrNode',
      value: VariabilityMeasure.IQR
    }, {
      createNode: tandem => new MADNode( model, sceneModel, {
        parentContext: 'accordion',
        tandem: tandem.createTandem( 'madNode' )
      } ),
      tandemName: 'madNode',
      value: VariabilityMeasure.MAD
    } ], {
      tandem: providedOptions.tandem.createTandem( 'toggleNode' )
    } );
    this.addChild( toggleNode );
    toggleNode.moveToBack();

    this.toggleNode = toggleNode;
  }

  public alignWithPlayAreaNumberLineNode( x: number ): void {
    this.toggleNode.nodes.forEach( plotNode => plotNode.alignWithPlayAreaNumberLineNode( x ) );
  }
}

centerAndVariability.register( 'VariabilityPlotNode', VariabilityPlotNode );