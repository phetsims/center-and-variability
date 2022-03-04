// Copyright 2022, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndSpread from '../../centerAndSpread.js';

/**
 * AnimationMode is used to identify what type of animation a CASObject is undergoing.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export class AnimationMode extends EnumerationValue {

  // TODO: SR would like to re-evaluate StringEnumerationValue, see https://github.com/phetsims/axon/issues/373
  // SR: But more importantly, this sim should be consistent.
  static FLYING = new AnimationMode();
  static STACKING = new AnimationMode();
  static RETURNING = new AnimationMode();
  static NONE = new AnimationMode();
  static enumeration = new Enumeration( AnimationMode );
}

centerAndSpread.register( 'AnimationMode', AnimationMode );