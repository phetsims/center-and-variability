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
import { RequiredTandem } from '../../../../tandem/js/PhetioObject.js';

type KickButtonGroupSelfOptions = {};
export type KickButtonGroupOptions = KickButtonGroupSelfOptions & VBoxOptions & RequiredTandem;

// constants
const TEXT_MAX_WIDTH = 80;

class KickButtonGroup extends VBox {

  constructor( model: SoccerModel, providedOptions?: KickButtonGroupOptions ) {

    const options = optionize<KickButtonGroupOptions, KickButtonGroupSelfOptions, VBoxOptions>( {
      spacing: 2,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const alignGroup = new AlignGroup();

    const createLabel = ( label: string, tandem: Tandem ) => {
      const text = new Text( label, {
        maxWidth: TEXT_MAX_WIDTH,
        font: CASConstants.BUTTON_FONT,
        tandem: tandem
      } );
      return {
        label: alignGroup.createBox( text ),
        text: text
      };
    };

    const createKickButton = ( content: { label: Node, text: Text }, tandem: Tandem, numberToKick: number, multikick: boolean ) => {

      const visibleProperty = new DerivedProperty<boolean, [ number, number, CASObject | null ]>(
        [ model.objectGroup.countProperty, model.remainingNumberOfBallsToMultiKickProperty,
          model.nextBallToKickProperty ],
        ( count, remainingNumberOfBallsToMultiKick, nextBallToKick ) => {
          const numberBallsThatExistButHaventBeenKicked = nextBallToKick === null ? 0 : 1;
          const remainingBalls = model.maxNumberOfObjects - count - remainingNumberOfBallsToMultiKick + numberBallsThatExistButHaventBeenKicked;

          if ( ( numberBallsThatExistButHaventBeenKicked < numberToKick ) && multikick ) {
            content.text.text = 'Kick ' + Math.max( Math.min( remainingBalls, numberToKick ), 1 );
          }
          if ( multikick ) {
            return remainingBalls > 0;
          }
          else {
            return remainingBalls >= numberToKick;
          }
        }
      );

      return new RectangularPushButton( {
        visibleProperty: visibleProperty,
        // enabledProperty: enabledProperty,
        content: content.label,
        baseColor: CASColors.kickButtonFillColorProperty,
        xMargin: 12,
        yMargin: 12,
        tandem: tandem,
        listener: () => model.kick( numberToKick )
      } );
    };

    // Create tandems so the labels can appear at the proper place in the tandem tree
    const kick1ButtonTandem = options.tandem.createTandem( 'kickOneButton' );
    const kick5ButtonTandem = options.tandem.createTandem( 'kickFiveButton' );

    // Create labels first so their sizes can be aligned
    const kick1Label = createLabel( centerAndSpreadStrings.kick1, kick1ButtonTandem.createTandem( 'labelNode' ) );
    const kick5Label = createLabel( centerAndSpreadStrings.kick5, kick5ButtonTandem.createTandem( 'labelNode' ) );

    options.children = [
      createKickButton( kick1Label, kick1ButtonTandem, 1, false ),
      createKickButton( kick5Label, kick5ButtonTandem, 5, true )
    ];

    super( options );
  }
}

centerAndSpread.register( 'KickButtonGroup', KickButtonGroup );
export default KickButtonGroup;