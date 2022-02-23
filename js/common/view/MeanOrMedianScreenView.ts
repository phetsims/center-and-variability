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
import NumberCardContainer from '../../common/view/NumberCardContainer.js';
import DotPlotNode from './DotPlotNode.js';
import SoccerModel from '../model/SoccerModel.js';

type MeanOrMedianScreenSelfOptions = {
  isMedianScreen: boolean;
};
export type MeanOrMedianScreenViewOptions = MeanOrMedianScreenSelfOptions & SoccerScreenViewOptions;

class MeanOrMedianScreenView extends SoccerScreenView {
  private readonly accordionBox: CASAccordionBox;

  // TODO: need reset, but may want to make an interface for a resettable Node
  protected readonly accordionBoxContents: NumberCardContainer | DotPlotNode;

  constructor( model: SoccerModel, providedOptions: MeanOrMedianScreenViewOptions ) {

    const options = optionize<MeanOrMedianScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'accordionBox' );

    if ( options.isMedianScreen ) {
      this.accordionBoxContents = new NumberCardContainer( this.model, {

        // Expose this intermediate layer to make it so that clients can hide the number cards with one call
        tandem: accordionBoxTandem.createTandem( 'numberCardContainer' )
      } );
    }
    else {
      this.accordionBoxContents = new DotPlotNode( this.model, this.chartViewWidth, {
        tandem: accordionBoxTandem.createTandem( 'dotPlotNode' )
      } );
    }

    // TODO: CK - float to top of visibleBounds to certain aspect ratio
    this.accordionBox = new CASAccordionBox( this.model, this.accordionBoxContents, this.topCheckboxPanel,
      this.layoutBounds, {
        tandem: accordionBoxTandem,
        titleString: options.isMedianScreen ? centerAndSpreadStrings.distanceInMeters : centerAndSpreadStrings.dotPlot,
        centerX: this.layoutBounds.centerX,
        top: this.questionBar.bottom + CASConstants.SCREEN_VIEW_Y_MARGIN
      } );
    this.contentLayer.addChild( this.accordionBox );

    this.bottomCheckboxPanel.left = this.globalToParentBounds( this.topCheckboxPanel.getGlobalBounds() ).left;
    this.bottomCheckboxPanel.top = this.accordionBox.bottom + 30;

    this.contentLayer.addChild( this.medianPredictionNode );

    if ( !options.isMedianScreen ) {
      this.contentLayer.addChild( this.meanPredictionNode );
    }
  }

  clearData(): void {
    super.clearData();
    this.accordionBoxContents.reset();
  }

  reset(): void {
    super.reset();
    this.accordionBoxContents.reset();
    this.accordionBox.reset();
  }
}

centerAndSpread.register( 'MeanOrMedianScreenView', MeanOrMedianScreenView );
export default MeanOrMedianScreenView;