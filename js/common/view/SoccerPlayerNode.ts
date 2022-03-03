// Copyright 2022, University of Colorado Boulder

/**
 * Shows a cartoon representation of a soccer player which will kick a ball.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Text, Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';

import player01Standing_png from '../../../images/player01Standing_png.js';
import player01PoisedToKick_png from '../../../images/player01PoisedToKick_png.js';
import player01Kicking_png from '../../../images/player01Kicking_png.js';
import player02Standing_png from '../../../images/player02Standing_png.js';
import player02PoisedToKick_png from '../../../images/player02PoisedToKick_png.js';
import player02Kicking_png from '../../../images/player02Kicking_png.js';
import player03Standing_png from '../../../images/player03Standing_png.js';
import player03PoisedToKick_png from '../../../images/player03PoisedToKick_png.js';
import player03Kicking_png from '../../../images/player03Kicking_png.js';
import player04Standing_png from '../../../images/player04Standing_png.js';
import player04PoisedToKick_png from '../../../images/player04PoisedToKick_png.js';
import player04Kicking_png from '../../../images/player04Kicking_png.js';
import player05Standing_png from '../../../images/player05Standing_png.js';
import player05PoisedToKick_png from '../../../images/player05PoisedToKick_png.js';
import player05Kicking_png from '../../../images/player05Kicking_png.js';
import SoccerPlayer from '../model/SoccerPlayer.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Pose from '../model/Pose.js';

type SoccerPlayerNodeSelfOptions = {};
type SoccerPlayerNodeOptions = SoccerPlayerNodeSelfOptions & NodeOptions;

const playerGroups = [ {
  standing: player01Standing_png,
  poisedToKick: player01PoisedToKick_png,
  kicking: player01Kicking_png
}, {
  standing: player02Standing_png,
  poisedToKick: player02PoisedToKick_png,
  kicking: player02Kicking_png
}, {
  standing: player03Standing_png,
  poisedToKick: player03PoisedToKick_png,
  kicking: player03Kicking_png
}, {
  standing: player04Standing_png,
  poisedToKick: player04PoisedToKick_png,
  kicking: player04Kicking_png
}, {
  standing: player05Standing_png,
  poisedToKick: player05PoisedToKick_png,
  kicking: player05Kicking_png
} ];

const SPACING = 6.2;
const SCALE = 0.15;

class SoccerPlayerNode extends Node {
  readonly soccerPlayer: SoccerPlayer;

  constructor( soccerPlayer: SoccerPlayer, modelViewTransform: ModelViewTransform2, providedOptions?: SoccerPlayerNodeOptions ) {
    super();

    this.soccerPlayer = soccerPlayer;

    const imageNumber = soccerPlayer.initialPlaceInLine % playerGroups.length;

    const restingNode = new Image( playerGroups[ imageNumber ].standing );
    this.addChild( restingNode );

    const standingNode = new Image( playerGroups[ imageNumber ].poisedToKick );
    this.addChild( standingNode );

    const kickingNode = new Image( playerGroups[ imageNumber ].kicking );
    this.addChild( kickingNode );

    // Show index when debugging with ?dev
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Text( soccerPlayer.initialPlaceInLine, {
        x: 130,
        y: 380,
        scale: 13
      } ) );
    }

    soccerPlayer.poseProperty.link( pose => {
      restingNode.visible = pose === Pose.STANDING;
      standingNode.visible = pose === Pose.POISED_TO_KICK;
      kickingNode.visible = pose === Pose.KICKING;
    } );

    soccerPlayer.placeInLineProperty.link( placeInLine => {
      this.setScaleMagnitude( Utils.linear( 0, 15, 1, 0.8, placeInLine ) * SCALE );
      this.centerBottom =
        modelViewTransform.modelToViewPosition( new Vector2( 0, 0 ) ).plusXY( -20 - placeInLine * SPACING, 7 );
    } );

    const options = optionize<SoccerPlayerNodeOptions, SoccerPlayerNodeSelfOptions, NodeOptions>( {}, providedOptions );

    this.mutate( options );
  }
}

centerAndSpread.register( 'SoccerPlayerNode', SoccerPlayerNode );
export default SoccerPlayerNode;