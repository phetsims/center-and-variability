// Copyright 2022, University of Colorado Boulder

/**
 * Shows the dot plot on the "Mean & Median" Screen, including the legends/readouts to the left.
 * The plot is non-interactive.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndSpread from '../../centerAndSpread.js';
import { Color, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CASModel from '../model/CASModel.js';
import CASObject from '../model/CASObject.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CASObjectNode from './CASObjectNode.js';
import CASObjectType from '../model/CASObjectType.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberLineNode from './NumberLineNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// constants

type DotPlotNodeSelfOptions = {};
export type DotPlotNodeOptions = NodeOptions & Required<Pick<NodeOptions, 'tandem'>>;

class DotPlotNode extends Node {

  private readonly model: CASModel;
  private readonly dotLayer: Node;

  constructor( model: CASModel, numberLineWidth: number, providedOptions?: DotPlotNodeOptions ) {

    const options = optionize<DotPlotNodeOptions, DotPlotNodeSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.model = model;

    // TODO: Factor out height with accordion box height
    const backgroundNode = new Rectangle( 0, 0, numberLineWidth, 180 );
    this.addChild( backgroundNode );

    const numberLinePositionY = 130;

    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2( 1, 0, 16, 15 ),
      new Bounds2( 0, numberLinePositionY - numberLineWidth, 0 + numberLineWidth, numberLinePositionY )
    );

    const numberLineNode = new NumberLineNode( model.rangeProperty.value, numberLineWidth, {
      color: Color.BLACK,
      includeXAxis: true,
      tandem: options.tandem.createTandem( 'numberLineNode' ),
      top: numberLinePositionY
    } );
    backgroundNode.addChild( numberLineNode );

    this.dotLayer = new Node();
    backgroundNode.addChild( this.dotLayer );

    const objectNodeGroup = new PhetioGroup<CASObjectNode, [ CASObject ]>( ( tandem, casObject ) => {
      return new CASObjectNode( casObject, model.isShowingBottomMedianProperty, modelViewTransform, {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( model.objectType === CASObjectType.SOCCER_BALL ? 'soccerBallNodeGroup' : 'dataPointNodeGroup' ),
      supportsDynamicState: false
    } );

    const map = new Map<CASObject, CASObjectNode>();

    const createObjectNode = ( casObject: CASObject ) => {
      const casObjectNode = objectNodeGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject );

      casObject.valueProperty.link( value => {
        casObjectNode.setVisible( value !== null );
        if ( value !== null && !this.dotLayer.hasChild( casObjectNode ) ) {
          this.dotLayer.addChild( casObjectNode );
        }
      } );
      map.set( casObject, casObjectNode );
    };
    model.objectGroup.forEach( createObjectNode );
    model.objectGroup.elementCreatedEmitter.addListener( createObjectNode );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const viewNode = map.get( casObject )!;
      objectNodeGroup.disposeElement( viewNode );
    } );
  }
}

centerAndSpread.register( 'DotPlotNode', DotPlotNode );
export default DotPlotNode;