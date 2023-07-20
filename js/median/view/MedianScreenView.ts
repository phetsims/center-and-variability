// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen View for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import MedianModel from '../model/MedianModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import MedianAccordionBox from './MedianAccordionBox.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import { AlignGroup } from '../../../../scenery/js/imports.js';
import CAVConstants from '../../common/CAVConstants.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import MedianInfoDialog from './MedianInfoDialog.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions =
  SelfOptions
  & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class MedianScreenView extends CAVScreenView {
  private readonly medianAccordionBox: MedianAccordionBox;

  public constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {

    const options = optionize<MedianScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.medianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.medianQuestionStringProperty
      }
    }, providedOptions );

    super( model, options );

    this.medianAccordionBox = new MedianAccordionBox(
      model,
      this.layoutBounds,
      options.tandem.createTandem( 'accordionBox' ),
      this.questionBar.bottom + CAVConstants.ACCORDION_BOX_TOP_MARGIN );
    this.setAccordionBox( this.medianAccordionBox );

    const iconGroup = new AlignGroup();

    const bottomControls = this.setBottomControls( new VerticalCheckboxGroup( [
      PlayAreaCheckboxFactory.getPredictMedianCheckboxItem( iconGroup, model ),
      PlayAreaCheckboxFactory.getMedianCheckboxItem( iconGroup, model )
    ], {
      tandem: this.tandem.createTandem( 'bottomCheckboxGroup' )
    } ), this.tandem );

    const medianPredictionNode = CAVScreenView.createMedianPredictionNode(
      model,
      this.modelViewTransform,
      options.tandem.createTandem( 'medianPredictionNode' )
    );

    this.backScreenViewLayer.addChild( medianPredictionNode );

    const infoDialog = new MedianInfoDialog( model, model.sceneModels[ 0 ], this.playAreaNumberLineNode, {
      tandem: options.tandem.createTandem( 'infoDialog' )
    } );

    model.isInfoVisibleProperty.link( isInfoVisible => {
      if ( isInfoVisible ) {
        infoDialog.show();
      }
      else {
        infoDialog.hide();
      }
    } );

    this.screenViewRootNode.pdomOrder = [
      this.kickButtonGroup,
      this.backScreenViewLayer,
      bottomControls,
      medianPredictionNode,
      this.intervalToolLayer,
      this.accordionBox,
      this.medianAccordionBox.infoButton,
      this.eraseButton,
      this.resetAllButton
    ];
  }
}

centerAndVariability.register( 'MedianScreenView', MedianScreenView );