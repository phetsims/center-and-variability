// Copyright 2023, University of Colorado Boulder

/**
 * Shows the dot plot or line plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CAVPlotNode from '../../common/view/CAVPlotNode.js';
import VariabilityModel from '../model/VariabilityModel.js';
import RangeNode from './RangeNode.js';
import VariabilityType from '../model/VariabilityType.js';

type SelfOptions = {

  // TODO: Alternatives to staticDisplay option?
  staticDisplay?: VariabilityType;
};
export type CAVPlotOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VariabilityPlotNode extends CAVPlotNode {

  public constructor( model: VariabilityModel, numberLineWidth: number, providedOptions?: CAVPlotOptions ) {
    super( model, numberLineWidth, providedOptions );

    const rangeNode = new RangeNode( model, this.modelViewTransform, {
      staticDisplay: providedOptions?.staticDisplay
    } );
    this.addChild( rangeNode );
    rangeNode.moveToBack();
  }
}

centerAndVariability.register( 'VariabilityPlotNode', VariabilityPlotNode );