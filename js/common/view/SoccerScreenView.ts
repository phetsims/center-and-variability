// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel from '../model/CASModel.js';
import CASScreenView, { CASScreenViewOptions } from './CASScreenView.js';
import QuestionBar, { QuestionBarOptions } from './QuestionBar.js';
import KickButtonGroup from './KickButtonGroup.js';
import BackgroundNode from './BackgroundNode.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Color, Node, Text } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CASObjectType from '../model/CASObjectType.js';
import ScreenView from '../../../../joist/js/ScreenView.js';

type SoccerScreenViewSelfOptions = {
  questionBarOptions: QuestionBarOptions
};
export type SoccerScreenViewOptions = SoccerScreenViewSelfOptions & CASScreenViewOptions;

// constants
const GROUND_POSITION_Y = 490;
const NUMBER_LINE_MARGIN_X = 140;
const TICK_MARK_EXTENT = 18;

class SoccerScreenView extends CASScreenView {
  constructor( model: CASModel, providedOptions: SoccerScreenViewOptions ) {
    const options = optionize<SoccerScreenViewOptions>( {

      // phet-io options
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

    // TODO: instrument number line, maybe the whole node or just the tick labels?
    const numberLineNode = new Node();
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

    this.addChild( new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, options.questionBarOptions ) );
    this.addChild( new KickButtonGroup( {
      left: 25,
      bottom: this.layoutBounds.bottom - 8,
      tandem: options.tandem.createTandem( 'kickButtonGroup' )
    } ) );

    this.addChild( this.resetAllButton );

    const ballRadius = 0.2;

    model.objectGroup.createNextElement( {
      initialPosition: new Vector2( 8, ballRadius ),
      radius: ballRadius,
      objectType: CASObjectType.SOCCER_BALL
    } );
  }

  /**
   * Resets the view.
   */
  reset() {
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ) {
  }
}

centerAndSpread.register( 'SoccerScreenView', SoccerScreenView );
export default SoccerScreenView;