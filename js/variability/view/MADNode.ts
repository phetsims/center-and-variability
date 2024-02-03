// Copyright 2023-2024, University of Colorado Boulder

/**
 * `MADNode` is a specialized plot node designed for the representation of MAD (Mean Absolute Deviation)
 * in the simulation. The node builds upon the generic `CAVPlotNode` and incorporates additional visual elements
 * tailored for MAD representation, including:
 *
 * 1. Deviation lines: These lines represent the deviation of each data point from the mean.
 * 2. A MAD interval rectangle: Highlights the range of the MAD around the mean.
 * 3. Labels: To assist in understanding the representation, especially when displaying mean and MAD values.
 * 4. Data point indicators: To illustrate points where deviation is exactly zero.
 *
 * The node is interactive and updates its presentation when the data points change, providing a dynamic visual
 * indication of how different data distributions can influence the calculated MAD.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Circle, Line, ManualConstraint, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVPlotNode, { CAVPlotNodeOptions, MIN_KICKS_TEXT_OFFSET } from '../../common/view/CAVPlotNode.js';
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVColors from '../../common/CAVColors.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import IntervalBarNode from '../../common/view/IntervalBarNode.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TProperty from '../../../../axon/js/TProperty.js';
import NeedAtLeastNKicksText from '../../common/view/NeedAtLeastNKicksText.js';
import RepresentationContext from '../../common/model/RepresentationContext.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = {
  representationContext: RepresentationContext;
};
type MADNodeOptions = SelfOptions & StrictOmit<CAVPlotNodeOptions, 'dataPointFill'> & PickRequired<CAVPlotNodeOptions, 'tandem'>;

export default class MADNode extends CAVPlotNode {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, playAreaNumberLineNode: NumberLineNode, isDataPointLayerVisibleProperty: TProperty<boolean>, providedOptions: MADNodeOptions ) {

    const options = optionize<MADNodeOptions, SelfOptions, CAVPlotNodeOptions>()( {
      dataPointFill: CAVColors.variabilityDataPointFill,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );
    super( false, sceneModel, playAreaNumberLineNode, isDataPointLayerVisibleProperty, DerivedProperty.valueEqualsConstant( model.selectedVariabilityMeasureProperty, VariabilityMeasure.MAD ), options );

    const needAtLeastOneKickText = new NeedAtLeastNKicksText( CenterAndVariabilityStrings.needAtLeastOneKickStringProperty );
    ManualConstraint.create( this, [ needAtLeastOneKickText ], textProxy => {
      textProxy.center = this.modelViewTransform.modelToViewXY( CAVConstants.PHYSICAL_RANGE.getCenter(), MIN_KICKS_TEXT_OFFSET );
    } );
    this.addChild( needAtLeastOneKickText );

    // This adds a top margin to the text, separating it from the info dialog subheading
    // needAtLeastOneKickText.localBounds = needAtLeastOneKickText.localBounds.dilatedY( MIN_KICKS_TEXT_TOP_MARGIN );

    const madRectangle = new Rectangle( 0, 50, 100, CAVConstants.VARIABILITY_PLOT_RECT_HEIGHT, {
      fill: CAVColors.madRectangleColorProperty
    } );

    const meanLine = new Line( 0, 0, 0, madRectangle.height, {
      stroke: CAVColors.meanColorProperty,
      lineWidth: 1
    } );
    const meanLabelLine = new Line( 0, 0, 0, 25, {
      stroke: CAVColors.meanColorProperty,
      lineWidth: 1
    } );

    const meanEqualsValueStringProperty = new PatternStringProperty( CenterAndVariabilityStrings.meanEqualsValueMPatternStringProperty,
      { value: sceneModel.meanValueProperty }, {
        tandem: options.tandem.createTandem( 'meanEqualsValueStringProperty' ),
        maps: {
          value: mean => {
            return mean === null ? 'null' : Utils.toFixed( mean, CAVConstants.VARIABILITY_MEASURE_DECIMAL_POINTS );
          }
        }
      }
    );

    const meanReadoutText = new Text( meanEqualsValueStringProperty, {
      fill: CAVColors.meanColorProperty,
      font: new PhetFont( 14 )
    } );

    if ( options.representationContext === 'info' ) {
      this.addChild( meanReadoutText );
    }

    const leftBar = new IntervalBarNode();
    const rightBar = new IntervalBarNode();

    const leftReadout = new Text( '', {
      font: CAVConstants.VARIABILITY_MEASURE_NUMBER_READOUT_FONT
    } );
    const rightReadout = new Text( '', {
      font: CAVConstants.VARIABILITY_MEASURE_NUMBER_READOUT_FONT
    } );

    const linesAndTextContainer = new Node();
    this.addChild( madRectangle );
    madRectangle.moveToBack();
    this.addChild( linesAndTextContainer );

    // this contains the top brackets and MAD labels so that their visibility can be controlled together
    const madAnnotationContainer = new Node();

    madAnnotationContainer.addChild( leftBar );
    madAnnotationContainer.addChild( rightBar );
    madAnnotationContainer.addChild( leftReadout );
    madAnnotationContainer.addChild( rightReadout );

    this.addChild( madAnnotationContainer );

    this.addChild( meanLine );
    if ( options.representationContext === 'info' ) {
      this.addChild( meanLabelLine );
    }

    // this contains the dots for deviations of zero, which appear in front of the mean line
    const zeroDotContainer = new Node();
    this.addChild( zeroDotContainer );

    const update = () => {

      const linesAndTextNodes: Node[] = [];
      const zeroDotNodes: Node[] = [];

      const soccerBalls = sceneModel.getSortedLandedObjects();

      const textNodes: Text[] = [];
      const MAD_MARGIN_TOP = 5;
      const MAD_MARGIN_BOTTOM_MIN = 5;
      const MAD_MARGIN_BOTTOM_FACTOR = 1; // how many lineDeltaY's make up the additional bottom margin

      if ( soccerBalls.length > 0 ) {
        const mean = _.mean( soccerBalls.map( dot => dot.valueProperty.value ) );

        // in the accordion box, the top margin is MAD_MARGIN_TOP, bottom margin is MAD_MARGIN_BOTTOM_MIN + MAD_MARGIN_BOTTOM_FACTOR * lineDeltaY
        const lineDeltaY = options.representationContext === 'info' ? 12 :
                           ( CAVConstants.VARIABILITY_PLOT_RECT_HEIGHT - MAD_MARGIN_TOP - MAD_MARGIN_BOTTOM_MIN ) / ( MAX_KICKS_PROPERTY.value - 1 + MAD_MARGIN_BOTTOM_FACTOR );

        // Start the deviation lines below the top of the MAD rectangle and build downwards
        // In the info dialog, ensure that there is a margin of 10 between the number line and the bottom deviation line
        let y = options.representationContext === 'info' ?
                this.modelViewTransform.modelToViewY( 0 ) - 10 - ( soccerBalls.length - 1 ) * lineDeltaY :
                madRectangle.top + MAD_MARGIN_TOP;

        soccerBalls.forEach( soccerBall => {
          const x1 = this.modelViewTransform.modelToViewX( soccerBall.valueProperty.value! );
          const x2 = this.modelViewTransform.modelToViewX( mean );
          const line = new Line( x1, y, x2, y, {
            stroke: 'black'
          } );

          linesAndTextNodes.push( line );

          // If the line is too short, show a dot to make it visible
          if ( Math.abs( x2 - x1 ) < 1E-4 ) {
            zeroDotNodes.push( new Circle( 1.5, {
              fill: 'black',
              center: line.center
            } ) );
          }

          if ( options.representationContext === 'info' ) {
            const deltaX = soccerBall.valueProperty.value! - sceneModel.meanValueProperty.value!;

            const distanceToMean = sceneModel.getDeviationForBallValue( soccerBall.valueProperty.value! );

            // place the text a half-integer inward from the tip of the line so that it doesn't occlude any data points
            const textX = this.modelViewTransform.modelToViewX( soccerBall.valueProperty.value! - 0.5 * Math.sign( deltaX ) );

            const text = new Text( Utils.toFixed( distanceToMean, 1 ), {
              font: new PhetFont( { size: 10 } ),
              centerX: textX,
              bottom: line.top
            } );
            textNodes.push( text );

            // If the text overlaps the mean line, move it further away so it doesn't overlap
            const MARGIN = 2;

            if ( x1 < x2 ) {
              text.right = Math.min( text.right, line.right - MARGIN );
            }
            else if ( x1 >= x2 ) {
              text.left = Math.max( text.left, line.left + MARGIN );
            }

            linesAndTextNodes.push( text );
          }

          y += lineDeltaY;
        } );
      }

      linesAndTextContainer.children = linesAndTextNodes;
      zeroDotContainer.children = zeroDotNodes;

      const mad = sceneModel.madValueProperty.value;

      madRectangle.rectWidth = this.modelViewTransform.modelToViewDeltaX( mad === null ? 0 : mad * 2 );

      const isMADVisible = ( options.representationContext === 'info' || model.isMADVisibleProperty.value ) && mad !== null;
      madRectangle.visible = isMADVisible;
      madAnnotationContainer.visible = isMADVisible && soccerBalls.length > 1;

      if ( mad !== null ) {
        const viewCenterX = this.modelViewTransform.modelToViewX( sceneModel.meanValueProperty.value! );

        if ( options.representationContext === 'info' ) {
          madRectangle.rectHeight = linesAndTextNodes.length > 0 ? ( linesAndTextContainer.height + textNodes[ 0 ].height ) : 0;
        }

        madRectangle.centerX = viewCenterX;
        madRectangle.bottom = this.modelViewTransform.modelToViewY( 0 );
        leftReadout.string = Utils.toFixed( mad, 1 );
        rightReadout.string = Utils.toFixed( mad, 1 );

        leftBar.setIntervalBarNodeWidth( viewCenterX - madRectangle.left );
        rightBar.setIntervalBarNodeWidth( madRectangle.right - viewCenterX );

        leftBar.bottom = madRectangle.top + CAVConstants.VARIABILITY_PLOT_BAR_OFFSET_Y;
        rightBar.bottom = madRectangle.top + CAVConstants.VARIABILITY_PLOT_BAR_OFFSET_Y;
        leftBar.right = viewCenterX + leftBar.lineWidth / 2;
        rightBar.left = viewCenterX - rightBar.lineWidth / 2;

        leftReadout.centerBottom = leftBar.centerTop;
        rightReadout.centerBottom = rightBar.centerTop;
      }

      meanLine.visible = sceneModel.meanValueProperty.value !== null;

      if ( meanLine.visible ) {
        meanLine.centerX = this.modelViewTransform.modelToViewX( sceneModel.meanValueProperty.value! );
        meanLine.setY2( madRectangle.rectHeight );
        meanLine.bottom = this.modelViewTransform.modelToViewY( 0 );
      }

      if ( options.representationContext === 'info' ) {
        meanLabelLine.visible = sceneModel.meanValueProperty.value !== null;

        if ( meanLabelLine.visible ) {
          meanLabelLine.centerX = this.modelViewTransform.modelToViewX( sceneModel.meanValueProperty.value! );
          const offsetY = sceneModel.numberOfDataPointsProperty.value === 1 ? 0 : CAVConstants.VARIABILITY_PLOT_BAR_OFFSET_Y;
          meanLabelLine.bottom = madRectangle.top + offsetY;
        }
      }

      const meanReadoutTextVisible = sceneModel.numberOfDataPointsProperty.value > 0 && options.representationContext === 'info';
      meanReadoutText.visible = meanReadoutTextVisible;
      if ( meanReadoutTextVisible ) {
        meanReadoutText.centerX = meanLine.centerX;
        meanReadoutText.bottom = leftReadout.top - 5;
      }

      // If the readouts overlap, move them apart
      if ( leftReadout.visible && rightReadout.visible ) {
        const overlap = leftReadout.bounds.dilated( 3 ).intersection( rightReadout.bounds.dilated( 3 ) ).width;
        if ( overlap > 0 ) {
          leftReadout.translate( -overlap / 2, 0 );
          rightReadout.translate( overlap / 2, 0 );
        }
      }

      needAtLeastOneKickText.visible = sceneModel.numberOfDataPointsProperty.value === 0 && ( options.representationContext === 'info' || model.isMADVisibleProperty.value );
    };

    model.isMADVisibleProperty.link( update );
    model.selectedVariabilityMeasureProperty.link( update );

    // It's important to avoid inconsistent intermediate states during the updateDataMeasures calculation, so we
    // only update once it's complete
    sceneModel.variabilityDataMeasuresUpdatedEmitter.addListener( update );

  }
}

centerAndVariability.register( 'MADNode', MADNode );