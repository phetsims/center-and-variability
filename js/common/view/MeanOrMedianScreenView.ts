// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for the "Median" and "Mean and Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import CASAccordionBox from '../../common/view/CASAccordionBox.js';
import CASConstants from '../../common/CASConstants.js';
import CardNodeContainer from '../../common/view/CardNodeContainer.js';
import DotPlotNode from './DotPlotNode.js';
import SoccerModel from '../model/SoccerModel.js';
import ValueReadoutsNode from './ValueReadoutsNode.js';
import { ManualConstraint, Text } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlotType from '../model/PlotType.js';

type MeanOrMedianScreenSelfOptions = {
  isMedianScreen: boolean;
};
export type MeanOrMedianScreenViewOptions = MeanOrMedianScreenSelfOptions & SoccerScreenViewOptions;

class MeanOrMedianScreenView extends SoccerScreenView {
  private readonly accordionBox: CASAccordionBox;

  // TODO: need reset, but may want to make an interface for a resettable Node
  protected readonly accordionBoxContents: CardNodeContainer | DotPlotNode;

  constructor( model: SoccerModel, providedOptions: MeanOrMedianScreenViewOptions ) {

    const options = optionize<MeanOrMedianScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'accordionBox' );

    if ( options.isMedianScreen ) {
      this.accordionBoxContents = new CardNodeContainer( this.model, {

        // Expose this intermediate layer to make it so that clients can hide the number cards with one call
        tandem: accordionBoxTandem.createTandem( 'cardNodeContainer' )
      } );
    }
    else {
      this.accordionBoxContents = new DotPlotNode( this.model, this.chartViewWidth, {
        tandem: accordionBoxTandem.createTandem( 'dotPlotNode' )
      } );
    }

    const titleNode = new Text( '', {
      font: new PhetFont( 16 ),
      maxWidth: 300
    } );

    // TODO: medianScreen should not need a link here
    CASConstants.PLOT_TYPE_PROPERTY.link( plotType => {
      if ( options.isMedianScreen ) {
        titleNode.text = centerAndSpreadStrings.distanceInMeters;
      }
      else {
        titleNode.text = plotType === PlotType.LINE_PLOT ? centerAndSpreadStrings.linePlot : centerAndSpreadStrings.dotPlot;
      }
    } );

    this.accordionBox = new CASAccordionBox( this.model, this.accordionBoxContents, this.topCheckboxPanel,
      titleNode,
      this.layoutBounds, {
        tandem: accordionBoxTandem,
        contentNodeOffsetY: options.isMedianScreen ? -8 : 0,
        centerX: this.layoutBounds.centerX,
        top: this.questionBar.bottom + CASConstants.SCREEN_VIEW_Y_MARGIN,

        // TODO: Better pattern for this
        valueReadoutsNode: options.isMedianScreen ? null : new ValueReadoutsNode( model )
      } );
    this.contentLayer.addChild( this.accordionBox );

    const BOTTOM_CHECKBOX_PANEL_MARGIN = 12.5;
    this.bottomCheckboxPanel.left = this.playAreaNumberLineNode.right + BOTTOM_CHECKBOX_PANEL_MARGIN;
    this.bottomCheckboxPanel.bottom = this.modelViewTransform.modelToViewY( 0 ) - BOTTOM_CHECKBOX_PANEL_MARGIN;

    ManualConstraint.create( this, [ this.bottomCheckboxPanel, this.topCheckboxPanel ],
      ( bottomCheckboxPanelWrapper, topCheckboxPanelWrapper ) => {
        topCheckboxPanelWrapper.x = bottomCheckboxPanelWrapper.x;
      } );

    // Add in the same order as the checkboxes, so the z-order matches the checkbox order
    if ( !options.isMedianScreen ) {
      this.contentLayer.addChild( this.meanPredictionNode );
    }

    this.contentLayer.addChild( this.medianPredictionNode );
  }

  clearData(): void {
    super.clearData();
    this.accordionBoxContents.clear();
  }

  reset(): void {
    super.reset();
    this.accordionBoxContents.reset();
    this.accordionBox.reset();
  }
}

centerAndSpread.register( 'MeanOrMedianScreenView', MeanOrMedianScreenView );
export default MeanOrMedianScreenView;