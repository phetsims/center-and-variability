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

type SelfOptions = {
  questionBarOptions: QuestionBarOptions
};
export type SoccerScreenViewOptions = SelfOptions & CASScreenViewOptions;

// constants
const GROUND_POSITION_Y = 500;
const NUMBER_LINE_MARGIN_X = 207;

class SoccerScreenView extends CASScreenView {
  protected readonly questionBar: QuestionBar;
  protected readonly chartViewWidth: number;
  protected readonly playAreaNumberLineNode: NumberLineNode;

  constructor( model: SoccerModel, providedOptions: SoccerScreenViewOptions ) {

    const options = optionize<SoccerScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const chartViewWidth = ScreenView.DEFAULT_LAYOUT_BOUNDS.width - NUMBER_LINE_MARGIN_X * 2;

    // The ground is at y=0
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( model.physicalRange.min, 0, model.physicalRange.max, model.physicalRange.getLength() ),
      new Bounds2( NUMBER_LINE_MARGIN_X, GROUND_POSITION_Y - chartViewWidth, NUMBER_LINE_MARGIN_X + chartViewWidth, GROUND_POSITION_Y )
    );

    super( model, modelViewTransform, options );

    this.chartViewWidth = chartViewWidth;

    this.contentLayer.addChild( new BackgroundNode( GROUND_POSITION_Y, this.visibleBoundsProperty ) );

    this.playAreaNumberLineNode = new NumberLineNode(
      model.physicalRange,
      chartViewWidth,
      model.meanValueProperty,
      model.isShowingPlayAreaMeanProperty,
      model.dataRangeProperty, {
        includeXAxis: false,
        includeMeanStroke: true,
        tandem: options.tandem.createTandem( 'playAreaNumberLineNode' ),
        x: NUMBER_LINE_MARGIN_X,
        y: GROUND_POSITION_Y
      } );
    this.contentLayer.addChild( this.playAreaNumberLineNode );

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
    this.contentLayer.addChild( soccerPlayerLayer );
    model.soccerPlayerGroup.forEach( createSoccerPlayerNode );
    model.soccerPlayerGroup.elementCreatedEmitter.addListener( createSoccerPlayerNode );

    model.soccerPlayerGroup.elementDisposedEmitter.addListener( soccerPlayer => {
      const viewNode = soccerPlayerNodeGroup.getArray().find( soccerPlayerNode => soccerPlayerNode.soccerPlayer === soccerPlayer )!;
      soccerPlayerNodeGroup.disposeElement( viewNode );
    } );

    // 0th soccer player is at the front of the line, and should also be in the front in z-ordering
    soccerPlayerNodeGroup.getArrayCopy().reverse().forEach( soccerPlayerNode => soccerPlayerNode.moveToFront() );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, options.questionBarOptions );
    this.contentLayer.addChild( this.questionBar );
    this.contentLayer.addChild( new KickButtonGroup( model, {
      left: 25,

      // Center between the ground and the bottom of the layout bounds.  Adjust because of the asymmetries:
      // the soccer player foot falls beneath the ground, and the shading of the buttons.
      centerY: ( GROUND_POSITION_Y + this.layoutBounds.maxY ) / 2 + 2,
      tandem: options.tandem.createTandem( 'kickButtonGroup' )
    } ) );

    // Soccer balls go behind the accordion box after they land
    this.contentLayer.addChild( this.backObjectLayer );
  }
}

centerAndSpread.register( 'SoccerScreenView', SoccerScreenView );
export default SoccerScreenView;