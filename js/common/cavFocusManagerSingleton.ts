// Copyright 2023, University of Colorado Boulder
/**
 * A global for Center and Variability that allows the InteractiveCardNodeContainer to tap into the
 * focusHighlightVisibleProperty.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import centerAndVariability from '../centerAndVariability.js';
import SimDisplay from '../../../joist/js/SimDisplay.js';
import TProperty from '../../../axon/js/TProperty.js';


class CAVFocusManagerSingleton {
  private _focusHighlightVisibleProperty: TProperty<boolean> | null = null;

  public initialize( display: SimDisplay ): void {
    this._focusHighlightVisibleProperty = display.focusManager.pdomFocusHighlightsVisibleProperty;
  }

  public get focusHighlightVisibleProperty(): TProperty<boolean> {
    assert && assert( this._focusHighlightVisibleProperty, 'cavFocusManager has not be initialized yet' );
    return this._focusHighlightVisibleProperty!;
  }
}

const cavFocusManagerSingleton = new CAVFocusManagerSingleton();
centerAndVariability.register( 'CAVFocusManagerSingleton', CAVFocusManagerSingleton );
export default cavFocusManagerSingleton;