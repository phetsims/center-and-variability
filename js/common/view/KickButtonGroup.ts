// Copyright 2022-2023, University of Colorado Boulder

/**
 * KickButtonGroup contains "Kick 1" and "Kick 5" buttons utilized in the soccer screens.
 * These buttons allow users to trigger actions in the simulations, and their visibility and functionality
 * are dependent on the presence of kickable soccer balls.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import { AlignGroup, Node, Text, VBox, VBoxOptions, createGatedVisibleProperty } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVColors from '../CAVColors.js';
import CAVConstants from '../CAVConstants.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import SoccerSceneModel from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
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
        font: CAVConstants.MAIN_FONT
      } );
      return alignGroup.createBox( text );
    };

    const createKickButton = ( content: Node, tandem: Tandem, numberToKick: number, multikick: boolean ) => {

      const hasKickableSoccerBallsProperty = new DynamicProperty<boolean, unknown, SoccerSceneModel>( selectedSceneModelProperty, {
        derive: 'hasKickableSoccerBallsStableProperty'
      } );

      const touchAreaXDilation = 5;
      const touchAreaYDilation = 4;

      return new RectangularPushButton( {
        visibleProperty: createGatedVisibleProperty( hasKickableSoccerBallsProperty, tandem ),
        content: content,
        baseColor: CAVColors.kickButtonFillColorProperty,
        xMargin: 12,
        yMargin: 12,
        tandem: tandem,
        listener: () => selectedSceneModelProperty.value.scheduleKicks( numberToKick ),

        // The Kick 1 button can be held down for repeat kicks, but the Kick 5 cannot.
        fireOnHold: !multikick,
        fireOnHoldDelay: 750,

        // This needs to be longer than CAVSceneModel.TIME_BETWEEN_RAPID_KICKS plus the poise time, see
        // https://github.com/phetsims/center-and-variability/issues/102
        fireOnHoldInterval: 650,

        soundPlayer: nullSoundPlayer,
        touchAreaXDilation: touchAreaXDilation,
        touchAreaYDilation: touchAreaYDilation,
        touchAreaYShift: multikick ? touchAreaYDilation : -touchAreaYDilation
      } );
    };

    // Create tandems so the labels can appear at the proper place in the tandem tree
    const kick1ButtonTandem = options.tandem.createTandem( 'kick1Button' );
    const kick5ButtonTandem = options.tandem.createTandem( 'kick5Button' );

    // Create labels first so their sizes can be aligned
    const kick1PatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.kickValuePatternStringProperty, { value: 1 }, {
      tandem: kick1ButtonTandem.createTandem( 'kick1PatternStringProperty' )
    } );
    const kick1Label = createLabel( kick1PatternStringProperty );

    const multiKickProperty = new NumberProperty( 5 );
    const kick5PatternStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.kickValuePatternStringProperty, { value: multiKickProperty }, {
      tandem: kick5ButtonTandem.createTandem( 'kick5PatternStringProperty' )
    } );

    const numberOfIdleBallsProperty = new DynamicProperty<number, unknown, SoccerSceneModel>( selectedSceneModelProperty, {
      derive: 'numberOfIdleBallsProperty'
    } );
    numberOfIdleBallsProperty.link( numberOfRemainingKickableObjects => {
      const value = Math.max( Math.min( numberOfRemainingKickableObjects, 5 ), 1 );
      multiKickProperty.value = value;
    } );
    const kick5Label = createLabel( kick5PatternStringProperty );

    options.children = [
      createKickButton( kick1Label, kick1ButtonTandem, 1, false ),
      createKickButton( kick5Label, kick5ButtonTandem, 5, true )
    ];

    super( options );
  }
}

centerAndVariability.register( 'KickButtonGroup', KickButtonGroup );