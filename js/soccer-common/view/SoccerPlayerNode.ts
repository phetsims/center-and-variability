// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows a cartoon representation of a soccer player which will kick a ball.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import soccerCommon from '../soccerCommon.js';
import { Image, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';

import SoccerPlayer from '../model/SoccerPlayer.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Pose from '../model/Pose.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;
type SoccerPlayerNodeOptions = SelfOptions & NodeOptions;


export type SoccerPlayerImageSet = {
  standing: HTMLImageElement;
  poisedToKick: HTMLImageElement;
  kicking: HTMLImageElement;
};

const SCALE = 0.155;

export default class SoccerPlayerNode extends Node {
  public readonly soccerPlayer: SoccerPlayer;

  public constructor( soccerPlayer: SoccerPlayer, playerImageSet: SoccerPlayerImageSet, modelViewTransform: ModelViewTransform2, providedOptions?: SoccerPlayerNodeOptions ) {
    super( {

      // Avoid a flickering on firefox where the image temporarily disappears (even in built mode)
      renderer: 'webgl'
    } );

    this.soccerPlayer = soccerPlayer;

    const standingNode = new Image( playerImageSet.standing );
    this.addChild( standingNode );

    const poisedToKickNode = new Image( playerImageSet.poisedToKick );
    this.addChild( poisedToKickNode );

    const kickingNode = new Image( playerImageSet.kicking );
    this.addChild( kickingNode );

    this.setScaleMagnitude( SCALE );

    // Show index when debugging with ?dev
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Text( soccerPlayer.initialPlaceInLine, {
        x: 130,
        y: 380,
        scale: 13
      } ) );
    }

    soccerPlayer.poseProperty.link( pose => {
      standingNode.visible = pose === Pose.STANDING;
      poisedToKickNode.visible = pose === Pose.POISED_TO_KICK;
      kickingNode.visible = pose === Pose.KICKING;
      this.centerBottom = modelViewTransform.modelToViewPosition( new Vector2( 0, 0 ) ).plusXY( -28, 8.5 );
    } );

    Multilink.multilink( [ soccerPlayer.isActiveProperty ], isActive => {
      this.visible = isActive;
    } );

    const options = optionize<SoccerPlayerNodeOptions, SelfOptions, NodeOptions>()( {
      excludeInvisibleChildrenFromBounds: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    this.mutate( options );
  }
}

soccerCommon.register( 'SoccerPlayerNode', SoccerPlayerNode );