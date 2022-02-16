// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Text, Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import player01Standing_png from '../../../images/player01Standing_png.js';
import player01Kicking_png from '../../../images/player01Kicking_png.js';
import SoccerPlayer from '../model/SoccerPlayer.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type SoccerPlayerNodeSelfOptions = {};
type SoccerPlayerNodeOptions = SoccerPlayerNodeSelfOptions & NodeOptions;

const SPACING = 5.5;
const SCALE = 0.18;

class SoccerPlayerNode extends Node {
  readonly soccerPlayer: SoccerPlayer;

  constructor( soccerPlayer: SoccerPlayer, modelViewTransform: ModelViewTransform2, providedOptions?: SoccerPlayerNodeOptions ) {
    super();

    this.soccerPlayer = soccerPlayer;

    const standingNode = new Image( player01Standing_png );
    this.addChild( standingNode );

    const kickingNode = new Image( player01Kicking_png );
    this.addChild( kickingNode );

    // Show index when debugging with ?dev
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Text( soccerPlayer.initialPlaceInLine, {
        x: 130,
        y: 380,
        scale: 13
      } ) );
    }

    soccerPlayer.isKickingProperty.link( isKicking => {
      standingNode.visible = !isKicking;
      kickingNode.visible = isKicking;
    } );

    soccerPlayer.placeInLineProperty.link( placeInLine => {
      this.setScaleMagnitude( Utils.linear( 0, 15, 1, 0.8, placeInLine ) * SCALE );
      this.centerBottom =
        modelViewTransform.modelToViewPosition( new Vector2( 0, 0 ) ).plusXY( -20 - placeInLine * SPACING, 3 );
    } );

    const options = optionize<SoccerPlayerNodeOptions, SoccerPlayerNodeSelfOptions, NodeOptions>( {}, providedOptions );

    this.mutate( options );
  }
}

centerAndSpread.register( 'SoccerPlayerNode', SoccerPlayerNode );
export default SoccerPlayerNode;