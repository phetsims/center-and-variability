// Copyright 2023, University of Colorado Boulder

/**
 * Icon for the interval tool.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, NodeOptions, NodeTransformOptions, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import CAVColors from '../../common/CAVColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import IconArrowNode from './IconArrowNode.js';

export default class IntervalToolIconNode extends Node {
  public constructor( providedOptions?: NodeOptions ) {

    // Sampled from the design in https://github.com/phetsims/center-and-variability/issues/182
    const rectangleFillProperty = CAVColors.intervalToolIconRectangleFillColorProperty;

    const mainRectangle = new Rectangle( 0, 0, 20, 15, {
      fill: rectangleFillProperty
    } );

    const createHandle = ( options: NodeTransformOptions ) => new Rectangle( 0, 0, 2, mainRectangle.height + 8, combineOptions<RectangleOptions>( {
      fill: rectangleFillProperty
    }, options ) );

    const leftHandle = createHandle( { leftTop: mainRectangle.leftTop } );
    const rightHandle = createHandle( { rightTop: mainRectangle.rightTop } );

    const createSphereNode = ( options: NodeTransformOptions ) => new ShadedSphereNode( 10, combineOptions<ShadedSphereNodeOptions>( {
      mainColor: CAVColors.intervalToolIconShadedSphereMainColorProperty,
      highlightColor: CAVColors.intervalToolIconShadedSphereHighlightColorProperty,
      shadowColor: CAVColors.intervalToolIconShadedSphereShadowColorProperty,
      highlightDiameterRatio: 0.35
    }, options ) );

    const leftSphereNode = createSphereNode( { center: leftHandle.centerBottom } );
    const rightSphereNode = createSphereNode( { center: rightHandle.centerBottom } );

    super( {
      children: [

        // Handles go behind so there is no seam between the rectangle and the handle
        leftHandle,
        rightHandle,

        mainRectangle,
        new IconArrowNode( mainRectangle ),
        leftSphereNode,
        rightSphereNode
      ]
    } );
  }
}

centerAndVariability.register( 'IntervalToolIconNode', IntervalToolIconNode );