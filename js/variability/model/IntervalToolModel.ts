// Copyright 2023-2024, University of Colorado Boulder

/**
 * IntervalToolModel represents the underlying data model for the IntervalToolNode. It manages the values and
 * interactions of two handles used for defining intervals, including their drag states and positions. Additionally,
 * it provides Properties that control the visibility, translatability, and sonification aspects of the interval tool.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CAVConstants from '../../common/CAVConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';

export default class IntervalToolModel {

  // The value of the interval tool's handle that starts out on the right
  public readonly isHandle1BeingMouseDraggedProperty = new BooleanProperty( false );
  public readonly isHandle1BeingKeyboardDraggedProperty = new BooleanProperty( false );
  public readonly handle1ValueProperty: NumberProperty;

  // The value of the interval tool's handle that starts out on the left
  public readonly isHandle2BeingMouseDraggedProperty = new BooleanProperty( false );
  public readonly isHandle2BeingKeyboardDraggedProperty = new BooleanProperty( false );
  public readonly handle2ValueProperty: NumberProperty;

  // Whether input is enabled on the interval tool
  public readonly isTranslationEnabledProperty: Property<boolean>;
  public readonly isBeingTranslatedProperty = new BooleanProperty( false );
  public readonly isRectangleInputEnabledProperty: TReadOnlyProperty<boolean>;

  public readonly isVisibleProperty: Property<boolean>;

  // The absolute value of the distance between the interval tool handles in meters. To work around inconsistent
  // intermediate values in the axon library, update this value once at the end of each step.
  // Used in sonification.
  public readonly deltaStableProperty: Property<number>;

  public constructor( tandem: Tandem ) {

    this.handle1ValueProperty = new NumberProperty( 1.7, {
      range: CAVConstants.VARIABILITY_DRAG_RANGE,
      tandem: tandem.createTandem( 'handle1ValueProperty' ),
      phetioFeatured: true
    } );

    this.handle2ValueProperty = new NumberProperty( 3.4, {
      range: CAVConstants.VARIABILITY_DRAG_RANGE,
      tandem: tandem.createTandem( 'handle2ValueProperty' ),
      phetioFeatured: true
    } );

    this.isTranslationEnabledProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isTranslationEnabledProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'When false, the interval cannot be translated left/right, but the handles are still moveable/interactive.'
    } );

    this.isVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isVisibleProperty' ),
      phetioFeatured: true
    } );

    // Prevent multitouch on the rectangle if the user is manipulating either of the handles, see https://github.com/phetsims/center-and-variability/issues/225
    this.isRectangleInputEnabledProperty = new DerivedProperty( [ this.isTranslationEnabledProperty, this.isHandle1BeingMouseDraggedProperty,
        this.isHandle2BeingMouseDraggedProperty, this.isHandle1BeingKeyboardDraggedProperty, this.isHandle2BeingKeyboardDraggedProperty ],
      ( isTranslationEnabled, isMouse1, isKeyboard1, isMouse2, isKeyboard2 ) => {
        return isTranslationEnabled && !isMouse1 && !isKeyboard1 && !isMouse2 && !isKeyboard2;
      } );

    this.deltaStableProperty = new NumberProperty( this.getIntervalToolWidth() );

    // https://github.com/phetsims/center-and-variability/issues/533
    phetioStateSetEmitter.addListener( () => {
      this.deltaStableProperty.value = this.getIntervalToolWidth();
    } );
  }

  /**
   * Gets the distance (a non-negative number) between the interval tool handles
   */
  public getIntervalToolWidth(): number {
    return Math.abs( this.handle2ValueProperty.value - this.handle1ValueProperty.value );
  }

  public reset(): void {
    this.handle1ValueProperty.reset();
    this.handle2ValueProperty.reset();
    this.isBeingTranslatedProperty.reset();
    this.isTranslationEnabledProperty.reset();
    this.isHandle1BeingMouseDraggedProperty.reset();
    this.isHandle2BeingMouseDraggedProperty.reset();
    this.isHandle2BeingKeyboardDraggedProperty.reset();
    this.isHandle1BeingKeyboardDraggedProperty.reset();
    this.isVisibleProperty.reset();
    this.deltaStableProperty.reset();
  }

  public updateDeltaStableProperty(): void {
    this.deltaStableProperty.value = this.getIntervalToolWidth();
  }
}

centerAndVariability.register( 'IntervalToolModel', IntervalToolModel );