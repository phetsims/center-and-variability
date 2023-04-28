// Copyright 2023, University of Colorado Boulder

import CAVObjectNode, { CAVObjectNodeOptions } from './CAVObjectNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVObject from '../model/CAVObject.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TProperty from '../../../../axon/js/TProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SoccerBallNodeOptions = StrictOmit<CAVObjectNodeOptions, 'fill'>;

export default class SoccerBallNode extends CAVObjectNode {

  public constructor( soccerBall: CAVObject, isShowingPlayAreaMedianProperty: TReadOnlyProperty<boolean>,
                      modelViewTransform: ModelViewTransform2, objectNodesInputEnabledProperty: TProperty<boolean>,
                      providedOptions?: SoccerBallNodeOptions ) {

    const options = optionize<SoccerBallNodeOptions, EmptySelfOptions, CAVObjectNodeOptions>()( {
      fill: null
    }, providedOptions );

    super( soccerBall, isShowingPlayAreaMedianProperty, modelViewTransform, objectNodesInputEnabledProperty, options );
  }
}

centerAndVariability.register( 'SoccerBallNode', SoccerBallNode );