// Copyright 2024, University of Colorado Boulder

/**
 * ESlint configuration for center-and-variability.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import parent from '../chipper/eslint/sim.eslint.config.mjs';

export default [
  ...parent,
  {
    files: [
      '**/*.ts'
    ],
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': true,
          'ts-ignore': true,
          'ts-check': true,
          'ts-nocheck': true
        }
      ],
      'phet/no-object-spread-on-non-literals': 'error',
      'phet/additional-bad-text': [
        'error',
        {
          forbiddenTextObjects: [
            'dispose'
          ]
        }
      ]
    }
  }
];