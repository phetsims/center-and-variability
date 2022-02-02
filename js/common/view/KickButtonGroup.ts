// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import { AlignGroup, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';

// TODO: VBox/LayoutBox could use TS options
export type KickButtonGroupOptions = NodeOptions;

class KickButtonGroup extends VBox {

  constructor( providedOptions?: KickButtonGroupOptions ) {

    const alignGroup = new AlignGroup();
    const kickOneAlignBox = alignGroup.createBox( new Text( centerAndSpreadStrings.kick1 ) );
    const kickTenAlignBox = alignGroup.createBox( new Text( centerAndSpreadStrings.kick10 ) );

    const kickOneButton = new RectangularPushButton( { content: kickOneAlignBox } );
    const kickTenButton = new RectangularPushButton( { content: kickTenAlignBox } );

    const options = optionize<any>( {
      spacing: 2,
      children: [
        kickOneButton,
        kickTenButton
      ]
    }, providedOptions );

    super( options );
  }

  /**
   * Resets the view.
   */
  reset() {
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ) {
  }
}

centerAndSpread.register( 'KickButtonGroup', KickButtonGroup );
export default KickButtonGroup;