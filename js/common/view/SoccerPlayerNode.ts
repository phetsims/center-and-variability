// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import player01Standing_png from '../../../images/player01Standing_png.js';
import player01Kicking_png from '../../../images/player01Kicking_png.js';
import SoccerPlayer from '../model/SoccerPlayer.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SoccerPlayerNodeSelfOptions = {};
type SoccerPlayerNodeOptions = SoccerPlayerNodeSelfOptions & NodeOptions;

class SoccerPlayerNode extends Node {
  readonly soccerPlayer: SoccerPlayer;


  constructor( soccerPlayer: SoccerPlayer, providedOptions?: SoccerPlayerNodeOptions ) {
    super();

    this.soccerPlayer = soccerPlayer;

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
    const options = optionize<SoccerPlayerNodeOptions, SoccerPlayerNodeSelfOptions, NodeOptions>( {}, providedOptions );

    this.mutate( options );
  }
}

centerAndSpread.register( 'SoccerPlayerNode', SoccerPlayerNode );
export default SoccerPlayerNode;