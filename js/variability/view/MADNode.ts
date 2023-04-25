// Copyright 2023, University of Colorado Boulder

import { Text, Node, NodeOptions, Line, Rectangle } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VariabilityModel from '../model/VariabilityModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';

type SelfOptions = {
  staticDisplay?: VariabilityMeasure | null;
};
type RangeNodeOptions = SelfOptions & NodeOptions;

export default class MADNode extends Node {
  public constructor( model: VariabilityModel, modelViewTransform: ModelViewTransform2, providedOptions?: RangeNodeOptions ) {

    const options = optionize<RangeNodeOptions, SelfOptions, NodeOptions>()( {
      staticDisplay: null
    }, providedOptions );

    super();

    const needAtLeastOneKick = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      top: 100
    } );
    this.addChild( needAtLeastOneKick );

    const madRectangle = new Rectangle( 0, 50, 100, 100, {
      fill: '#e0c0f5',
      stroke: 'lightGray'
    } );

    const lineContainer = new Node();
    this.addChild( madRectangle );
    this.addChild( lineContainer );

    const update = () => {

      const children: Node[] = [];

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );

      if ( sortedDots.length > 0 ) {
        const mean = _.mean( sortedDots.map( dot => dot.valueProperty.value ) );

        // Underneath the accordion box title
        let y = 36;
        sortedDots.forEach( dot => {
          const x1 = modelViewTransform.modelToViewX( dot.valueProperty.value! );
          const x2 = modelViewTransform.modelToViewX( mean );
          children.push( new Line( x1, y, x2, y, {
            stroke: 'black'
          } ) );

          // Enough spacing so they don't overlap the bottom row of data points
          y += 5;
        } );
      }

      lineContainer.children = children;

      const interestedInMAD = options.staticDisplay === VariabilityMeasure.MAD || model.isShowingMADProperty.value;
      lineContainer.visible = model.selectedVariabilityProperty.value === VariabilityMeasure.MAD && sortedDots.length > 0;

      const mad = model.madValueProperty.value;

      madRectangle.rectWidth = modelViewTransform.modelToViewDeltaX( mad === null ? 0 : mad * 2 );

      if ( mad !== null ) {
        madRectangle.centerX = modelViewTransform.modelToViewX( model.meanValueProperty.value! );
        madRectangle.bottom = modelViewTransform.modelToViewY( 0 );
      }

      madRectangle.visible = interestedInMAD;

      needAtLeastOneKick.center = modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastOneKick.visible = model.numberOfDataPointsProperty.value === 0 && interestedInMAD;
    };
    model.objectChangedEmitter.addListener( update );
    model.isShowingMADProperty.link( update );
    model.selectedVariabilityProperty.link( update );
    model.numberOfDataPointsProperty.link( update );
    model.meanValueProperty.link( update );
    model.madValueProperty.link( update );
  }
}

centerAndVariability.register( 'MADNode', MADNode );