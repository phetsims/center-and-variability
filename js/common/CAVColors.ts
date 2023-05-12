// Copyright 2022-2023, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import centerAndVariability from '../centerAndVariability.js';

const CAVColors = {

  // Background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( centerAndVariability, 'background', {
    default: 'white'
  } ),
  medianQuestionBarFillColorProperty: new ProfileColorProperty( centerAndVariability, 'medianQuestionBarFill', {
    default: '#58c662'
  } ),
  meanAndMedianQuestionBarFillColorProperty: new ProfileColorProperty( centerAndVariability, 'meanAndMedianQuestionBarFill', {
    default: '#955fc4'
  } ),
  variabilityQuestionBarFillColorProperty: new ProfileColorProperty( centerAndVariability, 'variabilityQuestionBarFill', {
    default: '#fdd10b'
  } ),
  kickButtonFillColorProperty: new ProfileColorProperty( centerAndVariability, 'kickButtonFillColor', {
    default: '#dae6f7'
  } ),
  dragIndicatorColorProperty: new ProfileColorProperty( centerAndVariability, 'dragIndicatorColor', {
    default: '#6bc6ff'
  } ),

  // sky gradient, sampled from a screenshot
  skyGradientTopColorProperty: new ProfileColorProperty( centerAndVariability, 'skyGradientTop', { default: '#365b9b' } ),
  skyGradientMiddleColorProperty: new ProfileColorProperty( centerAndVariability, 'skyGradientMiddle', { default: '#81b5ea' } ),
  skyGradientBottomColorProperty: new ProfileColorProperty( centerAndVariability, 'skyGradientBottom', { default: '#c9d9ef' } ),

  // the ground
  groundColorProperty: new ProfileColorProperty( centerAndVariability, 'groundColor', { default: '#009245' } ),

  medianColorProperty: new ProfileColorProperty( centerAndVariability, 'medianColor', { default: '#f03000' } ),
  meanColorProperty: new ProfileColorProperty( centerAndVariability, 'meanColor', { default: '#8500bd' } ),
  iqrColorProperty: new ProfileColorProperty( centerAndVariability, 'iqrColor', { default: 'black' } ),
  madColorProperty: new ProfileColorProperty( centerAndVariability, 'madColor', { default: 'black' } ),
  quartileColorProperty: new ProfileColorProperty( centerAndVariability, 'quartileColor', { default: new Color( '#99ffff' ).withAlpha( 0.55 ) } ),
  arrowStrokeProperty: new ProfileColorProperty( centerAndVariability, 'arrowStroke', { default: 'black' } ),
  boxWhiskerStrokeColorProperty: new ProfileColorProperty( centerAndVariability, 'boxWhiskerStrokeColor', { default: 'black' } ),
  madRectangleColorProperty: new ProfileColorProperty( centerAndVariability, 'madRectangleColorProperty', { default: new Color( '#cba3e6' ).withAlpha( 0.7 ) } ),

  grayDataPointFill: new ProfileColorProperty( centerAndVariability, 'grayDataPointFill', { default: '#8f8f8f' } ),

  intervalToolIconRectangleFillColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconRectangleFill', { default: '#fef8ab' } ),
  intervalToolIconShadedSphereMainColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconShadedSphereMainColor', { default: '#fdf581' } ),
  intervalToolIconShadedSphereHighlightColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconShadedSphereHighlightColor', { default: '#fdfdf2' } ),
  intervalToolIconShadedSphereShadowColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconShadedSphereShadowColor', { default: '#545034' } ),
  intervalToolFillProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolFillProperty', { default: Color.toColor( '#fefccf' ).withAlpha( 0.6 ) } ),
  intervalToolStrokeProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolStrokeProperty', { default: '#eae4c3' } ),

  rangeFillProperty: new ProfileColorProperty( centerAndVariability, 'rangeFillProperty', { default: new Color( '#c3fdb9' ).withAlpha( 0.7 ) } )
};

centerAndVariability.register( 'CAVColors', CAVColors );
export default CAVColors;