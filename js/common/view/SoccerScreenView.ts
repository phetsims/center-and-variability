// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the ScreenView in all soccer screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASScreenView, { CASScreenViewOptions } from './CASScreenView.js';
import QuestionBar, { QuestionBarOptions } from './QuestionBar.js';
import KickButtonGroup from './KickButtonGroup.js';
import BackgroundNode from './BackgroundNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import SoccerModel from '../model/SoccerModel.js';
import SoccerPlayerNode from './SoccerPlayerNode.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import SoccerPlayer from '../model/SoccerPlayer.js';
import NumberLineNode from './NumberLineNode.js';

type SoccerScreenViewSelfOptions = {
  questionBarOptions: QuestionBarOptions
};
export type SoccerScreenViewOptions = SoccerScreenViewSelfOptions & CASScreenViewOptions;

// constants
const GROUND_POSITION_Y = 490;
const NUMBER_LINE_MARGIN_X = 185;

class SoccerScreenView extends CASScreenView {
  protected readonly questionBar: QuestionBar;
  protected readonly chartViewWidth: number;

  constructor( model: SoccerModel, providedOptions: SoccerScreenViewOptions ) {

    const options = optionize<SoccerScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const chartViewWidth = ScreenView.DEFAULT_LAYOUT_BOUNDS.width - NUMBER_LINE_MARGIN_X * 2;

    // The ground is at y=0
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( 1, 0, 16, 15 ),
      new Bounds2( NUMBER_LINE_MARGIN_X, GROUND_POSITION_Y - chartViewWidth, NUMBER_LINE_MARGIN_X + chartViewWidth, GROUND_POSITION_Y )
    );

    super( model, modelViewTransform, options );

    this.chartViewWidth = chartViewWidth;

    this.addChild( new BackgroundNode( GROUND_POSITION_Y, this.visibleBoundsProperty ) );

    const numberLineNode = new NumberLineNode( model.rangeProperty.value, chartViewWidth, {
      tandem: options.tandem.createTandem( 'numberLineNode' ),
      x: NUMBER_LINE_MARGIN_X,
      top: GROUND_POSITION_Y
    } );
    this.addChild( numberLineNode );

    const soccerPlayerNodeGroup = new PhetioGroup<SoccerPlayerNode, [ SoccerPlayer ]>( ( tandem, soccerPlayer ) => {
      return new SoccerPlayerNode( soccerPlayer, this.modelViewTransform, {
        tandem: tandem
      } );
    }, [ model.soccerPlayerGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'soccerPlayerNodeGroup' ),
      supportsDynamicState: false
    } );

    // A layer for the soccer players, so we can adjust their z-ordering within that layer
    const soccerPlayerLayer = new Node();
    const createSoccerPlayerNode = ( soccerPlayer: SoccerPlayer ) => {
      const soccerPlayerNode = soccerPlayerNodeGroup.createCorrespondingGroupElement( soccerPlayer.tandem.name, soccerPlayer );
      soccerPlayerLayer.addChild( soccerPlayerNode );

      // TODO: Document why this is correct (since it seems counterintuitive)
      soccerPlayerNode.moveToBack();
    };
    this.addChild( soccerPlayerLayer );
    model.soccerPlayerGroup.forEach( createSoccerPlayerNode );
    model.soccerPlayerGroup.elementCreatedEmitter.addListener( createSoccerPlayerNode );

    model.soccerPlayerGroup.elementDisposedEmitter.addListener( soccerPlayer => {
      const viewNode = soccerPlayerNodeGroup.getArray().find( soccerPlayerNode => soccerPlayerNode.soccerPlayer === soccerPlayer )!;
      soccerPlayerNodeGroup.disposeElement( viewNode );
    } );

    // 0th soccer player is at the front of the line, and should also be in the front in z-ordering
    soccerPlayerNodeGroup.getArrayCopy().reverse().forEach( soccerPlayerNode => soccerPlayerNode.moveToFront() );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, options.questionBarOptions );
    this.addChild( this.questionBar );
    this.addChild( new KickButtonGroup( model, {
      left: 25,
      bottom: this.layoutBounds.bottom - 8,
      tandem: options.tandem.createTandem( 'kickButtonGroup' )
    } ) );

    // Add the child in the subclass to control z-ordering
    this.addChild( this.playAreaMedianIndicatorNode );
  }
}

centerAndSpread.register( 'SoccerScreenView', SoccerScreenView );
export default SoccerScreenView;