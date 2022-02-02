// Copyright 2022, University of Colorado Boulder

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
import centerAndSpread from '../centerAndSpread.js';

const CASColors = {

  // Background color that for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( centerAndSpread, 'background', {
    default: 'white'
  } ),
  medianQuestionBarFillColorProperty: new ProfileColorProperty( centerAndSpread, 'medianQuestionBarFill', {
    default: '#75c35a'
  } ),
  meanAndMedianQuestionBarFillColorProperty: new ProfileColorProperty( centerAndSpread, 'meanAndMedianQuestionBarFill', {
    default: '#8c5dbd'
  } ),
  spreadQuestionBarFillColorProperty: new ProfileColorProperty( centerAndSpread, 'spreadQuestionBarFill', {
    default: '#f7d148'
  } ),
  kickButtonFillColorProperty: new ProfileColorProperty( centerAndSpread, 'kickButtonFillColor', {
    default: Color.WHITE
  } ),

  // sky gradient, sampled from a screenshot
  skyGradientTopColorProperty: new ProfileColorProperty( centerAndSpread, 'skyGradientTop', { default: '#2e4f8a' } ),
  skyGradientMiddleColorProperty: new ProfileColorProperty( centerAndSpread, 'skyGradientMiddle', { default: '#5c98d3' } ),
  skyGradientBottomColorProperty: new ProfileColorProperty( centerAndSpread, 'skyGradientBottom', { default: '#c9d9ef' } ),

  // the ground
  groundColorProperty: new ProfileColorProperty( centerAndSpread, 'groundColorProperty', { default: '#468a41' } )
};

centerAndSpread.register( 'CASColors', CASColors );
export default CASColors;