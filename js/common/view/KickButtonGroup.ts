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
import Tandem from '../../../../tandem/js/Tandem.js';
import CASColors from '../CASColors.js';

// TODO: VBox/LayoutBox could use TS options
export type KickButtonGroupOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

// constants
const TEXT_MAX_WIDTH = 40;

class KickButtonGroup extends VBox {

  constructor( providedOptions?: KickButtonGroupOptions ) {

    const options = optionize<KickButtonGroupOptions>( {
      spacing: 2,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const alignGroup = new AlignGroup();

    // TODO: Why does this function create different sized buttons?
    const creatKickButton = ( label: string, tandemName: string ) => new RectangularPushButton( {
      content: alignGroup.createBox( new Text( label, {
        maxWidth: TEXT_MAX_WIDTH,
        tandem: options.tandem.createTandem( tandemName )
      } ) ),
      baseColor: CASColors.kickButtonFillColorProperty
    } );

    options.children = [
      creatKickButton( centerAndSpreadStrings.kick1, 'kickOneButton' ),
      creatKickButton( centerAndSpreadStrings.kick10, 'kickTenButton' )
    ];

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