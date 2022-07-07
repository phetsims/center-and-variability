// Copyright 2022, University of Colorado Boulder

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import centerAndVariability from '../../centerAndVariability.js';

/**
 * AnimationMode is used to identify what type of animation a CAVObject is undergoing.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export class AnimationMode extends EnumerationValue {

  // TODO: SR would like to re-evaluate StringEnumerationValue, see https://github.com/phetsims/axon/issues/373
  // SR: But more importantly, this sim should be consistent.
  public static FLYING = new AnimationMode();
  public static STACKING = new AnimationMode();
  public static RETURNING = new AnimationMode();
  public static NONE = new AnimationMode();
  private static enumeration = new Enumeration( AnimationMode );
}

centerAndVariability.register( 'AnimationMode', AnimationMode );