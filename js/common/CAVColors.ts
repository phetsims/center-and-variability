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

  // sky gradient, sampled from a screenshot
  skyGradientTopColorProperty: new ProfileColorProperty( centerAndVariability, 'skyGradientTop', { default: '#365b9b' } ),
  skyGradientMiddleColorProperty: new ProfileColorProperty( centerAndVariability, 'skyGradientMiddle', { default: '#81b5ea' } ),
  skyGradientBottomColorProperty: new ProfileColorProperty( centerAndVariability, 'skyGradientBottom', { default: '#c9d9ef' } ),

  // the ground
  groundColorProperty: new ProfileColorProperty( centerAndVariability, 'groundColor', { default: '#009245' } ),

  medianColorProperty: new ProfileColorProperty( centerAndVariability, 'medianColor', { default: '#f03000' } ),
  meanColorProperty: new ProfileColorProperty( centerAndVariability, 'meanColor', { default: '#8500bd' } ),
  iqrLabelColorProperty: new ProfileColorProperty( centerAndVariability, 'iqrLabelColor', { default: 'black' } ),
  madColorProperty: new ProfileColorProperty( centerAndVariability, 'madColor', { default: 'black' } ),
  iqrColorProperty: new ProfileColorProperty( centerAndVariability, 'iqrColor', { default: new Color( '#99ffff' ).withAlpha( 0.55 ) } ),
  boxWhiskerStrokeColorProperty: new ProfileColorProperty( centerAndVariability, 'boxWhiskerStrokeColor', { default: 'black' } ),
  madRectangleColorProperty: new ProfileColorProperty( centerAndVariability, 'madRectangleColor', { default: new Color( '#cba3e6' ).withAlpha( 0.7 ) } ),

  variabilityDataPointFill: new ProfileColorProperty( centerAndVariability, 'variabilityDataPointFill', { default: '#949494' } ),
  meanAndMedianDataPointFill: new ProfileColorProperty( centerAndVariability, 'meanAndMedianDataPointFill', { default: 'black' } ),

  // Darker gray than the ones in the plot area, to show up better in the radio button
  rangeMarkerColorProperty: new ProfileColorProperty( centerAndVariability, 'rangeMarkerColor', { default: new Color( '#717171' ) } ),

  intervalToolIconRectangleFillColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconRectangleFill', { default: '#fef8ab' } ),
  intervalToolIconShadedSphereMainColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconShadedSphereMainColor', { default: '#fdf581' } ),
  intervalToolIconShadedSphereHighlightColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconShadedSphereHighlightColor', { default: '#fdfdf2' } ),
  intervalToolIconShadedSphereShadowColorProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolIconShadedSphereShadowColor', { default: '#545034' } ),
  intervalToolFillProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolFill', { default: Color.toColor( '#fefccf' ).withAlpha( 0.6 ) } ),
  intervalToolStrokeProperty: new ProfileColorProperty( centerAndVariability, 'intervalToolStroke', { default: '#eae4c3' } ),
  playAreaIntervalToolHandleLineStrokeProperty: new ProfileColorProperty( centerAndVariability, 'playAreaIntervalToolHandleLineStroke', { default: new Color( 241, 255, 204, 0.5 ) } ),

  rangeFillProperty: new ProfileColorProperty( centerAndVariability, 'rangeFill', { default: new Color( '#c3fdb9' ).withAlpha( 0.7 ) } ),

  meanAndMedianAccordionBoxFillProperty: new ProfileColorProperty( centerAndVariability, 'meanAndMedianAccordionBoxFill', { default: 'rgb( 238, 238, 238 )' } ),
  variabilityAccordionBoxFillProperty: new ProfileColorProperty( centerAndVariability, 'variabilityAccordionBoxFill', { default: 'white' } ),

  radioButtonBackgroundColorProperty: new ProfileColorProperty( centerAndVariability, 'radioButtonBackgroundColor', { default: 'rgb( 238, 238, 238 )' } ),
  radioButtonDataPointColorProperty: new ProfileColorProperty( centerAndVariability, 'radioButtonDataPointColor', { default: 'black' } )
};

centerAndVariability.register( 'CAVColors', CAVColors );
export default CAVColors;