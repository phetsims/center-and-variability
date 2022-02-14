// Copyright 2022, University of Colorado Boulder

/**
 * Shows the "Kick 1" and "Kick 5" buttons in the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import { AlignGroup, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASColors from '../CASColors.js';
import SoccerModel from '../model/SoccerModel.js';
import CASConstants from '../CASConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import CASObject from '../model/CASObject.js';

type KickButtonGroupSelfOptions = {};
export type KickButtonGroupOptions = KickButtonGroupSelfOptions & VBoxOptions & Required<Pick<VBoxOptions, 'tandem'>>;

// constants
const TEXT_MAX_WIDTH = 80;

class KickButtonGroup extends VBox {

  constructor( model: SoccerModel, providedOptions?: KickButtonGroupOptions ) {

    const options = optionize<KickButtonGroupOptions, KickButtonGroupSelfOptions, VBoxOptions>( {
      spacing: 2,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const alignGroup = new AlignGroup();

    const createLabel = ( label: string, tandem: Tandem ) => alignGroup.createBox( new Text( label, {
      maxWidth: TEXT_MAX_WIDTH,
      font: CASConstants.BUTTON_FONT,
      tandem: tandem
    } ) );

    const createKickButton = ( content: Node, tandem: Tandem, listener: () => void ) => {

      const enabledProperty = new DerivedProperty<boolean, [ number, number, CASObject | null ]>(
        [ model.objectGroup.countProperty, model.remainingNumberOfBallsToMultiKickProperty,
          model.nextBallToKickProperty ],
        ( count, remainingNumberOfBallsToMultiKick, nextBallToKick ) => {

          const numberBallsThatExistButHaventBeenKicked = nextBallToKick === null ? 0 : 1;
          return count - numberBallsThatExistButHaventBeenKicked + remainingNumberOfBallsToMultiKick < model.maxNumberOfObjects;
        }
      );
      return new RectangularPushButton( {
        enabledProperty: enabledProperty,
        content: content,
        baseColor: CASColors.kickButtonFillColorProperty,
        xMargin: 12,
        yMargin: 12,
        tandem: tandem,
        listener: listener
      } );
    };

    // Create tandems so the labels can appear at the proper place in the tandem tree
    const kick1ButtonTandem = options.tandem.createTandem( 'kickOneButton' );
    const kick5ButtonTandem = options.tandem.createTandem( 'kickFiveButton' );

    // Create labels first so their sizes can be aligned
    const kick1Label = createLabel( centerAndSpreadStrings.kick1, kick1ButtonTandem.createTandem( 'labelNode' ) );
    const kick5Label = createLabel( centerAndSpreadStrings.kick5, kick5ButtonTandem.createTandem( 'labelNode' ) );

    options.children = [
      createKickButton( kick1Label, kick1ButtonTandem, () => model.kick( 1 ) ),
      createKickButton( kick5Label, kick5ButtonTandem, () => model.kick( 5 ) )
    ];

    super( options );
  }
}

centerAndSpread.register( 'KickButtonGroup', KickButtonGroup );
export default KickButtonGroup;