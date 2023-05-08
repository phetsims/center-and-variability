// Copyright 2023, University of Colorado Boulder

/**
 * Icon for the interval tool.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, NodeOptions, NodeTransformOptions, Rectangle } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import CAVColors from '../../common/CAVColors.js';

export default class IntervalToolIconNode extends Node {
  public constructor( providedOptions?: NodeOptions ) {

    // Sampled from the design in https://github.com/phetsims/center-and-variability/issues/182
    const rectangleFill = '#fef8ab';

    const mainRectangle = new Rectangle( 0, 0, 20, 15, {
      fill: rectangleFill
    } );

    const createBeam = ( options: NodeTransformOptions ) => new Rectangle( 0, 0, 2, mainRectangle.height + 8, {
      fill: rectangleFill,
      ...options
    } );

    const leftBeam = createBeam( { leftTop: mainRectangle.leftTop } );
    const rightBeam = createBeam( { rightTop: mainRectangle.rightTop } );

    const createSphereNode = ( options: NodeTransformOptions ) => new ShadedSphereNode( 10, {
      mainColor: CAVColors.intervalToolIconShadedSphereMainColorProperty,
      highlightColor: CAVColors.intervalToolIconShadedSphereHighlightColorProperty,
      shadowColor: CAVColors.intervalToolIconShadedSphereShadowColorProperty,
      highlightDiameterRatio: 0.35,
      ...options
    } );

    const leftSphereNode = createSphereNode( { center: leftBeam.centerBottom } );
    const rightSphereNode = createSphereNode( { center: rightBeam.centerBottom } );

    const arrowNode = new ArrowNode( 0, 0, mainRectangle.width, 0, {
      fill: 'black',
      stroke: null,
      center: mainRectangle.center,
      doubleHead: true,
      tailWidth: 2,
      headWidth: 7,
      headHeight: 5
    } );

    super( {
      children: [

        // Beams go behind so there is no seam between the rectangle and the beam
        leftBeam,
        rightBeam,

        mainRectangle,
        arrowNode,
        leftSphereNode,
        rightSphereNode
      ]
    } );
  }
}

centerAndVariability.register( 'IntervalToolIconNode', IntervalToolIconNode );