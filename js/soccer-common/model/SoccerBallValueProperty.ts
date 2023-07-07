// Copyright 2016-2023, University of Colorado Boulder

/**
 * Property for the value of a soccer ball in a soccer scene. Can be a number or null, but cannot be set from null to non-null via PhET-IO.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 *
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ReadOnlyProperty, { PropertyOptions, ReadOnlyPropertyState } from '../../../../axon/js/ReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import soccerCommon from '../soccerCommon.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = EmptySelfOptions;

// client cannot specify superclass options that are controlled by BooleanProperty
export type SoccerBallValuePropertyOptions = SelfOptions & StrictOmit<PropertyOptions<number | null>, 'isValidValue' | 'valueType' | 'phetioValueType'>;

export default class SoccerBallValueProperty extends Property<number | null> {

  public constructor( value: number | null, providedOptions?: SoccerBallValuePropertyOptions ) {

    // Fill in superclass options that are controlled by BooleanProperty.
    const options = optionize<SoccerBallValuePropertyOptions, SelfOptions, PropertyOptions<number | null>>()( {
      phetioValueType: NullableIO( NumberIO ),
      phetioOuterType: () => SoccerBallValueProperty.SoccerBallValuePropertyIO
    }, providedOptions );

    super( value, options );
  }

  // See SoccerBallValuePropertyIO.documentation
  private static validateSoccerBallValue( oldValue: number | null, newValue: number | null ): string | null {
    if ( oldValue === null && newValue !== null ) {
      return 'Cannot change a null value to a non-null value.';
    }
    else if ( oldValue !== null && newValue === null ) {
      return 'Cannot change a non-null value to a null value.';
    }
    else {
      return null;
    }
  }

  public static SoccerBallValuePropertyIO = new IOType<ReadOnlyProperty<number | null>, ReadOnlyPropertyState<number | null>>( 'SoccerBallValuePropertyIO', {
    documentation: 'Soccer ball values cannot be changed from null to non-null or vice versa by PhET-iO clients. This ' +
                   'IOType adds validation and assertions for those cases.',
    supertype: ReadOnlyProperty.PropertyIO( NullableIO( NumberIO ) ),
    parameterTypes: [ NullableIO( NumberIO ) ],
    methods: {
      getValidationError: {
        returnType: NullableIO( StringIO ),
        parameterTypes: [ NullableIO( NumberIO ) ],
        implementation: function( this: ReadOnlyProperty<number | null>, value: number | null ) {

          return SoccerBallValueProperty.validateSoccerBallValue( this.value, value ) ||

                 // Check with the supertype to see if it is valid, this will check if it is range, etc.
                 ReadOnlyProperty.PropertyIO( NullableIO( NumberIO ) ).methods!.getValidationError.implementation.call( this, value );
        },
        documentation: 'Checks to see if a proposed value is valid. Returns the first validation error, or null if the value is valid.'
      },

      setValue: {
        returnType: VoidIO,
        parameterTypes: [ NullableIO( NumberIO ) ],
        implementation: function( this: SoccerBallValueProperty, value: number | null ) {

          const validationError = SoccerBallValueProperty.validateSoccerBallValue( this.value, value );
          if ( validationError ) {
            throw new Error( validationError );
          }

          this.set( value );
        },
        documentation: 'Sets the value of the Property. If the value differs from the previous value, listeners are ' +
                       'notified with the new value.',
        invocableForReadOnlyElements: false
      }
    }
  } );
}

soccerCommon.register( 'SoccerBallValueProperty', SoccerBallValueProperty );