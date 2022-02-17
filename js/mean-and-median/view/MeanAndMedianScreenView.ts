// Copyright 2022, University of Colorado Boulder

/**
 * ScreenView for the "Mean and Median" Screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import CASColors from '../../common/CASColors.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import CASAccordionBox from '../../common/view/CASAccordionBox.js';
import CASConstants from '../../common/CASConstants.js';
import DotPlotNode from '../../common/view/DotPlotNode.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';

type MeanAndMedianScreenViewOptions = SoccerScreenViewOptions;

class MeanAndMedianScreenView extends SoccerScreenView {
  readonly dataAccordionBox: CASAccordionBox;
  readonly dotPlotNode: DotPlotNode;

  constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions>( {
      questionBarOptions: {
        barFill: CASColors.meanAndMedianQuestionBarFillColorProperty,
        labelText: centerAndSpreadStrings.meanAndMedianQuestion
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

    // TODO: this is somewhat duplicated with the MedianScreenView
    const accordionBoxTandem = options.tandem.createTandem( 'dataAccordionBox' );

    this.dotPlotNode = new DotPlotNode( this.model, this.chartViewWidth, {
      tandem: accordionBoxTandem.createTandem( 'dotPlotNode' )
    } );

    this.dataAccordionBox = new CASAccordionBox( this.model, this.dotPlotNode, this.topCheckboxPanel, this.layoutBounds, {
      tandem: accordionBoxTandem,
      titleString: centerAndSpreadStrings.dotPlot,
      centerX: this.layoutBounds.centerX,
      top: this.questionBar.bottom + CASConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( this.dataAccordionBox );

    ManualConstraint.create( this, [ this.playAreaNumberLineNode, this.dotPlotNode ],
      ( lowerNumberLineWrapper, dotPlotNodeWrapper ) => {
      dotPlotNodeWrapper.left = lowerNumberLineWrapper.left;
    } );

    this.bottomCheckboxPanel.left = this.globalToParentBounds( this.topCheckboxPanel.getGlobalBounds() ).left;
    this.bottomCheckboxPanel.top = this.dataAccordionBox.bottom + 30;
    this.addChild( this.bottomCheckboxPanel );

    this.addChild( this.objectsLayer );
    this.addChild( this.eraserButton );

    // Last in alternative input focus order
    this.addChild( this.resetAllButton );
  }

  reset(): void {
    super.reset();
    this.dataAccordionBox.reset();
  }
}

centerAndSpread.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );
export default MeanAndMedianScreenView;