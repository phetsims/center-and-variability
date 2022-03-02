// Copyright 2022, University of Colorado Boulder

/**
 * AnimationMode is used to identify what type of animation a CASObject is undergoing.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export const AnimationModeValues = [ 'flying', 'stacking', 'returning', 'none' ] as const;
export type AnimationMode = ( typeof AnimationModeValues )[number];