// Copyright 2022-2025, University of Colorado Boulder

/**
 * KickButtonGroup contains "Kick 1" and "Kick 5" buttons utilized in the soccer screens.
 * These buttons allow users to trigger actions in the simulations, and their visibility and functionality
 * are dependent on the presence of kickable soccer balls.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import SoccerSceneModel from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import KickButton, { KICK_BUTTON_FONT } from '../../../../soccer-common/js/view/KickButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVSoccerSceneModel from '../model/CAVSoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;
export type KickButtonGroupOptions = SelfOptions & VBoxOptions & PickRequired<VBoxOptions, 'tandem'>;

// constants
const TEXT_MAX_WIDTH = 80;

export default class KickButtonGroup extends VBox {

  public constructor( selectedSceneModelProperty: TReadOnlyProperty<CAVSoccerSceneModel>, providedOptions?: KickButtonGroupOptions ) {

    const options = optionize<KickButtonGroupOptions, SelfOptions, VBoxOptions>()( {
      spacing: 2,
      isDisposable: false
    }, providedOptions );

    const alignGroup = new AlignGroup();

    const createLabel = ( label: PatternStringProperty<{ value: number }> ) => {
      const text = new Text( label, {
        maxWidth: TEXT_MAX_WIDTH,
        font: KICK_BUTTON_FONT
      } );
      return alignGroup.createBox( text );
    };

    const createKickButton = ( label: PatternStringProperty<{ value: number }>, tandem: Tandem, numberToKick: number, multikick: boolean ) => {
      const content = createLabel( label );
      const hasKickableSoccerBallsProperty = new DynamicProperty<boolean, unknown, SoccerSceneModel>( selectedSceneModelProperty, {
        derive: 'hasKickableSoccerBallsStableProperty'
      } );

      return new KickButton( {
        multiKick: multikick,
        visibleProperty: new GatedVisibleProperty( hasKickableSoccerBallsProperty, tandem ),
        content: content,
        tandem: tandem,
        listener: () => selectedSceneModelProperty.value.scheduleKicks( numberToKick ),
        accessibleName: label
      } );
    };

    // Create tandems so the labels can appear at the proper place in the tandem tree
    const kick1ButtonTandem = options.tandem.createTandem( 'kick1Button' );
    const kick5ButtonTandem = options.tandem.createTandem( 'kick5Button' );

    // Create labels first so their sizes can be aligned
    const kick1PatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.kickValuePatternStringProperty, { value: 1 }, {
      tandem: kick1ButtonTandem.createTandem( 'kick1PatternStringProperty' )
    } );

    const multiKickProperty = new NumberProperty( 5 );
    const kick5PatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.kickValuePatternStringProperty, { value: multiKickProperty }, {
      tandem: kick5ButtonTandem.createTandem( 'kick5PatternStringProperty' )
    } );

    const numberOfIdleBallsProperty = new DynamicProperty<number, unknown, SoccerSceneModel>( selectedSceneModelProperty, {
      derive: 'numberOfIdleBallsProperty'
    } );
    numberOfIdleBallsProperty.link( numberOfRemainingKickableObjects => {
      multiKickProperty.value = Math.max( Math.min( numberOfRemainingKickableObjects, 5 ), 1 );
    } );

    options.children = [
      createKickButton( kick1PatternStringProperty, kick1ButtonTandem, 1, false ),
      createKickButton( kick5PatternStringProperty, kick5ButtonTandem, 5, true )
    ];

    super( options );
  }
}

centerAndVariability.register( 'KickButtonGroup', KickButtonGroup );