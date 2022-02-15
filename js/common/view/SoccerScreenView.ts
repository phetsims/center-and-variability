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
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import { Color, Node, Text } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import SoccerModel from '../model/SoccerModel.js';
import SoccerPlayerNode from './SoccerPlayerNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import SoccerPlayer from '../model/SoccerPlayer.js';

type SoccerScreenViewSelfOptions = {
  questionBarOptions: QuestionBarOptions
};
export type SoccerScreenViewOptions = SoccerScreenViewSelfOptions & CASScreenViewOptions;

// constants
const GROUND_POSITION_Y = 490;
const NUMBER_LINE_MARGIN_X = 140;
const TICK_MARK_EXTENT = 18;

class SoccerScreenView extends CASScreenView {
  protected readonly questionBar: QuestionBar;

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

    this.addChild( new BackgroundNode( GROUND_POSITION_Y, this.visibleBoundsProperty ) );

    const numberLineNode = new Node( {
      tandem: options.tandem.createTandem( 'numberLineNode' )
    } );
    const chartTransform = new ChartTransform( {
      viewWidth: chartViewWidth,
      modelXRange: new Range( 1, 16 )
    } );
    const tickMarkSet = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 1, {
      stroke: Color.WHITE,
      extent: TICK_MARK_EXTENT
    } );
    numberLineNode.addChild( tickMarkSet );

    const tickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, {
      extent: TICK_MARK_EXTENT + 12,
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 16 } )
    } );
    numberLineNode.addChild( tickLabelSet );
    numberLineNode.top = GROUND_POSITION_Y;
    numberLineNode.x = NUMBER_LINE_MARGIN_X;
    this.addChild( numberLineNode );

    const soccerPlayerNodeGroup = new PhetioGroup<SoccerPlayerNode, [ SoccerPlayer ]>( ( tandem, soccerPlayer ) => {
      return new SoccerPlayerNode( soccerPlayer, {
        tandem: tandem
      } );
    }, [ model.soccerPlayerGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'soccerPlayerNodeGroup' ),
      supportsDynamicState: false
    } );

    let index = 0; // TODO: Shouldn't PhetioGroup.forEach support index? This current pattern will likely not work for state?
    const createSoccerPlayerNode = ( soccerPlayer: SoccerPlayer ) => {
      const SPACING = 5;
      const soccerPlayerNode = soccerPlayerNodeGroup.createCorrespondingGroupElement( soccerPlayer.tandem.name, soccerPlayer );

      soccerPlayerNode.setScaleMagnitude( Utils.linear( 0, model.soccerPlayerGroup.countProperty.value - 1, 1, 0.9, index ) );
      soccerPlayerNode.centerBottom =
        modelViewTransform.modelToViewPosition( new Vector2( 0, 0 ) ).plusXY( -20 - index * SPACING, 3 );

      this.addChild( soccerPlayerNode );
      index++;
    };
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

    this.addChild( this.resetAllButton );
  }
}

centerAndSpread.register( 'SoccerScreenView', SoccerScreenView );
export default SoccerScreenView;