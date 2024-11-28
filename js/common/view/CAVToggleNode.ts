// Copyright 2023-2024, University of Colorado Boulder

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node } from '../../../../scenery/js/imports.js';
import ToggleNode, { ToggleNodeElement, ToggleNodeOptions } from '../../../../sun/js/ToggleNode.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * CAVToggleNode is a custom ToggleNode that excludes unselected children from the scene graph to enhance performance.
 * This behavior boosts performance when switching screens, although it might reduce performance during scene switches.
 *
 * The primary motivation behind this design is to improve screen-switching performance while ensuring that scene-switching
 * performance remains within acceptable limits.
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