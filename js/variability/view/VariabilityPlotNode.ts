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
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import RangeNode from './RangeNode.js';
import IQRNode from './IQRNode.js';
import MADNode from './MADNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import CAVPlotNode from '../../common/view/CAVPlotNode.js';
import IntervalToolNode from './IntervalToolNode.js';
import NumberLineNode from '.../../../../soccer-common/js/view/NumberLineNode.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TProperty from '../../../../axon/js/TProperty.js';

export type CAVPlotOptions = WithRequired<NodeOptions, 'tandem'>;

export default class VariabilityPlotNode extends Node {
  private toggleNode: ToggleNode<VariabilityMeasure, CAVPlotNode>;

  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, isDataPointLayerVisibleProperty: TProperty<boolean>, providedOptions: CAVPlotOptions ) {
    super( providedOptions );

    // We need to specify CAVPlotNode manually because otherwise TypeScript will infer all Nodes as the first element (RangeNode), see https://github.com/phetsims/sun/issues/846
    const toggleNode = new ToggleNode<VariabilityMeasure, CAVPlotNode>( model.selectedVariabilityMeasureProperty, [ {
      createNode: tandem => new RangeNode( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, {
        parentContext: 'accordion',
        tandem: tandem.createTandem( 'rangeNode' )
      } ),
      value: VariabilityMeasure.RANGE
    }, {
      createNode: tandem => new IQRNode( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, {
        parentContext: 'accordion',
        tandem: tandem.createTandem( 'iqrNode' )
      } ),
      value: VariabilityMeasure.IQR
    }, {
      createNode: tandem => new MADNode( model, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, {
        parentContext: 'accordion',
        tandem: tandem.createTandem( 'madNode' )
      } ),
      value: VariabilityMeasure.MAD
    } ], {
      alignChildren: ToggleNode.NONE
    } );
    this.addChild( toggleNode );
    toggleNode.moveToBack();

    this.toggleNode = toggleNode;

    const intervalToolNode = new IntervalToolNode( model.intervalTool1ValueProperty,
      model.intervalTool2ValueProperty, toggleNode.nodes[ 0 ].modelViewTransform, new Property( -18 ),
      new BooleanProperty( false ), {
        focusable: false,
        interactiveHighlightEnabled: false,
        visibleProperty: model.isIntervalToolVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'intervalToolNode' )
      } );

    toggleNode.nodes.forEach( node => node.insertChild( 0, intervalToolNode ) );
  }
}

centerAndVariability.register( 'VariabilityPlotNode', VariabilityPlotNode );