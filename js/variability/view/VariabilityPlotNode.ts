// Copyright 2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { NodeOptions, Node } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VariabilityModel from '../model/VariabilityModel.js';
import RangeNode from './RangeNode.js';
import IQRNode from './IQRNode.js';
import MADNode from './MADNode.js';

export type CAVPlotOptions = NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VariabilityPlotNode extends Node {

  public constructor( model: VariabilityModel, numberLineWidth: number, providedOptions: CAVPlotOptions ) {
    super( providedOptions );

    const rangeNode = new RangeNode( model, numberLineWidth, {
      parentContext: 'accordion',
      tandem: providedOptions.tandem.createTandem( 'rangeNode' )
    } );
    this.addChild( rangeNode );

    const iqrNode = new IQRNode( model, numberLineWidth, {
      parentContext: 'accordion',
      tandem: providedOptions.tandem.createTandem( 'iqrNode' )

    } );
    this.addChild( iqrNode );

    const madNode = new MADNode( model, numberLineWidth, {
      parentContext: 'accordion',
      tandem: providedOptions.tandem.createTandem( 'madNode' )

    } );
    this.addChild( madNode );

    // TODO: Now we need to toggle between the nodes
    // The rectangles must be behind the data points
    rangeNode.moveToBack();
    iqrNode.moveToBack();
    madNode.moveToBack();
  }
}

centerAndVariability.register( 'VariabilityPlotNode', VariabilityPlotNode );