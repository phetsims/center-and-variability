// Copyright 2022-2024, University of Colorado Boulder

/**
 * MeanAndMedianScreenView represents the view for the Mean and Median screen.
 * It organizes and displays various UI elements, including accordion boxes,
 * prediction sliders for mean and median, checkboxes for play area controls,
 * and an info dialog providing additional details about the mean and median.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import PredictionSlider from '../../common/view/PredictionSlider.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import MeanAndMedianAccordionBox from './MeanAndMedianAccordionBox.js';
import MeanAndMedianInfoDialog from './MeanAndMedianInfoDialog.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class MeanAndMedianScreenView extends CAVScreenView {

  public constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.meanAndMedianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.meanAndMedianQuestionStringProperty
      }
    }, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'plotAccordionBox' );

    const meanAndMedianAccordionBox = new MeanAndMedianAccordionBox(
      model,
      this.layoutBounds,
      accordionBoxTandem,
      this.questionBar.bottom + CAVConstants.ACCORDION_BOX_TOP_MARGIN,
      this.playAreaNumberLineNode
    );
    this.setAccordionBox( meanAndMedianAccordionBox );

    const controls = this.addPlayAreaControls( new VerticalCheckboxGroup( [
      PlayAreaCheckboxFactory.getPredictMedianCheckboxItem( model.isPredictMedianVisibleProperty ),
      PlayAreaCheckboxFactory.getPredictMeanCheckboxItem( model.isPredictMeanVisibleProperty ),
      PlayAreaCheckboxFactory.getMedianCheckboxItem( model.isPlayAreaMedianVisibleProperty, model.selectedSceneModelProperty ),
      PlayAreaCheckboxFactory.getMeanCheckboxItem( model.isPlayAreaMeanVisibleProperty, model.selectedSceneModelProperty )
    ], {
      tandem: this.soccerAreaTandem.createTandem( 'checkboxGroup' ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } ), this.soccerAreaTandem );

    const predictMeanTandem = this.soccerAreaTandem.createTandem( 'predictMeanNode' );
    const predictMeanNode = new PredictionSlider( model.predictMeanValueProperty, this.modelViewTransform,
      CAVConstants.PHYSICAL_RANGE, {
        predictionThumbNodeOptions: {
          color: CAVColors.meanColorProperty,
          style: 'arrow'
        },
        valueProperty: model.predictMeanValueProperty,
        enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
        roundToInterval: null, // continuous
        visibleProperty: model.isPredictMeanVisibleProperty,
        accessibleName: CenterAndVariabilityStrings.a11y.common.meanPredictionSlider.accessibleNameStringProperty,
        pdomMapPDOMValue: value => roundToInterval( value, 0.1 ),
        tandem: predictMeanTandem,

        // It is rare to feature a NodeIO, but in this case it is important since the only other featured children
        // are LinkedElementIO, so this makes it appear in the featured tree.
        phetioFeatured: true
      } );

    this.backScreenViewLayer.addChild( predictMeanNode );

    const predictMedianNode = CAVScreenView.createPredictMedianNode(
      model.predictMedianValueProperty,
      model.isPredictMedianVisibleProperty,
      this.modelViewTransform,
      this.soccerAreaTandem.createTandem( 'predictMedianNode' )
    );
    this.backScreenViewLayer.addChild( predictMedianNode );

    const infoDialog = new MeanAndMedianInfoDialog(
      model,
      model.sceneModels[ 0 ],
      this.playAreaNumberLineNode,
      accordionBoxTandem.createTandem( 'infoDialog' )
    );

    model.infoButtonPressedEmitter.addListener( () => infoDialog.show() );

    this.cavSetPDOMOrder( controls, [ predictMedianNode, predictMeanNode ], meanAndMedianAccordionBox.infoButton );
  }
}

centerAndVariability.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );