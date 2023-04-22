// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows the "Kick 1" and "Kick 5" buttons in the soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import { AlignGroup, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVColors from '../CAVColors.js';
import SoccerModel from '../model/SoccerModel.js';
import CAVConstants from '../CAVConstants.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
export type KickButtonGroupOptions = SelfOptions & VBoxOptions & PickRequired<VBoxOptions, 'tandem'>;

// constants
const TEXT_MAX_WIDTH = 80;

export default class KickButtonGroup extends VBox {

  public constructor( model: SoccerModel, providedOptions?: KickButtonGroupOptions ) {

    const options = optionize<KickButtonGroupOptions, SelfOptions, VBoxOptions>()( {
      spacing: 2
    }, providedOptions );

    const alignGroup = new AlignGroup();

    const createLabel = ( label: string, tandem: Tandem ) => {
      const text = new Text( label, {
        maxWidth: TEXT_MAX_WIDTH,
        font: CAVConstants.BUTTON_FONT
      } );
      return {
        label: alignGroup.createBox( text ),
        text: text
      };
    };

    const createKickButton = ( content: { label: Node; text: Text }, tandem: Tandem, numberToKick: number, multikick: boolean ) => {

      if ( multikick ) {
        model.numberOfRemainingKickableSoccerBallsProperty.link( numberOfRemainingKickableObjects => {
          const value = Math.max( Math.min( numberOfRemainingKickableObjects, numberToKick ), 1 );
          content.text.string = StringUtils.fillIn( CenterAndVariabilityStrings.kickValue, { value: value } );
        } );
      }

      const buttonVisibleProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'visibleProperty' )
      } );

      return new RectangularPushButton( {
        visibleProperty: DerivedProperty.and( [ model.hasKickableSoccerBallsProperty, buttonVisibleProperty ] ),
        content: content.label,
        baseColor: CAVColors.kickButtonFillColorProperty,
        xMargin: 12,
        yMargin: 12,
        tandem: tandem,
        listener: () => model.scheduleKicks( numberToKick ),

        // TODO-DESIGN: It feels asymmetrical that holding down "kick 1" fires soccer balls but holding down "kick 5" does nothing
        fireOnHold: !multikick,
        fireOnHoldDelay: 750,

        // This needs to be longer than SoccerModel.TIME_BETWEEN_RAPID_KICKS plus the poise time, see
        // https://github.com/phetsims/center-and-variability/issues/102
        fireOnHoldInterval: 650
      } );
    };

    // Create tandems so the labels can appear at the proper place in the tandem tree
    const kick1ButtonTandem = options.tandem.createTandem( 'kickOneButton' );
    const kick5ButtonTandem = options.tandem.createTandem( 'kickFiveButton' );

    // Create labels first so their sizes can be aligned
    const kick1Label = createLabel( StringUtils.fillIn( CenterAndVariabilityStrings.kickValue, { value: 1 } ), kick1ButtonTandem.createTandem( 'labelText' ) );
    const kick5Label = createLabel( StringUtils.fillIn( CenterAndVariabilityStrings.kickValue, { value: 5 } ), kick5ButtonTandem.createTandem( 'labelText' ) );

    options.children = [
      createKickButton( kick1Label, kick1ButtonTandem, 1, false ),
      createKickButton( kick5Label, kick5ButtonTandem, 5, true )
    ];

    super( options );
  }
}

centerAndVariability.register( 'KickButtonGroup', KickButtonGroup );