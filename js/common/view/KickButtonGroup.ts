// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import { Node, AlignGroup, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASColors from '../CASColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

// TODO: VBox/LayoutBox could use TS options
export type KickButtonGroupOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

// constants
const TEXT_MAX_WIDTH = 80;

class KickButtonGroup extends VBox {

  constructor( providedOptions?: KickButtonGroupOptions ) {

    const options = optionize<KickButtonGroupOptions>( {
      spacing: 2,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const alignGroup = new AlignGroup();

    const createContent = ( label: string, tandemName: string ) => alignGroup.createBox( new Text( label, {
      maxWidth: TEXT_MAX_WIDTH,
      font: new PhetFont( 16 ),
      tandem: options.tandem.createTandem( tandemName )
    } ) );

    const createKickButton = ( content: Node ) => {
      return new RectangularPushButton( {
        content: content,
        baseColor: CASColors.kickButtonFillColorProperty,
        xMargin: 12,
        yMargin: 12
      } );
    };

    // Create labels first so their sizes can be aligned
    const kick1Label = createContent( centerAndSpreadStrings.kick1, 'kickOneButton' );
    const kick10Label = createContent( centerAndSpreadStrings.kick10, 'kickTenButton' );

    options.children = [
      createKickButton( kick1Label ),
      createKickButton( kick10Label )
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