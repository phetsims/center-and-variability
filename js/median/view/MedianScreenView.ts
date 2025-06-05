// Copyright 2022-2025, University of Colorado Boulder

/**
 * The MedianScreenView displays the Median screen in a simulation. It features a question bar, an accordion box,
 * a "Predict Median" visual node, and an info dialog that appears when the "Info" button is clicked.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import MedianModel from '../model/MedianModel.js';
import MedianAccordionBox from './MedianAccordionBox.js';
import MedianInfoDialog from './MedianInfoDialog.js';
import MedianScreenSummaryContent from './MedianScreenSummaryContent.js';

type SelfOptions = EmptySelfOptions;
type MedianScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class MedianScreenView extends CAVScreenView {
  private readonly medianAccordionBox: MedianAccordionBox;

  public constructor( model: MedianModel, providedOptions: MedianScreenViewOptions ) {
    const options = optionize<MedianScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.medianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.medianQuestionStringProperty
      },
      screenSummaryContent: new MedianScreenSummaryContent( model )
    }, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'distanceAccordionBox' );

    this.medianAccordionBox = new MedianAccordionBox(
      model,
      this.layoutBounds,
      accordionBoxTandem,
      this.questionBar.bottom + CAVConstants.ACCORDION_BOX_TOP_MARGIN );
    this.setAccordionBox( this.medianAccordionBox );

    const controls = this.addPlayAreaControls( new VerticalCheckboxGroup( [
      PlayAreaCheckboxFactory.getPredictMedianCheckboxItem( model.isPredictMedianVisibleProperty ),
      PlayAreaCheckboxFactory.getMedianCheckboxItem( model.isPlayAreaMedianVisibleProperty, model.selectedSceneModelProperty )
    ], {
      tandem: this.soccerAreaTandem.createTandem( 'checkboxGroup' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } ), this.soccerAreaTandem );

    const predictMedianNode = CAVScreenView.createPredictMedianNode(
      model.predictMedianValueProperty,
      model.isPredictMedianVisibleProperty,
      this.modelViewTransform,
      this.soccerAreaTandem.createTandem( 'predictMedianNode' )
    );

    this.backScreenViewLayer.addChild( predictMedianNode );

    const infoDialog = new MedianInfoDialog( model, model.sceneModels[ 0 ], accordionBoxTandem.createTandem( 'infoDialog' ) );

    model.infoButtonPressedEmitter.addListener( () => infoDialog.show() );

    this.cavSetPDOMOrder( controls, [ predictMedianNode ], this.medianAccordionBox.infoButton );
  }
}

centerAndVariability.register( 'MedianScreenView', MedianScreenView );