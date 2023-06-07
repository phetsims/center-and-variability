// Copyright 2023, University of Colorado Boulder

import { Circle, Line, ManualConstraint, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MedianBarNode from '../../common/view/MedianBarNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVPlotNode, { CAVPlotNodeOptions, MIN_KICKS_TEXT_OFFSET, MIN_KICKS_TEXT_TOP_MARGIN } from '../../common/view/CAVPlotNode.js';
import CAVConstants from '../../common/CAVConstants.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberLineNode from '../../common/view/NumberLineNode.js';

type SelfOptions = {
  parentContext: 'accordion' | 'info';
};
type MADNodeOptions = SelfOptions & StrictOmit<CAVPlotNodeOptions, 'dataPointFill'>;

export default class MADNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, providedOptions: MADNodeOptions ) {

    const options = optionize<MADNodeOptions, SelfOptions, CAVPlotNodeOptions>()( {
      dataPointFill: CAVColors.grayDataPointFill
    }, providedOptions );
    super( model, sceneModel, playAreaNumberLineNode, options );

    const needAtLeastOneKickText = new Text( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty, {
      fontSize: 18,
      maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
      layoutOptions: { topMargin: MIN_KICKS_TEXT_TOP_MARGIN }
    } );
    ManualConstraint.create( this, [ needAtLeastOneKickText ], textProxy => {
      textProxy.center = this.modelViewTransform.modelToViewXY( CAVConstants.PHYSICAL_RANGE.getCenter(), MIN_KICKS_TEXT_OFFSET );
    } );
    this.addChild( needAtLeastOneKickText );

    // This adds a top margin to the text, separating it from the info dialog subheading
    needAtLeastOneKickText.localBounds = needAtLeastOneKickText.localBounds.dilatedY( MIN_KICKS_TEXT_TOP_MARGIN );

    const madRectangle = new Rectangle( 0, 50, 100, 72, {
      fill: CAVColors.madRectangleColorProperty
    } );

    const meanLine = new Line( 0, 0, 0, madRectangle.height, {
      stroke: CAVColors.meanColorProperty,
      lineWidth: 1
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
      font: CAVConstants.VARIABILITY_MEASURE_NUMBER_READOUT_FONT
    } );
    const rightReadout = new Text( '', {
      font: CAVConstants.VARIABILITY_MEASURE_NUMBER_READOUT_FONT
    } );

    this.addChild( meanLine );

    const lineContainer = new Node();
    this.addChild( madRectangle );
    madRectangle.moveToBack();
    this.addChild( lineContainer );

    this.addChild( leftBar );
    this.addChild( rightBar );
    this.addChild( leftReadout );
    this.addChild( rightReadout );

    const update = () => {

      const children: Node[] = [];

      const sortedDots = sceneModel.getSortedLandedObjects();

      if ( sortedDots.length > 0 ) {
        const mean = _.mean( sortedDots.map( dot => dot.valueProperty.value ) );

        // Underneath the accordion box title
        let y = 60;
        sortedDots.forEach( dot => {
          const x1 = this.modelViewTransform.modelToViewX( dot.valueProperty.value! );
          const x2 = this.modelViewTransform.modelToViewX( mean );
          const line = new Line( x1, y, x2, y, {
            stroke: 'black'
          } );

          children.push( line );

          // If the line is too short, show a dot to make it visible
          if ( Math.abs( x2 - x1 ) < 1E-4 ) {
            children.push( new Circle( 1.5, {
              fill: 'black',
              center: line.center
            } ) );
          }

          if ( options.parentContext === 'info' ) {
            const distanceToMean = Math.abs( dot.valueProperty.value! - sceneModel.meanValueProperty.value! );
            const text = new Text( Utils.toFixed( distanceToMean, 1 ), {
              font: new PhetFont( 10 ),
              centerBottom: line.centerTop
            } );
            children.push( text );
          }

          // Enough spacing so they don't overlap the bottom row of data points
          y += options.parentContext === 'info' ? 11 : 4.2;
        } );
      }

      lineContainer.children = children;
      lineContainer.visible = sortedDots.length > 0;

      const mad = sceneModel.madValueProperty.value;

      madRectangle.rectWidth = this.modelViewTransform.modelToViewDeltaX( mad === null ? 0 : mad * 2 );
      madRectangle.visible = ( options.parentContext === 'info' || model.isMADVisibleProperty.value ) && mad !== null;

      meanLine.visible = sceneModel.meanValueProperty.value !== null;
      if ( meanLine.visible ) {

        // In the info dialog, the mean line should extend to the top of the MAD rectangle
        if ( options.parentContext === 'info' ) {
          meanLine.setY2( madRectangle.height );
        }

        meanLine.centerX = this.modelViewTransform.modelToViewX( sceneModel.meanValueProperty.value! );
        meanLine.bottom = this.modelViewTransform.modelToViewY( 0 );
      }

      if ( mad !== null ) {
        const viewCenterX = this.modelViewTransform.modelToViewX( sceneModel.meanValueProperty.value! );
        const viewFloorY = this.modelViewTransform.modelToViewY( 0 );

        if ( options.parentContext === 'info' ) {
          lineContainer.bottom = viewFloorY - 10;
          madRectangle.rectHeight = children.length > 0 ? lineContainer.height : 0;
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
      leftBar.visible = ( options.parentContext === 'info' || model.isMADVisibleProperty.value ) && mad !== null && sortedDots.length > 1;
      rightBar.visible = ( options.parentContext === 'info' || model.isMADVisibleProperty.value ) && mad !== null && sortedDots.length > 1;
      leftReadout.visible = ( options.parentContext === 'info' || model.isMADVisibleProperty.value ) && mad !== null && sortedDots.length > 1;
      rightReadout.visible = ( options.parentContext === 'info' || model.isMADVisibleProperty.value ) && mad !== null && sortedDots.length > 1;

      // If the readouts overlap, move them apart
      if ( leftReadout.visible && rightReadout.visible ) {
        const overlap = leftReadout.bounds.dilated( 3 ).intersection( rightReadout.bounds.dilated( 3 ) ).width;
        if ( overlap > 0 ) {
          leftReadout.translate( -overlap / 2, 0 );
          rightReadout.translate( overlap / 2, 0 );
        }
      }

      needAtLeastOneKickText.visible = sceneModel.numberOfDataPointsProperty.value === 0 && ( options.parentContext === 'info' || model.isMADVisibleProperty.value );
    };

    model.isMADVisibleProperty.link( update );
    model.selectedVariabilityMeasureProperty.link( update );

    // It's important to avoid inconsistent intermediate states during the updateDataMeasures calculation, so we
    // only update once it's complete
    sceneModel.variabilityDataMeasuresUpdatedEmitter.addListener( update );

  }
}

centerAndVariability.register( 'MADNode', MADNode );