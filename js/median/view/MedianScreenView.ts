// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import MedianModel from '../model/MedianModel.js';
import { CASScreenViewOptions } from '../../common/view/CASScreenView.js';
import SoccerScreenView from '../../common/view/SoccerScreenView.js';
import CASColors from '../../common/CASColors.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import CASAccordionBox from '../../common/view/CASAccordionBox.js';
import CASConstants from '../../common/CASConstants.js';
import NumberCardContainer from '../../common/view/NumberCardContainer.js';

type MedianScreenViewOptions = CASScreenViewOptions;

class MedianScreenView extends SoccerScreenView {
  readonly dataAccordionBox: CASAccordionBox;
  private readonly numberCardContainer: NumberCardContainer;

  constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions>( {
      questionBarOptions: {
        barFill: CASColors.medianQuestionBarFillColorProperty,
        labelText: centerAndSpreadStrings.medianQuestion
      },
      topCheckboxPanelOptions: {
        includeSortData: true,
        includeShowMean: false
      },
      bottomCheckboxPanelOptions: {
        includeMean: false,
        includePredictMean: false
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'dataAccordionBox' );

    this.numberCardContainer = new NumberCardContainer( this.model, {

      // Expose this intermediate layer to make it so that clients can hide the number cards with one call
      tandem: accordionBoxTandem.createTandem( 'numberCardContainer' )
    } );

    // TODO: CK - float to top of visibleBounds to certain aspect ratio
    this.dataAccordionBox = new CASAccordionBox( this.model, this.numberCardContainer, this.topCheckboxPanel,
      this.layoutBounds, {
      tandem: accordionBoxTandem,
      titleString: centerAndSpreadStrings.data,
      centerX: this.layoutBounds.centerX,
      top: this.questionBar.bottom + CASConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( this.dataAccordionBox );

    this.bottomCheckboxPanel.left = this.globalToParentBounds( this.topCheckboxPanel.getGlobalBounds() ).left;
    this.bottomCheckboxPanel.top = this.dataAccordionBox.bottom + 30;
    this.addChild( this.bottomCheckboxPanel );

    this.addChild( this.objectsLayer );
    this.addChild( this.eraserButton );

    // Last in alternative input focus order
    this.addChild( this.resetAllButton );
  }

  clearData(): void {
    this.numberCardContainer.reset();
  }

  reset(): void {
    super.reset();
    this.numberCardContainer.reset();
    this.dataAccordionBox.reset();
  }
}

centerAndSpread.register( 'MedianScreenView', MedianScreenView );
export default MedianScreenView;