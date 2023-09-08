// Copyright 2023, University of Colorado Boulder

import ToggleNode, { ToggleNodeElement, ToggleNodeOptions } from '../../../../sun/js/ToggleNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Node } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

/**
 * Exclude the unselected children from the scene graph. This boosts performance when switching screens, but slows
 * down performance when switching scenes. (But still within acceptable levels).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */
export default class CAVToggleNode<T, N extends Node = Node> extends ToggleNode<T, N> {
  public constructor( valueProperty: TReadOnlyProperty<T>, elements: ToggleNodeElement<T, N>[], providedOptions?: StrictOmit<ToggleNodeOptions, 'unselectedChildrenSceneGraphStrategy'> ) {
    super( valueProperty, elements, combineOptions<ToggleNodeOptions>( { unselectedChildrenSceneGraphStrategy: 'excluded' }, providedOptions ) );
  }
}

centerAndVariability.register( 'CAVToggleNode', CAVToggleNode );