// Copyright 2023, University of Colorado Boulder

import { Line, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVPlotNode, { CAVPlotOptions } from '../../common/view/CAVPlotNode.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type RangeNodeOptions = SelfOptions & CAVPlotOptions;

export default class MADNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, numberLineWidth: number, providedOptions: RangeNodeOptions ) {

    const options = providedOptions;

    super( model, numberLineWidth, options );

    const needAtLeastOneKick = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      top: 100
    } );
    this.addChild( needAtLeastOneKick );

    const madRectangle = new Rectangle( 0, 50, 100, 72, {
      fill: '#e0c0f5',
      stroke: 'lightGray'
    } );

    const leftBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );
    const rightBar = new MedianBarNode( {
      notchDirection: 'down',
      barStyle: 'continuous',
      stroke: 'black',
      lineWidth: 1
    } );

    const leftReadout = new Text( '', {
      font: new PhetFont( 13 )
    } );
    const rightReadout = new Text( '', {
      font: new PhetFont( 13 )
    } );

    const lineContainer = new Node();
    this.addChild( madRectangle );
    this.addChild( lineContainer );

    this.addChild( leftBar );
    this.addChild( rightBar );
    this.addChild( leftReadout );
    this.addChild( rightReadout );

    const update = () => {

      const children: Node[] = [];

      const sortedDots = _.sortBy( model.objectGroup.getArrayCopy().filter( object => object.valueProperty.value !== null ),
        object => object.valueProperty.value );

      if ( sortedDots.length > 0 ) {
        const mean = _.mean( sortedDots.map( dot => dot.valueProperty.value ) );

        // Underneath the accordion box title
        let y = 55;
        sortedDots.forEach( dot => {
          const x1 = this.modelViewTransform.modelToViewX( dot.valueProperty.value! );
          const x2 = this.modelViewTransform.modelToViewX( mean );
          const line = new Line( x1, y, x2, y, {
            stroke: 'black'
          } );

          children.push( line );

          if ( options.parentContext === 'info' ) {
            const distanceToMean = Math.abs( dot.valueProperty.value! - model.meanValueProperty.value! );
            const text = new Text( Utils.toFixed( distanceToMean, 1 ), {
              font: new PhetFont( 13 ),
              centerBottom: line.centerTop
            } );
            children.push( text );
          }

          // Enough spacing so they don't overlap the bottom row of data points
          y += options.parentContext === 'info' ? 15 : 4.2;
        } );
      }

      lineContainer.children = children;

      // TODO: switch to 'info' and update the rest of the file accordingly, https://github.com/phetsims/center-and-variability/issues/153
      const interestedInMAD = options.parentContext === 'accordion' || model.isShowingMADProperty.value;
      lineContainer.visible = model.selectedVariabilityProperty.value === VariabilityMeasure.MAD && sortedDots.length > 0;

      const mad = model.madValueProperty.value;

      madRectangle.rectWidth = this.modelViewTransform.modelToViewDeltaX( mad === null ? 0 : mad * 2 );
      madRectangle.visible = interestedInMAD && mad !== null;

      if ( mad !== null ) {
        const viewCenterX = this.modelViewTransform.modelToViewX( model.meanValueProperty.value! );
        const viewFloorY = this.modelViewTransform.modelToViewY( 0 );

        if ( options.parentContext === 'info' ) {
          lineContainer.bottom = viewFloorY - 10;
          madRectangle.rectHeight = lineContainer.height;
        }

        madRectangle.centerX = viewCenterX;
        madRectangle.bottom = this.modelViewTransform.modelToViewY( 0 );
        leftReadout.string = Utils.toFixed( mad, 1 );
        rightReadout.string = Utils.toFixed( mad, 1 );

        leftBar.setMedianBarShape( madRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, madRectangle.left, 0, viewCenterX, false );
        rightBar.setMedianBarShape( madRectangle.top - MedianBarNode.NOTCH_HEIGHT - 2, viewCenterX, 0, madRectangle.right, false );

        leftReadout.centerBottom = leftBar.centerTop;
        rightReadout.centerBottom = rightBar.centerTop;
      }
      leftBar.visible = interestedInMAD && mad !== null && sortedDots.length > 1;
      rightBar.visible = interestedInMAD && mad !== null && sortedDots.length > 1;
      leftReadout.visible = interestedInMAD && mad !== null && sortedDots.length > 1;
      rightReadout.visible = interestedInMAD && mad !== null && sortedDots.length > 1;

      needAtLeastOneKick.center = this.modelViewTransform.modelToViewXY( 8, 2 );
      needAtLeastOneKick.visible = model.numberOfDataPointsProperty.value === 0 && interestedInMAD;
    };
    model.objectChangedEmitter.addListener( update );
    model.isShowingMADProperty.link( update );
    model.selectedVariabilityProperty.link( update );
    model.numberOfDataPointsProperty.link( update );
    model.meanValueProperty.link( update );
    model.madValueProperty.link( update );

    // TODO: the numbers should be in front of the "x" marks, but the rectangle should be behind?  Or should the rectangle
    // TODO: be partially transparent?
  }
}

centerAndVariability.register( 'MADNode', MADNode );