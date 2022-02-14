// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import player01Standing_png from '../../../images/player01Standing_png.js';
import player01Kicking_png from '../../../images/player01Kicking_png.js';
import SoccerPlayer from '../model/SoccerPlayer.js';

class SoccerPlayerNode extends Node {

  constructor( soccerPlayer: SoccerPlayer ) {
    super();

    const playerStandingNode = new Image( player01Standing_png, {
      maxHeight: 100
    } );
    this.addChild( playerStandingNode );

    const playerKickingNode = new Image( player01Kicking_png, {
      maxHeight: 100
    } );
    playerKickingNode.visible = false;
    this.addChild( playerKickingNode );

    soccerPlayer.isKickingProperty.lazyLink( isKicking => {
      playerStandingNode.visible = !isKicking;
      playerKickingNode.visible = isKicking;
    } );

  }
}

centerAndSpread.register( 'SoccerPlayerNode', SoccerPlayerNode );
export default SoccerPlayerNode;