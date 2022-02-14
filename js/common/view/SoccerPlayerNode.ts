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

    const standingNode = new Image( player01Standing_png, {
      maxHeight: 100
    } );
    this.addChild( standingNode );

    const kickingNode = new Image( player01Kicking_png, {
      maxHeight: 100
    } );
    this.addChild( kickingNode );

    soccerPlayer.isKickingProperty.link( isKicking => {
      standingNode.visible = !isKicking;
      kickingNode.visible = isKicking;
    } );
  }
}

centerAndSpread.register( 'SoccerPlayerNode', SoccerPlayerNode );
export default SoccerPlayerNode;